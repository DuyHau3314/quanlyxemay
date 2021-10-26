import Moto from '../../NhuaSchema';

export const search = async (req, res) => {
  const { name, code } = req.body;

  try {
    const moto = await Moto.findById(req.query.id);

    let array = [];
    if (name.length === 0) {
      array = [];
      moto.categories.map((item) => {
        if (item.code.includes(code)) {
          array.push(item);
        }
      });
    }

    if (code.length === 0) {
      array = [];
      moto.categories.map((item) => {
        if (item.convertName.includes(name)) {
          array.push(item);
        }
      });
    }

    if (code.length > 0 && name.length > 0) {
      array = [];
      moto.categories.map((item) => {
        if (item.convertName.includes(name) && item.code.includes(code)) {
          array.push(item);
        }
      });
    }

    return res.status(200).json({
      categories: array,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: 'Tìm sản phẩm lỗi',
    });
  }
};
