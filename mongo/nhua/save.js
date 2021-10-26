import Moto from '../NhuaSchema';
import { removeVietnameseTones } from '../../utils/convertString';
const save = async (req, res) => {
  try {
    const { name } = req.body;

    const motoExist = await Moto.find({
      convertName: removeVietnameseTones(name),
    });

    if (motoExist.length > 0) {
      return res.status(400).json({ error: 'Loại hàng dã tồn tại' });
    } else {
      const data = {
        name,
        convertName: removeVietnameseTones(name),
        categories: [],
      };

      const moto = new Moto(data);

      await moto.save();

      moto.categories = undefined;

      return res.status(201).json({
        moto: moto,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: 'Lưu loại hàng lỗi',
    });
  }
};

export default save;
