// =====================
// トークン取得（一元管理）
// =====================
function getLineToken() {
  return "LIAYsP9ncnaQx8kgEUBmy8ZX2wgAtRUQ61vTwK/1CtJQYcL2/TNaQfOu0tPhqnCQJxKBLAfu0jux4dDhzjhijeHG+YZ0XEGylPESHM4NS6RTVIVo/T+Jq03pcASlNQ/AXCdgOuQ/YXcUa9uASKxRqQdB04t89/1O/w1cDnyilFU=";
}

// =====================
// LINE送信（push）
// =====================
function sendLine(userId, message) {
  const url = "https://api.line.me/v2/bot/message/push";

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getLineToken(),
    },
    payload: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: message }]
    })
  });
}

// =====================
// LINE返信（reply）
// =====================
function replyMessage(token, message) {
  const url = "https://api.line.me/v2/bot/message/reply";

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getLineToken(),
    },
    payload: JSON.stringify({
      replyToken: token,
      messages: [{ type: "text", text: message }]
    })
  });
}

// =====================
// LINE返信（2件同時）
// =====================
function replyTwoMessages(token, msg1, msg2) {
  const url = "https://api.line.me/v2/bot/message/reply";

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getLineToken(),
    },
    payload: JSON.stringify({
      replyToken: token,
      messages: [
        { type: "text", text: msg1 },
        { type: "text", text: msg2 }
      ]
    })
  });
}

// =====================
// LINE返信（3件同時）
// =====================
function replyThreeMessages(token, msg1, msg2, msg3) {

  const url = "https://api.line.me/v2/bot/message/reply";

  UrlFetchApp.fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + getLineToken(),
    },
    payload: JSON.stringify({
      replyToken: token,
      messages: [
        { type: "text", text: msg1 },
        { type: "text", text: msg2 },
        { type: "text", text: msg3 }
      ]
    })
  });

}