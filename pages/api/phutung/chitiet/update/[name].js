// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function updateCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readChiTietPhuTung = (product) => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    let objData;

    readerStream.on('end', async function () {
      objData = JSON.parse(data);
      let tenPhutung = '';
      const { id, code, name, gianhap, giaban, giathay, soluong, chuthich } =
        product;
      const phutungIndex = objData.phutungs.findIndex((obj) => {
        tenPhutung = Object.keys(obj)[0];
        return removeVietnameseTones(Object.keys(obj)[0]) === req.query.name;
      });

      if (phutungIndex === -1) {
        return res.status(404).json({ error: 'Loại hàng không tồn tại' });
      }

      const phutung = {
        id: id,
        code: code,
        name,
        gianhap: parseFloat(gianhap),
        giaban: parseFloat(giaban),
        giathay: parseFloat(giathay),
        soluong: parseFloat(soluong),
        chuthich,
      };

      const indexChitiet = objData.phutungs[phutungIndex][tenPhutung].findIndex(
        (product) => product.id === id
      );

      //   if (!indexChitiet) {
      //     return res.status(400).json({ error: 'Phụ tùng không tồn tại.' });
      //   }

      objData.phutungs[phutungIndex][tenPhutung][indexChitiet] = phutung;

      writePhuTung(objData);

      return res.status(201).json(phutung);
    });

    readerStream.on('error', function (err) {
      console.log(err.stack);
      return res.status(400).json({ error: err.message });
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
    try {
      readChiTietPhuTung(req.body);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
