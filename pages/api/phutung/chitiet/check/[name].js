import path from 'path';
import fs from 'fs';
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function checkChiTiet(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readPhuTung = (code, name) => {
    let readerStream = fs.createReadStream(filePathInput);
    let data = '';

    readerStream.setEncoding('utf8');

    readerStream.on('data', function (chunk) {
      data += chunk;
    });

    readerStream.on('end', async function () {
      const objData = JSON.parse(data);
      let tenPhutung = '';
      const phutung = objData.phutungs.find((obj) => {
        tenPhutung = Object.keys(obj)[0];
        return removeVietnameseTones(Object.keys(obj)[0]) === req.query.name;
      });

      if (phutung && tenPhutung) {
        for (const obj of phutung[tenPhutung]) {
          if (
            obj.code.toLowerCase() === code.toLowerCase() &&
            obj.name.toLowerCase() !== name.toLowerCase()
          ) {
            return res.status(400).json({
              error: 'Mã hàng đã tồn tại.',
            });
          }
          if (
            obj.name.toLowerCase() === name.toLowerCase() &&
            obj.code.toLowerCase() !== code.toLowerCase()
          ) {
            return res.status(400).json({
              error: 'Tên hàng đã tồn tại',
            });
          }

          if (
            obj.name.toLowerCase() === name.toLowerCase() &&
            obj.code.toLowerCase() === code.toLowerCase()
          ) {
            return res.status(400).json({
              error: 'Tên hàng và mã đã tồn tại',
            });
          }
        }
      } else {
        return res.status(404).json({ error: 'Không có loại phụ tùng' });
      }
      return res.status(200).json({ ok: 'ok' });
    });
  };

  if (req.method === 'POST') {
    try {
      const { code, name } = req.body;
      readPhuTung(code, name);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
