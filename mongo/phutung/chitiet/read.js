import Moto from '../../MotoSchema';

export const read = async (req, res) => {
  try {
    const motos = await Moto.findById(req.query.id);

    return res.status(200).json({
      list: motos,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Đọc sản phẩm lỗi',
    });
  }
};
