// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { removeVietnameseTones } from '../../../utils/convertString';

export default function readAll(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readPhuTung = (name) => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    readerStream.on('end', async function () {
      const objArray = JSON.parse(data);

      const nameArray = objArray.phutungs.flatMap(
        (obj) => obj[Object.keys(obj)[0]]
      );

      const newArray = nameArray.filter((item) =>
        removeVietnameseTones(item.name).includes(removeVietnameseTones(name))
      );

      return res.json({ lists: newArray });
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
      return res.json({ error: err.message });
    });
  };

  if (req.method === 'POST') {
    const { name } = req.body;

    try {
      readPhuTung(name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
