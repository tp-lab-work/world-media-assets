const { google } = require("googleapis");
const fs = require("fs");

// 引数の取得
const serviceAccountJsonPath = process.env.SERVICE_ACCOUNT_JSON_PATH;
const spreadsheetFileId = process.env.SPREADSHEET_FILE_ID;
const destinationPath = process.env.DESTINATION_PATH;
console.log("serviceAccountJsonPath", serviceAccountJsonPath);
console.log("spreadsheetFileId", spreadsheetFileId);
console.log("destinationPath", destinationPath);

const auth = new google.auth.GoogleAuth({
  keyFile: serviceAccountJsonPath,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

const dest = fs.createWriteStream(destinationPath);
drive.files.export(
  { fileId: spreadsheetFileId, mimeType: "text/csv" },
  { responseType: "stream" },
  (err, res) => {
    if (err) {
      console.error("Error exporting file:", err);
      throw err;
    }
    if (!res || !res.data) {
      console.error("Response is undefined or missing data.");
      throw new Error("Response is undefined or missing data.");
    }
    data.pipe(dest);
  }
);
