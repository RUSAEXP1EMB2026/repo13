// =====================
// Light.gs
// =====================

// Nature Remo照明取得
function getLightAppliance() {

  return getNatureRemoData("appliances")
    .find(a => a.type === "LIGHT");

}

function pressLightButton(light, buttonName) {

  const REMO_ACCESS_TOKEN =
    'ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI';

  const url =
    "https://api.nature.global/1/appliances/" +
    light.id +
    "/light";

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: "Bearer " + REMO_ACCESS_TOKEN
    },
    payload: {
      button: buttonName
    },
    muteHttpExceptions: true
  });

  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}

// =====================
// 就寝開始
// 「寝る」が送られたら実行
// =====================

function startSleepLight(userId) {

  const light = getLightAppliance();
  const props =
    PropertiesService.getScriptProperties();


props.setProperty(
  "SLEEP_LIGHT_" + userId,
  "1"
);

for (let i = 0; i < 5; i++) {

  pressLightButton(light, "bright-down");

  Utilities.sleep(300);

}
}


// =====================
// 照明制御
// 1分ごとのトリガーで実行
// =====================

function controlLight() {

  const props =
    PropertiesService.getScriptProperties();

  const sheet =
    SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data =
    sheet.getDataRange().getValues();

  const now = new Date();

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  const light = getLightAppliance();

  for (let i = 1; i < data.length; i++) {
   const userId = data[i][0];

   let wakeTime;
   const rawTime = data[i][1];
   if (rawTime instanceof Date) {
    wakeTime = Utilities.formatDate(rawTime, "Asia/Tokyo", "HH:mm");
    } else {
      wakeTime = String(rawTime);
    }

    // =====================
    // 就寝フェードアウト
    // =====================

    let sleepStep =
      props.getProperty(
        "SLEEP_LIGHT_" + userId
      );

    if (sleepStep !== null) {

      sleepStep = Number(sleepStep);

      if (sleepStep < 4) {

  for (let i = 0; i < 5; i++) {

    pressLightButton(light, "bright-down");

    Utilities.sleep(300);

  }

  props.setProperty(
    "SLEEP_LIGHT_" + userId,
    String(sleepStep + 1)
  );

}
      else if (sleepStep === 4) {

        pressLightButton(light, "night");

        props.setProperty(
          "SLEEP_LIGHT_" + userId,
          "5"
        );

      }
      else if (sleepStep === 5) {

        pressLightButton(light, "off");

        props.deleteProperty(
          "SLEEP_LIGHT_" + userId
        );

      }

    }

    // =====================
    // 起床フェードイン
    // =====================

    const parts = wakeTime.split(":");

    if (parts.length !== 2) {
      continue;
    }

    const wakeMinutes =
      Number(parts[0]) * 60 +
      Number(parts[1]);

    const diff =
      wakeMinutes - currentMinutes;

    // 起床1分前
    if (diff === 1) {
    pressLightButton(light, "night");
}

else if (diff === 0) {
    pressLightButton(light, "on-100");
}
    
  }
}

function checkLightInfo() {

  const light = getNatureRemoData("appliances")
    .find(a => a.type === "LIGHT");

  Logger.log(
    JSON.stringify(light, null, 2)
  );

}