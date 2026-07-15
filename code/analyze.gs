//=====================
// 就寝時刻の記録
// =====================
// Main.gs で「寝る」メッセージを受信したタイミングで呼び出す想定である。
// 新規行を1件追加し、起床時刻と睡眠時間は空欄のまま登録する。
function recordBedTime(userId) {
  const sheet = getSheet("sleep_history");
  const bedTime = new Date();

  sheet.appendRow([userId, bedTime, "", ""]);

  // B列（就寝時刻）に秒までの表示書式を設定する
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 2).setNumberFormat("yyyy/MM/dd HH:mm:ss");

  return bedTime;
}


// =====================
// 起床時刻の記録
// =====================
// Main.gs で「起きた」メッセージを受信したタイミングで呼び出す想定である。
// アラーム経由か否かにかかわらず呼び出される（Main.gs側の分岐で制御する）。
// 対象ユーザーの「起床時刻が未記録の行」のうち、最も新しい行を更新する。
function recordWakeTime(userId) {
  const sheet = getSheet("sleep_history");
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    const rowUserId = data[i][0];
    const wakeTimeCell = data[i][2];

    if (rowUserId === userId && wakeTimeCell === "") {
      const bedTime = data[i][1];
      const wakeTime = new Date();
      const sleepHours = calculateSleepHours(bedTime, wakeTime);

      const wakeTimeRange = sheet.getRange(i + 1, 3);
      wakeTimeRange.setValue(wakeTime);
      wakeTimeRange.setNumberFormat("yyyy/MM/dd HH:mm:ss");

      sheet.getRange(i + 1, 4).setValue(sleepHours);

      return { bedTime: bedTime, wakeTime: wakeTime, sleepHours: sleepHours };
    }
  }

  // 就寝記録が見つからない場合は null を返す
  return null;
}


// =====================
// 睡眠時間の計算（時間単位・小数第1位）
// =====================
function calculateSleepHours(bedTime, wakeTime) {
  const diffMs = wakeTime.getTime() - bedTime.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  return Math.round(hours * 10) / 10;
}


// =====================
// 睡眠統計の算出
// =====================
// 直近 days 件（デフォルト7件）の完了済み記録から、
// 平均睡眠時間と平均就寝時刻の傾向を算出する。
// 記録が1件も無い場合は null を返す。
function getSleepStats(userId, days) {
  const targetDays = days || 7;
  const sheet = getSheet("sleep_history");
  const data = sheet.getDataRange().getValues();

  const records = [];
  for (let i = 1; i < data.length; i++) {
    const rowUserId = data[i][0];
    const sleepHoursCell = data[i][3];

    if (rowUserId === userId && sleepHoursCell !== "") {
      records.push({
        bedTime: data[i][1],
        wakeTime: data[i][2],
        sleepHours: Number(sleepHoursCell)
      });
    }
  }

  if (records.length === 0) {
    return null;
  }

  // appendRow により末尾が最新記録となるため、末尾から targetDays 件を取得する
  const recent = records.slice(-targetDays);

  const totalSleepHours = recent.reduce(function (sum, r) {
    return sum + r.sleepHours;
  }, 0);
  const avgSleepHours = totalSleepHours / recent.length;

  const bedMinutesList = recent.map(function (r) {
    return toBedMinutes(r.bedTime);
  });
  const totalBedMinutes = bedMinutesList.reduce(function (sum, m) {
    return sum + m;
  }, 0);
  const avgBedMinutes = totalBedMinutes / bedMinutesList.length;

  return {
    count: recent.length,
    avgSleepHours: Math.round(avgSleepHours * 10) / 10,
    avgBedTime: minutesToTimeString(avgBedMinutes),
    latestSleepHours: recent[recent.length - 1].sleepHours
  };
}


// =====================
// 就寝時刻を「正午基準の分数」へ変換する
// =====================
// 21時就寝と翌1時就寝が混在する場合、単純な時刻平均では
// 傾向が正しく算出できない。正午（12:00）を起点とした
// 24時間循環の分数に変換することで、この問題を回避する。
function toBedMinutes(bedTime) {
  const hours = bedTime.getHours();
  const minutes = bedTime.getMinutes();
  let totalMinutes = hours * 60 + minutes;

  if (totalMinutes < 12 * 60) {
    totalMinutes += 24 * 60;
  }

  return totalMinutes;
}


// =====================
// 分数を "HH:mm" 形式の文字列へ変換する
// =====================
function minutesToTimeString(totalMinutes) {
  const normalized = Math.round(totalMinutes) % (24 * 60);
  const hours = Math.floor(normalized / 60) % 24;
  const minutes = normalized % 60;

  return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
}


// =====================
// アドバイス文の生成
// =====================
// 平均睡眠時間と前回（直近）の睡眠時間を比較し、差分に応じた
// アドバイス文を組み立てる。差分が±30分未満の場合は「平均通り」と判定する。
function buildAdviceMessage(stats) {
  const diff = Math.round((stats.latestSleepHours - stats.avgSleepHours) * 10) / 10;

  let trendComment;
  if (diff <= -0.5) {
    trendComment =
      "昨日は平均より" + Math.abs(diff) + "時間睡眠が短い結果である。" +
      "今夜は少し早めに就寝しよう。";
  } else if (diff >= 0.5) {
    trendComment =
      "昨日は平均より" + diff + "時間長く眠れている。" +
      "このリズムを維持しよう。";
  } else {
    trendComment = "睡眠時間はほぼ平均通りである。";
  }

  return (
    "📊 睡眠分析結果\n" +
    "平均睡眠時間：" + stats.avgSleepHours + "時間\n" +
    "平均就寝時刻：" + stats.avgBedTime + "\n" +
    "昨日の睡眠時間：" + stats.latestSleepHours + "時間\n" +
    trendComment
  );
}


// =====================
// 睡眠アドバイスの送信
// =====================
// getSleepStats で統計を算出し、buildAdviceMessage で文面を組み立てた上で
// sendLine（Line.gs）を通じてユーザーへ送信する。
// 記録が2件未満の場合は、傾向分析が不可能であるため専用メッセージを送る。
function sendSleepAdvice(userId) {
  const stats = getSleepStats(userId, 7);

  if (stats === null || stats.count < 2) {
    sendLine(
      userId,
      "睡眠データがまだ十分に蓄積されていません。数日分の記録が集まり次第、分析結果を送ります。"
    );
    return;
  }

  const message = buildAdviceMessage(stats);
  sendLine(userId, message);
}