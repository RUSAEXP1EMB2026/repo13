function getSheet(name) {
  const SPREADSHEET_ID = '1uLGWYDHOKTMVifKhlO9ZN-AfGoZUJWk9l6KV2zMeOKg'
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(name);

  if (!sheet) {
    throw new Error('シートが見つかりません');
  }

  return sheet;
}

function getLastData(name) {
  return getSheet(name).getDataRange().getValues().length;
}