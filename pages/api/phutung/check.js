// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { removeVietnameseTones } from '../../../utils/convertString';
export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  function renameKeys(obj, newKeys) {
    const keyValues = Object.keys(obj).map((key) => {
      const newKey = newKeys[key] || key;
      return { [newKey]: obj[key] };
    });
    return Object.assign({}, ...keyValues);
  }

  const readPhuTung = (name, nameUpdate) => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    let objData;

    readerStream.on('end', async function () {
      objData = JSON.parse(data);

      let array = [];

      objData.phutungs.map((obj) => {
        if (removeVietnameseTones(Object.keys(obj)[0]).includes(name)) {
          array.push(Object.keys(obj)[0]);
        }
      });

      return res.status(200).json(array);
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
  if (req.method === 'POST') {
    const name = req.body.name;
    try {
      readPhuTung(name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
