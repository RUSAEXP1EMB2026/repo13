function getNatureRemoData(endpoint) {
  const REMO_ACCESS_TOKEN = 'ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI'
  const headers = {
    "Content-Type" : "application/json;",
    'Authorization': 'Bearer ' + REMO_ACCESS_TOKEN,
  };

  const options = {
    "method" : "get",
    "headers" : headers,
  };

  return JSON.parse(UrlFetchApp.fetch("https://api.nature.global/1/" + endpoint, options));
}

function setAirconTemperature(appliance,temp) {

  const REMO_ACCESS_TOKEN = "ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI";


  const url =
    "https://api.nature.global/1/appliances/" +
    appliance.id +
    "/aircon_settings";

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Bearer " + REMO_ACCESS_TOKEN
  };

  const payload = {
    operation_mode: "cool",
    temperature: String(temp),
    temperature_unit: "c",
    air_volume: "auto",
    air_direction: "1",
    button: ""
  };

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: headers,
    payload: payload
  });
}

function turnOnAircon(temp) {

  const REMO_ACCESS_TOKEN = 'ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI';

  const appliances = getNatureRemoData("appliances");


  const appliance = appliances.find(a => a.type === "AC");

  const url =
    "https://api.nature.global/1/appliances/" +
    appliance.id +
    "/aircon_settings";

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      Authorization: "Bearer " + REMO_ACCESS_TOKEN
    },
    payload: {
      operation_mode: "cool",
      temperature: String(temp),
      temperature_unit: "c",
      air_volume: "auto",
      air_direction: "1"
    },
    muteHttpExceptions: true
  });

  Logger.log(response.getResponseCode());
  Logger.log(response.getContentText());
}

function turnOffAircon() {

  const REMO_ACCESS_TOKEN =
    'ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI';

  const appliances = getNatureRemoData("appliances");

  const appliance = appliances.find(
    a => a.type === "AC"
  );


  // エアコンが見つからない場合
  if (!appliance) {

    Logger.log("エアコンが見つかりません");

    return;

  }


  const url =
    "https://api.nature.global/1/appliances/" +
    appliance.id +
    "/aircon_settings";


  const response = UrlFetchApp.fetch(url, {

    method: "post",

    headers: {
      Authorization:
        "Bearer " + REMO_ACCESS_TOKEN
    },

    payload: {
      button: "power-off"
    },

    muteHttpExceptions: true

  });


  Logger.log(
    "エアコンOFF:" +
    response.getResponseCode()
  );

  Logger.log(
    response.getContentText()
  );

}

function setDryMode(appliance, temp) {

  const REMO_ACCESS_TOKEN =
  'ory_at_xFVyR14Pw0aX3dcbw6x5RJClR3ep52LjWPLZBzkoEG8.5tEuYfHCynlkW1Cd8Crq1ShOF2IzP8s2LLZTfrzZmYI';


  const url =
    "https://api.nature.global/1/appliances/" +
    appliance.id +
    "/aircon_settings";

  UrlFetchApp.fetch(url, {

    method: "post",

    headers: {
      Authorization:
        "Bearer " + REMO_ACCESS_TOKEN
    },

    payload: {

      operation_mode: "dry",

      temperature: String(temp),

      temperature_unit: "c",

      air_volume: "auto"

    }

  });

}


function setCoolMode(appliance, temp){

    setAirconTemperature(appliance, temp);

}

function checkLightInfo() {
  Logger.log(
    JSON.stringify(
      getNatureRemoData("appliances"),
      null,
      2
    )
  );
}

function checkLightOnly() {
  const appliances = getNatureRemoData("appliances");

  appliances.forEach(a => {
    Logger.log(
      "type=" + a.type +
      " nickname=" + a.nickname
    );
  });

}