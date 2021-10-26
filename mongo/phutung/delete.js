import Moto from '../MotoSchema';

export const remove = async (req, res) => {
  const { id } = req.query;
  try {
    const moto = await Moto.findByIdAndRemove(id);

    return res.status(200).json({
      moto: moto,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Lấy dữ liệu lỗi',
    });
  }
};
