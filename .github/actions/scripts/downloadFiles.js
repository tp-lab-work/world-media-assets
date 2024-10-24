const fs = require('fs');
const { google } = require('googleapis');

// 認証設定
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.SERVICE_ACCOUNT_JSON_PATH,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

const drive = google.drive({ version: 'v3', auth });

async function downloadFileByQuery() {
  try {
    // クエリを使用してファイルを検索
    const res = await drive.files.list({
      q: process.env.QUERY,
      fields: 'files(id, name)',
      // pageSize: 1, // 検索結果の数を制限
    });

    if (res.data.files.length === 0) {
      console.log('No files found.');
      return;
    }

    const file = res.data.files[0];
    console.log(`Found file: ${file.name} (${file.id})`);

    // ファイルをダウンロード
    const destPath = `${process.env.PATH}/${file.name}`;
    const dest = fs.createWriteStream(destPath);
    const response = await drive.files.get({
      fileId: file.id,
      alt: 'media',
    }, { responseType: 'stream' });

    response.data
      .on('end', () => {
        console.log(`Downloaded file to ${destPath}`);
      })
      .on('error', (err) => {
        console.error('Error downloading file:', err);
      })
      .pipe(dest);
  } catch (err) {
    console.error('Error:', err);
  }
}

downloadFileByQuery();

// const {google} = require('googleapis');
// const fs = require('fs');
// const path = require('path');

// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
// );
// oauth2Client.setCredentials({
//   refresh_token: process.env.GOOGLE_REFRESH_TOKEN
// });

// const drive = google.drive({ version: 'v3', auth: oauth2Client });

// // 複数のファイルIDを指定
// const fileIds = JSON.parse(process.env.IMAGE_FILE_IDS);

// async function downloadFile(fileId, fileName) {
//   const dest = fs.createWriteStream(fileName);
//   const response = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' });
//   return new Promise((resolve, reject) => {
//     response.data
//       .on('end', () => {
//         console.log(`Downloaded ${fileName}`);
//         resolve();
//       })
//       .on('error', err => {
//         console.error(`Error downloading file ${fileName}:`, err);
//         reject(err);
//       })
//       .pipe(dest);
//   });
// }

// (async () => {
//   for (const { id, name } of fileIds) {
//     await downloadFile(id, name);
//   }
// })();
