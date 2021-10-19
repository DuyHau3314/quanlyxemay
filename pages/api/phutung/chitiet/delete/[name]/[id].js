// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { removeVietnameseTones } from '../../../../../../utils/convertString';

export default function saveCategory(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readChiTietPhuTung = (id, name) => {
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

      // const phutungIndex = objData.phutungs.findIndex((obj) => Object.keys(obj)[0]);

      const phutungIndex = objData.phutungs.findIndex((obj) => {
        tenPhutung = Object.keys(obj)[0];
        return removeVietnameseTones(Object.keys(obj)[0]) === name;
      });

      if (phutungIndex === -1) {
        return res.status(404).json({ error: 'Loại hàng không tồn tại' });
      }

      const chitietIndex = objData.phutungs[phutungIndex][tenPhutung].findIndex(
        (obj) => obj.id === id
      );

      objData.phutungs[phutungIndex][tenPhutung].splice(chitietIndex, 1);

      writePhuTung(objData);

      return res.status(201).json({ message: 'Xoá sản phẩm thành công' });
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
  if (req.method === 'DELETE') {
    const { id, name } = req.query;
    try {
      readChiTietPhuTung(id, name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
