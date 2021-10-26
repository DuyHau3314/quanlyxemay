import Moto from '../NhuaSchema';
import { removeVietnameseTones } from '../../utils/convertString';

export const update = async (req, res) => {
  const { id, nameUpdate } = req.body;

  try {
    const moto = await Moto.findById(id).select('-categories');

    if (!moto) {
      return res.status(404).json({
        error: 'Không tìm thấy loại hàng',
      });
    }

    moto.name = nameUpdate;
    moto.convertName = removeVietnameseTones(nameUpdate);

    await moto.save();

    return res.status(200).json({
      moto: moto,
    });
  } catch (error) {
    return res.json({ error: 'Cập nhật loại hàng lỗi' });
  }
};
