// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { removeVietnameseTones } from '../../../utils/convertString';
export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readPhuTung = (name) => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    let objData;

    readerStream.on('end', async function () {
      objData = JSON.parse(data);
      const index = objData.phutungs
        .map((obj) => removeVietnameseTones(Object.keys(obj)[0]))
        .findIndex((item) => item === removeVietnameseTones(name));

      if (index === -1) {
        return res.status(400).json({ error: 'Loại phụ tùng không tồn tại' });
      }

      const obj = objData.phutungs.splice(index, 1);
      await writePhuTung(objData);
      return res.json({ name: Object.keys(obj[0])[0] });
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
      return res.status(500).json({ error: err.message });
      // return { error: err.message };
    });
  };

  const writePhuTung = async (data) => {
    const writeStream = fs.createWriteStream(filePathInput);
    await writeStream.write(JSON.stringify(data));
    writeStream.end();
    writeStream.on('finish', () => {
      console.log('Finished');
    });
    writeStream.on('error', function (err) {
      console.log(err.stack);
    });
  };
  if (req.method === 'DELETE') {
    const name = req.body.name;
    try {
      readPhuTung(name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
