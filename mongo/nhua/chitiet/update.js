import Moto from '../../NhuaSchema';

export const update = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  try {
    const moto = await Moto.findById(req.query.id);

    if (!moto) {
      return res.status(404).json({
        error: 'Sản phẩm không tồn tại',
      });
    }
    const index = moto.categories.findIndex(
      (item) => item._id.toString() === _id.toString()
    );

    if (index === -1) {
      return res.status(404).json({
        error: 'Không có sản phẩm',
      });
    }

    moto.categories[index] = req.body;

    await moto.save();

    return res.status(200).json(req.body);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Cập nhật sản phẩm lỗi',
    });
  }
};
