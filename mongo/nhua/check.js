import Moto from '../NhuaSchema';
import { removeVietnameseTones } from '../../utils/convertString';
export const check = async (req, res) => {
  const { name } = req.body;
  try {
    const moto = await Moto.findOne({
      convertName: removeVietnameseTones(name),
    });

    if (!moto) {
      return res.status(404).json({
        error: 'Không tìm thấy',
      });
    }

    return res.status(404).json({
      data: moto,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Lỗi check loại hàng',
    });
  }
};
