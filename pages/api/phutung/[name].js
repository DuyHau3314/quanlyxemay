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
      let objKey = '';
      const category = objData.phutungs.find((obj) => {
        objKey = Object.keys(obj)[0];
        return removeVietnameseTones(Object.keys(obj)[0]) === name;
      });
      if (!category) {
        return res.status(400).json({ error: 'Loại phụ tùng không tồn tại' });
      }

      return res.json({ list: category[objKey] });
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
      return res.json({ error: err.message });
      // return { error: err.message };
    });
  };

  if (req.method === 'GET') {
    try {
      const name = req.query.name;
      readPhuTung(name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
