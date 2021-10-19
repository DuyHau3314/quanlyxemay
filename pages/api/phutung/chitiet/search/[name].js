import path from 'path';
import fs from 'fs';
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function checkChiTiet(req, res) {
  const filePathInput = path.join(process.cwd(), 'data', 'xemayinput.json');

  const readPhuTung = (code = '', name = '') => {
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
      let arrayName = [];
      let arrayCode = [];
      let arrayBoth = [];
      if (code.length === 0 && name.length === 0) {
        return res.status(200).json({ message: 'Không nhập mã và tên hàng' });
      }
      if (phutung && tenPhutung) {
        for (const obj of phutung[tenPhutung]) {
          if (
            removeVietnameseTones(obj.code).includes(
              removeVietnameseTones(code)
            ) &&
            name.length === 0
          ) {
            arrayName = [];
            arrayBoth = [];
            arrayCode.push(obj);
          }
          if (
            removeVietnameseTones(obj.name).includes(
              removeVietnameseTones(name)
            ) &&
            code.length === 0
          ) {
            arrayCode = [];
            arrayBoth = [];
            arrayName.push(obj);
          }

          if (
            removeVietnameseTones(obj.name).includes(
              removeVietnameseTones(name)
            ) &&
            removeVietnameseTones(obj.code).includes(
              removeVietnameseTones(code)
            ) &&
            name.length > 0 &&
            code.length > 0
          ) {
            arrayCode = [];
            arrayBoth = [];
            arrayBoth.push(obj);
          }
        }
      } else {
        return res.status(404).json({ error: 'Không có loại phụ tùng' });
      }

      if (arrayCode.length > 0) {
        return res.status(200).json(arrayCode);
      }
      if (arrayBoth.length > 0) {
        return res.status(200).json(arrayBoth);
      }
      if (arrayName.length > 0) {
        return res.status(200).json(arrayName);
      }

      return res.status(404).json({ error: 'Không có loại phụ tùng' });
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
