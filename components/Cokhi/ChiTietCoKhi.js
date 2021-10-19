import { Container } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import CreateChiTiet from './CreateChiTiet';
import NumberFormat from 'react-number-format';
import classes from './ChiTietCoKhi.module.css';
import axios from 'axios';
import ModalLayout from '../ModalLayout/ModalLayout';
import { ToastContainer, toast } from 'react-toastify';
import { removeVietnameseTones } from '../../utils/convertString';

const ChiTietCoKhi = ({ queryNameShow }) => {
  const router = useRouter();

  const [list, setList] = useState([]);
  const [checkAmount, setCheckAmount] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const phutung = useRef(null);

  const getChiTiet = async () => {
    try {
      const res = await axios.get(`/api/phutung/${router.query.name}`);
      setList(res.data.list);
    } catch (error) {
      console.log(error.response);
    }
  };

  const convertPrice = (value) => (
    <NumberFormat
      thousandsGroupStyle="thousand"
      value={value}
      decimalSeparator="."
      displayType="text"
      type="text"
      thousandSeparator={true}
      allowNegative={false}
    />
  );

  const getSearchData = async (name, code) => {
    try {
      const res = await axios.post(
        `/api/phutung/chitiet/search/${router.query.name}`,
        {
          name,
          code,
        }
      );
      setList(res.data);
    } catch (error) {
      setList([]);
      console.log(error);
    }
  };

  const handleDelete = async (name, id) => {
    const check = confirm(`Bạn chắc chắn muốn xoá ${name}?`);
    if (check) {
      try {
        const res = await axios.delete(
          `/api/phutung/chitiet/delete/${router.query.name}/${id}`
        );

        const newList = list.filter((item) => item.id !== id);

        setList(newList);

        toast.success('Xoá thành công', {
          position: 'top-right',
          autoClose: 500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const reduceAmount = async (item) => {
    try {
      const res = await axios.put(
        `/api/phutung/chitiet/update/${router.query.name}`,
        {
          ...item,
          soluong: item.soluong - 1,
        }
      );

      const index = list.findIndex((phutung) => phutung.id === res.data.id);

      list[index] = res.data;

      setList([...list]);
    } catch (error) {
      console.log(error);
    }
  };

  const sort = (array) => {
    return array.sort((a, b) =>
      removeVietnameseTones(a.name).localeCompare(removeVietnameseTones(b.name))
    );
  };

  const handleAmount = () => {
    if (checkAmount) {
      setCheckAmount(false);
      getChiTiet();
    } else {
      setCheckAmount(true);
      setList(list.filter((item) => item.soluong <= 3));
    }
  };

  useEffect(() => {
    if (router && router.query) {
      getChiTiet();
    }
  }, [router]);

  useEffect(() => {
    if (code.length > 0 || name.length > 0) {
      getSearchData(name, code);
    }
    if (code.length === 0 && name.length === 0) {
      getChiTiet();
    }
  }, [name, code, router]);

  return (
    <Container className="mt-5">
      <p className="text-center h2 mb-5">{`Danh sách các loại ${queryNameShow}`}</p>
      {showModal && (
        <ModalLayout
          name={router.query.name}
          phutung={phutung}
          showModal={showModal}
          setShowModal={setShowModal}
          setList={setList}
          list={list}
          category="phutung"
        />
      )}
      <div
        className={`d-flex justify-content-around ${classes['form-search']}`}
      >
        <div className="form-group mr-5">
          <label htmlFor="id">
            <p className="h6">Tìm kiếm theo mã:</p>
          </label>
          <input
            type="text"
            id="id"
            className="form-control"
            placeholder="Mã"
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <div className="w-25"></div>

        <div className="form-group mr-5">
          <label htmlFor="phutung">
            <p className="h6">Tìm kiếm theo tên:</p>
          </label>
          <input
            type="text"
            id="phutung"
            className="form-control"
            placeholder="Tên"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="w-25"></div>
      </div>
      <br className="mt-5" />
      <CreateChiTiet
        queryNameShow={queryNameShow}
        setList={setList}
        list={list}
        name={router.query.name}
      />
      <br />
      <button onClick={handleAmount} className="btn btn-danger mb-3">
        {checkAmount ? 'Đóng hàng sắp hết' : 'Mở hàng sắp hết'}
      </button>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Tên phụ tùng</th>
            <th scope="col">Giá Nhập</th>
            <th scope="col">Giá Bán</th>
            <th scope="col">Giá Thay</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Chú thích</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sort(list).map((item, i) => (
            <tr className="" key={i + item.code}>
              <th scope="row">{i + 1}</th>
              <th scope="row">{item.code}</th>
              <th>{item.name}</th>
              <td>{convertPrice(item.gianhap)}</td>
              <td>{convertPrice(item.giaban)}</td>
              <td>{convertPrice(item.giathay)}</td>
              <td>{item.soluong}</td>
              <td>{item.chuthich}</td>
              <td
                onClick={() => {
                  setShowModal(!showModal);
                  phutung.current = item;
                }}
                className="text-warning"
                style={{
                  fontWeight: 'bold',
                  color: '#ec8f49',
                  cursor: 'pointer',
                }}
              >
                Sửa
              </td>
              <td
                className="text-danger"
                style={{ fontWeight: 'bold', cursor: 'pointer' }}
                onClick={() => handleDelete(item.name, item.id)}
              >
                Xoá
              </td>

              {item.soluong > 0 && (
                <td
                  className="text-primary"
                  style={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => reduceAmount(item)}
                >
                  Mua Hàng
                </td>
              )}

              {item.soluong === 0 && (
                <td
                  className="line-through"
                  style={{ fontWeight: 'bold', cursor: 'not-allowed' }}
                >
                  Hết hàng
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && (
        <strong className="text-center w-100 mt-4">Không có phụ tùng</strong>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Container>
  );
};

export default ChiTietCoKhi;
