const { google } = require("googleapis");
const fs = require("fs");

// 引数の取得
const serviceAccountJsonPath = process.env.SERVICE_ACCOUNT_JSON_PATH;
const spreadsheetFileId = process.env.SPREADSHEET_FILE_ID;
const destinationPath = process.env.DESTINATION_PATH;

const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountJsonPath,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

const dest = fs.createWriteStream(destinationPath);
drive.files.export(
  { spreadsheetFileId, mimeType: "text/csv" },
  { responseType: "stream" },
  (err, { data }) => {
    if (err) throw err;
    data.pipe(dest);
  }
);
