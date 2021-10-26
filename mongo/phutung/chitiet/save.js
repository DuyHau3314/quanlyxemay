import Moto from '../../MotoSchema';

export const save = async (req, res) => {
  const { product } = req.body;
  console.log('Product', product);
  try {
    const moto = await Moto.findById(req.query.id);

    if (!moto) {
      return res.status(404).json({
        error: ' Không tìm thấy sản phẩm',
      });
    }

    moto.categories.push(product);

    console.log(moto);

    await moto.save();

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Lưu sản phẩm lỗi',
    });
  }
};
