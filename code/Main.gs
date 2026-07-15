// =====================
// Webhook受信
// =====================
function doPost(e) {
  const json = JSON.parse(e.postData.contents);
  const event = json.events[0];

  if (event.type !== "message") {
    return ContentService.createTextOutput("OK");
  }

  const userId = event.source.userId;
  const message = event.message.text;
  const status = getUserStatus(userId);


  // 全メッセージをuser_settingシートに記録する
  const logSheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("user_setting");
  logSheet.appendRow([new Date(), userId, message]);

  // 「起きた」処理（アラームの有無にかかわらず反応する）
  if (message === "起きた") {
    const wakeResult = recordWakeTime(userId);   // 起床時刻と睡眠時間をsleep_historyへ記録する
    const todayWeather = getTodayWeather();
    const light = getLightAppliance();
    if (status === "ringing") {
      setUserStatus(userId, "awake");
      replyMessage(event.replyToken,"✅おはようございます！" + todayWeather);
      turnOffAircon();
 

      pressLightButton(light, "on-100");
    } else {
      replyMessage(
        event.replyToken,"✅おはようございます！"+todayWeather
      );
      setUserStatus(userId, "awake");
      turnOffAircon();
        // 照明を全灯

      pressLightButton(light, "on-100");
      
    }

    if (wakeResult !== null) {
      sendSleepAdvice(userId);   // 就寝記録が存在する場合のみ分析結果を送信する
    }

    return ContentService.createTextOutput("OK");
  }

  // 「寝る」で2段階メッセージ
  if (message === "寝る") {
    setUserStatus(userId, "waiting");
    recordBedTime(userId);       // 就寝時刻を記録
    startSleepLight(userId);     // 照明フェードアウトを開始

    const tomorrowEvents = getTomorrowEvents();


  replyThreeMessages(

    event.replyToken,

    tomorrowEvents,

    "今日も１日お疲れ様です！\n快適な睡眠を提供するために起床時間とエアコンの温度・湿度の設定を行います。",

    "⏰ アラーム時間はいつにしますか？（例：7:00）"

  );
    return ContentService.createTextOutput("OK");
  }




  // 時間入力
  if (status === "waiting" && message.match(/^\d{1,2}:\d{2}$/)) {
    saveWakeTime(userId, message);
    setUserStatus(userId, "waiting_temp");
    replyMessage(
      event.replyToken,
      "🌡 希望室温(18℃〜32℃)を入力してください（例:26）"
    );
    return ContentService.createTextOutput("OK");
  }

  // 室温入力
  if (status === "waiting_temp" && message.match(/^\d+$/)) {
    const temp = Number(message);
    saveTargetTemperature(userId, temp);
    setUserStatus(userId, "waiting_humidity");
    replyMessage(
      event.replyToken,
      "💧希望湿度を入力してください（例:55）"
    );
    return ContentService.createTextOutput("OK");
  }

  // 湿度入力
  if (status === "waiting_humidity" && message.match(/^\d+$/)) {
    const humidity = Number(message);
    const tomorrowWeather = getTomorrowWeather();
    saveTargetHumidity(userId, humidity);
    const temp = getTargetTemperature(userId);
    turnOnAircon(temp);
    setUserStatus(userId, "done");
    replyMessage(
      event.replyToken,
      "✅ 温度：" + temp + "℃\n💧湿度：" + humidity + "% に設定しました。\n\n" + tomorrowWeather
    );
    return ContentService.createTextOutput("OK");
  }

  return ContentService.createTextOutput("OK");
}

function testCalendar() {
  Logger.log(getTomorrowEvents());
}