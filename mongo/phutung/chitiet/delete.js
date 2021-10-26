import Moto from '../../MotoSchema';

export const remove = async (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  try {
    const moto = await Moto.findById(req.query.id);
    if (!moto) {
      return res.status(404).json({ error: 'Không thấy sản phẩm' });
    }

    const index = moto.categories.findIndex(
      (item) => item._id.toString() === id.toString()
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Không thấy index sản phẩm' });
    }

    moto.categories.splice(index, 1);

    await moto.save();

    return res.status(200).json({
      data: 'Xoá thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Xoá sản phẩm lỗi',
    });
  }
};
