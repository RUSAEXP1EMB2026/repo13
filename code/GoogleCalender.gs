// =====================
// GoogleCalendar.gs
// 明日の予定取得
// =====================

function getTomorrowEvents() {

  const calendar = CalendarApp.getDefaultCalendar();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const start = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    0, 0, 0
  );

  const end = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    23, 59, 59
  );

  const events = calendar.getEvents(start, end);

  if (events.length === 0) {
    return "📅 明日の予定はありません。";
  }

  let message = "📅 明日の予定\n\n";

  events.forEach(function(event) {

    message +=
      Utilities.formatDate(
        event.getStartTime(),
        "Asia/Tokyo",
        "HH:mm"
      ) +
      " " +
      event.getTitle() +
      "\n";

  });

  message +=
    "\n明日は" +
    events.length +
    "件予定があります。";

  return message;
}