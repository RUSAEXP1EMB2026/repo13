function controlAirConditioner() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("alarm_setting");

  const data = sheet.getDataRange().getValues();

  // Nature Remoの情報を一度だけ取得
const devices = getNatureRemoData("devices");
const appliances = getNatureRemoData("appliances");

// 部屋の状態
const roomTemp = devices[0].newest_events.te.val;
const roomHumidity = devices[0].newest_events.hu.val;

// エアコン情報
const appliance = appliances.find(a => a.type === "AC");
let settingTemp = Number(appliance.settings.temp);

const props = PropertiesService.getScriptProperties();

const acMode =
  props.getProperty("AC_MODE") || "cool";


  for (let i = 1; i < data.length; i++) {

    const userId = data[i][0];
    const status = data[i][2];

    if (status !== "done") continue;

    const target = getTargetTemperature(userId);

    if (target == null) continue;

    const targetHumidity = getTargetHumidity(userId);

    const tempDiff = Math.abs(roomTemp - target);
    if (acMode === "dry") {

  if (tempDiff >= 1) {

    setCoolMode(appliance, target);

    props.setProperty("AC_MODE", "cool");

  }

  continue;

}

  if (tempDiff > 0.5) {

    if (roomTemp > target) {

        settingTemp--;

    } else {

        settingTemp++;

    }

    settingTemp = Math.max(18, Math.min(32, settingTemp));

    setAirconTemperature(appliance, settingTemp);

    continue;

}
if (roomHumidity > targetHumidity + 3) {

    setDryMode(appliance, target);

    props.setProperty("AC_MODE", "dry");

    continue;

}
else if (roomHumidity < targetHumidity - 3) {

    setCoolMode(appliance, target);

}

    // 設定温度の範囲を18〜32℃に制限
    settingTemp = Math.max(18, Math.min(32, settingTemp));

    setAirconTemperature(appliance, settingTemp);



    Logger.log(
      "室温:" + roomTemp +
      " 目標:" + target +
      " 設定温度:" + settingTemp
    );
  }

}