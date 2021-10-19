// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { removeVietnameseTones } from '../../../utils/convertString';
export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'nhuainput.json');

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

      const newData = objData.nhuas.map((obj) => {
        if (Object.keys(obj)[0] === name) {
          return renameKeys(obj, { [name]: nameUpdate });
        }
        return obj;
      });

      objData.nhuas.length = 0;
      await objData.nhuas.push.apply(objData.nhuas, newData);
      await writePhuTung(objData);

      return res.json({ name: nameUpdate });
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
  if (req.method === 'PUT') {
    const name = req.body.name;
    const nameUpdate = req.body.nameUpdate;
    try {
      readPhuTung(name, nameUpdate);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
