const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// 複数のファイルIDを指定
const fileIds = JSON.parse(process.env.IMAGE_FILE_IDS);

async function downloadFile(fileId, fileName) {
  const dest = fs.createWriteStream(fileName);
  const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
  return new Promise((resolve, reject) => {
    response.data
      .on('end', () => {
        console.log(`Downloaded ${fileName}`);
        resolve();
      })
      .on('error', err => {
        console.error(`Error downloading file ${fileName}:`, err);
        reject(err);
      })
      .pipe(dest);
  });
}

(async () => {
  for (const { id, name } of fileIds) {
    await downloadFile(id, name);
  }
})();
