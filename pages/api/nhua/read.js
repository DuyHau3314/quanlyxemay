// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';

export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'nhuainput.json');

  const readPhuTung = () => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    readerStream.on('end', async function () {
      const objArray = JSON.parse(data);

      const nameArray = objArray.nhuas.map((obj) => Object.keys(obj)[0]);
      return res.json({ lists: nameArray });
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
      return res.json({ error: err.message });
    });
  };

  if (req.method === 'GET') {
    try {
      readPhuTung();
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
