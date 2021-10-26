import { useState, useEffect } from 'react';
import classes from './CreateChiTiet.module.css';
import Link from 'next/link';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import numeral from 'numeral';
import { v4 as uuid4 } from 'uuid';
import { useRouter } from 'next/router';
import { removeVietnameseTones } from '../../utils/convertString';
const CreateChiTiet = ({ id, list, setList, queryNameShow }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    id: '',
    code: '',
    name: '',
    convertName: '',
    gianhap: undefined,
    giaban: undefined,
    giathay: undefined,
    soluong: 0,
    chuthich: '',
  });

  const toggleShow = () => {
    setOpen(!open);
  };

  const checkExist = async (phutungcode, phutungten) => {
    try {
      const res = await axios.post(`/api/phutung/chitiet/check/${id}`, {
        name: phutungten,
        code: phutungcode,
      });
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  useEffect(() => {
    let timeout;
    setError(null);
    if (product.code.length > 0 || product.name.length > 0) {
      timeout = setTimeout(() => {
        checkExist(product.code, product.name);
      }, 350);
    }

    return () => clearTimeout(timeout);
  }, [product.code, product.name]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (typeof parseInt(value.replace(/,/g, '')) === 'number') {
      setProduct({ ...product, [name]: value.replace(/,/g, '') });
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
      setProduct({
        code: '',
        name: '',
        gianhap: '',
        giaban: '',
        giathay: '',
        soluong: 0,
        chuthich: '',
        convertName: '',
      });
      const res = await axios.post(
        `/api/phutung/chitiet/save/${router.query.id}`,
        {
          product: {
            ...product,
            convertName: removeVietnameseTones(product.name),
          },
        }
      );

      setList([...list, res.data]);
      setDisabled(true);
    } catch (error) {
      console.log(error);
      setError('Tạo chi tiết lỗi.');
    }
  };
  return (
    <div className="d-flex flex-column align-items-end">
      <div className="d-flex justify-content-between align-items-center w-100">
        <Link href="/">
          <a style={{ display: 'block' }}>&#8592; Trở lại</a>
        </Link>

        <button onClick={toggleShow} className="btn btn-primary mb-2">
          {open ? 'Đóng thêm phụ tùng' : 'Mở thêm phụ tùng'}
        </button>
      </div>
      <div className={`w-25 ${open ? classes.open : classes.close}`}>
        <div className="card card-body">
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
              Thêm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChiTiet;
