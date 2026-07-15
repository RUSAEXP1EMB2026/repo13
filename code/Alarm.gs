// =====================
// 時間保存
// =====================
function saveWakeTime(userId, time) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");
  const data = sheet.getDataRange().getValues();
  const formattedTime = formatTime(time);

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.getRange(i + 1, 2).setNumberFormat('@')
                               .setValue(formattedTime);
      return;
    }
  }

  const lastRow = sheet.getLastRow() + 1;
  sheet.appendRow([userId, formattedTime, "waiting_temp"]);
  sheet.getRange(lastRow, 2).setNumberFormat('@');
}

// =====================
// 時間フォーマット
// =====================
function formatTime(time) {
  const parts = time.split(":");
  return ("0" + parts[0]).slice(-2) + ":" + parts[1];
}

// =====================
// 状態取得
// =====================
function getUserStatus(userId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return data[i][2];
    }
  }
  return "";
}

// =====================
// 状態更新
// =====================
function setUserStatus(userId, status) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      sheet.getRange(i + 1, 3).setValue(status);
      return;
    }
  }

  sheet.appendRow([userId, "", status]);
}

// =====================
// 時間チェック（トリガー）
// =====================
function checkWakeTime() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const now = new Date();
  const current = Utilities.formatDate(now, "Asia/Tokyo", "HH:mm");

  for (let loop = 0; loop < 12; loop++) {
    const data = sheet.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      const userId = data[i][0];
      const rawTime = data[i][1];
      const status = data[i][2];

      let wakeTime;
      if (rawTime instanceof Date) {
        wakeTime = Utilities.formatDate(rawTime, "Asia/Tokyo", "HH:mm");
      } else {
        wakeTime = String(rawTime);
      }

      if (wakeTime === current && status === "done") {
        setUserStatus(userId, "ringing");
        sendLine(userId, "🌞 起きる時間です！");
      } else if (status === "ringing") {
        // 送信直前にシートを再読み込みして最新statusを確認
        const latestStatus = getUserStatus(userId);
        if (latestStatus === "ringing") {
          sendLine(userId, "🌞 起きる時間です！");
        }
      }
    }

    if (loop < 11) {
      Utilities.sleep(5000);
    }
  }
}

function saveTargetTemperature(userId,temp){

  const sheet =
    SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data=sheet.getDataRange().getValues();

  for(let i=1;i<data.length;i++){

    if(data[i][0]==userId){

      sheet.getRange(i+1,4).setValue(temp);

      return;

    }

  }

}

function getTargetTemperature(userId) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] === userId) {
      return Number(data[i][3]);
    }

  }

  return null;

}

function saveTargetHumidity(userId, humidity) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] == userId) {

      sheet.getRange(i + 1, 5).setValue(humidity);

      return;

    }

  }

}

function getTargetHumidity(userId) {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] == userId) {

      return Number(data[i][4]);

    }

  }

  return null;

}