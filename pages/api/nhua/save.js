// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { removeVietnameseTones } from '../../../utils/convertString';
export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'nhuainput.json');

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
      const category = objData.nhuas
        .map((obj) => removeVietnameseTones(Object.keys(obj)[0]))
        .find((item) => item === removeVietnameseTones(name));

      if (category) {
        return res.status(400).json({ error: 'Loại xe đã tồn tại' });
      }

      objData.nhuas.push({ [name]: [] });

      objData.nhuas.sort((a, b) =>
        removeVietnameseTones(Object.keys(a)[0]).localeCompare(
          removeVietnameseTones(Object.keys(b)[0])
        )
      );
      await writePhuTung(objData);
      return res.json({ name });
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
