import Moto from '../NhuaSchema';

export const read = async (req, res) => {
  try {
    const moto = await Moto.find().select('-categories').sort();

    if (moto.length === 0) {
      return res.status(200).json({
        lists: [],
      });
    }

    return res.status(200).json({
      lists: moto,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lấy dữ liệu lỗi',
    });
  }
};
