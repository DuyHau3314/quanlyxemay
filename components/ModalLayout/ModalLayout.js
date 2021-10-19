import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import axios from 'axios';

const ModalLayout = ({
  showModal,
  setShowModal,
  phutung,
  name,
  setList,
  list,
  category,
}) => {
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(
    phutung.current ? phutung.current : null
  );

  const checkExist = async (phutungcode, phutungten) => {
    try {
      const res = await axios.post(`/api/${category}/chitiet/check/${name}`, {
        name: phutungten,
        code: phutungcode,
      });

      setError(null);
    } catch (error) {
      console.log(error);
      setError(error.response.data.error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'code') {
      checkExist(value, '');
    }

    if (name === 'name') {
      checkExist('', value);
    }

    if (typeof parseInt(value.replace(/,/g, '')) === 'number') {
      if (value[0] === '0') {
        setProduct({
          ...product,
          [name]: value.substring(1).replace(/,/g, ''),
        });
      } else {
        setProduct({ ...product, [name]: value.replace(/,/g, '') });
      }
    } else {
      setProduct({ ...product, [name]: value });
    }

    if (
      !error &&
      product.code &&
      product.name &&
      product.giaban > 0 &&
      product.gianhap > 0 &&
      product.giathay > 0
    ) {
      setDisabled(false);
    }
    if (error) {
      setDisabled(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.name.length === 0) {
      setError('Điền tên phụ tùng');
      return;
    }
    if (product.gianhap === 0 || !product.gianhap) {
      setError('Điền giá nhập');
      return;
    }
    if (product.giaban === 0 || !product.giaban) {
      setError('Điền giá bán');
      return;
    }

    if (product.giathay === 0 || !product.giathay) {
      setError('Điền giá thay');
      return;
    }

    if (product.soluong < 0) {
      setError('Số lượng lớn hơn 0');
      return;
    }

    try {
      const res = await axios.put(
        `/api/${category}/chitiet/update/${name}`,
        product
      );

      const index = list.findIndex((phutung) => phutung.id === res.data.id);

      list[index] = res.data;

      setList([...list]);

      setShowModal(false);
    } catch (error) {
      console.log(error);
      setError('Tạo chi tiết lỗi.');
    }
  };

  const form = (
    <form onSubmit={handleSubmit}>
      <div className="form-group mb-2">
        <label>Mã hàng</label>
        <input
          type="text"
          name="code"
          className="form-control"
          value={product.code}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mb-2">
        <label>Tên</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={product.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mb-2">
        <label>Giá nhập</label>
        <NumberFormat
          thousandsGroupStyle="thousand"
          value={product.gianhap}
          decimalSeparator="."
          displayType="input"
          type="text"
          thousandSeparator={true}
          allowNegative={false}
          onChange={handleChange}
          name="gianhap"
          className="form-control"
        />
      </div>

      <div className="form-group mb-2">
        <label>Giá bán</label>
        <NumberFormat
          thousandsGroupStyle="thousand"
          value={product.giaban}
          decimalSeparator="."
          displayType="input"
          type="text"
          thousandSeparator={true}
          allowNegative={false}
          onChange={handleChange}
          name="giaban"
          className="form-control"
        />
      </div>

      <div className="form-group mb-2">
        <label>Giá thay</label>
        <NumberFormat
          thousandsGroupStyle="thousand"
          value={product.giathay}
          decimalSeparator="."
          displayType="input"
          type="text"
          thousandSeparator={true}
          allowNegative={false}
          onChange={handleChange}
          name="giathay"
          className="form-control"
        />
      </div>

      <div className="form-group mb-2">
        <label>Số lượng</label>
        <input
          type="number"
          name="soluong"
          className="form-control"
          value={product.soluong}
          onChange={handleChange}
        />
      </div>

      <div className="form-group mb-2">
        <label>Chú thích</label>
        <input
          type="text"
          name="chuthich"
          className="form-control"
          value={product.chuthich}
          onChange={handleChange}
        />
      </div>

      {error && <p className="alert alert-danger">{error}</p>}

      <button
        type="submit"
        className={`btn btn-primary w-100 ${disabled ? 'disabled' : ''}`}
      >
        Cập nhật
      </button>
    </form>
  );
  return (
    <>
      <Modal
        animation={false}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Cập nhật phụ tùng</Modal.Title>
        </Modal.Header>

        <Modal.Body>{product && form}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalLayout;
