function getTomorrowWeather() {
  const WEATHER_API_KEY = "af29917991f77381bdb6d4bb573530d2";

  const url =
    "https://api.openweathermap.org/data/2.5/forecast" +
    "?q=Osaka,jp" +
    "&appid=" + WEATHER_API_KEY +
    "&units=metric" +
    "&lang=ja";

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  const city = data.city.name;

  // 明日の日付
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const targetDate =
    Utilities.formatDate(
      tomorrow,
      "Asia/Tokyo",
      "yyyy-MM-dd"
    );

  let maxTemp = -100;
  let minTemp = 100;
  let rainProbability = 0;
  let weather = "";


  data.list.forEach(function(item) {
    if (item.dt_txt.indexOf(targetDate) === 0) {

      maxTemp =
        Math.max(maxTemp, item.main.temp_max);

      minTemp =
        Math.min(minTemp, item.main.temp_min);

      rainProbability =
        Math.max(
          rainProbability,
          item.pop
        );

      if (item.dt_txt.indexOf(targetDate + " 12:00:00") === 0) {
  weather = item.weather[0].description;
}

    }

  });

  return (
  "🌤 明日の天気（" + city + "）\n" +
    "天気：" + weather + "\n" +
    "🌡 最高：" + Math.round(maxTemp) + "℃\n" +
    "🌡 最低：" + Math.round(minTemp) + "℃\n" +
    "☔ 降水確率：" +
    Math.round(rainProbability * 100) +
    "%"
  );

}

function getTodayWeather() {

  const WEATHER_API_KEY = "af29917991f77381bdb6d4bb573530d2";

  const url =
  "https://api.openweathermap.org/data/2.5/forecast" +
  "?q=Osaka,jp" +
  "&appid=" + WEATHER_API_KEY +
  "&units=metric" +
  "&lang=ja";

  const response = UrlFetchApp.fetch(url);
  const today = new Date();

const targetDate =
  Utilities.formatDate(
    today,
    "Asia/Tokyo",
    "yyyy-MM-dd"
  );
  const data = JSON.parse(response.getContentText());
  const city = data.city.name;

  let maxTemp = -100;
let minTemp = 100;
let weather = "";
let humidity = 0;
let rainProbability = 0;

  data.list.forEach(function(item) {

  if (item.dt_txt.indexOf(targetDate) === 0) {

    maxTemp = Math.max(maxTemp, item.main.temp_max);

    minTemp = Math.min(minTemp, item.main.temp_min);

    if (weather === "") {
      weather = item.weather[0].description;
      humidity = item.main.humidity;
    }

    if (item.dt_txt.indexOf(targetDate + " 12:00:00") === 0) {
      weather = item.weather[0].description;
      humidity = item.main.humidity;
    }

    rainProbability = Math.max(
  rainProbability,
  item.pop
);

  }

});

  return (
  "🌤 今日の天気（" + city + "）\n" +
  "天気：" + weather + "\n" +
  "🌡 最高：" + Math.round(maxTemp) + "℃\n" +
  "🌡 最低：" + Math.round(minTemp) + "℃\n" +
  "☔ 降水確率：" +
  Math.round(rainProbability * 100) + "%\n" +
  "💧湿度：" + humidity + "%"
);


}
