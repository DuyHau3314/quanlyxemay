import Moto from '../../NhuaSchema';
import { removeVietnameseTones } from '../../../utils/convertString';
export const check = async (req, res) => {
  const { name, code } = req.body;
  try {
    if (code.length === 0) {
      const moto = await Moto.findOne({
        'categories.convertName': removeVietnameseTones(name),
        _id: req.query.id,
      });

      if (moto) {
        return res.status(400).json({
          error: 'Tên hàng đã tồn tại',
        });
      }

      return res.status(200).json({});
    }

    if (name.length === 0) {
      const moto = await Moto.findOne({
        'categories.code': removeVietnameseTones(code),
        _id: req.query.id,
      });

      if (moto) {
        return res.status(400).json({
          error: 'Mã hàng đã tồn tại',
        });
      }

      return res.status(200).json({});
    }

    if (name.length > 0 && code.length > 0) {
      const moto = await Moto.findOne({
        'categories.convertName': removeVietnameseTones(name),
        'categories.code': code,
        _id: req.query.id,
      });

      if (moto) {
        return res.status(400).json({
          error: 'Mã và tên hàng đã tồn tại',
        });
      }

      return res.status(200).json({});
    }
  } catch (error) {
    return res.status(400).json({ error: 'Kiểm tra lỗi' });
  }
};
