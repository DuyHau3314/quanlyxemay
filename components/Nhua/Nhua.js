import { ListGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { removeVietnameseTones } from '../../utils/convertString';
const Nhua = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);
  const [lists, setLists] = useState([]);

  const [arrayList, setArrayList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (name.length === 0) {
        setError('Vui lòng nhập tên');
      } else {
        const res = await axios.post('/api/nhua/save', {
          name: name.trim(),
        });
        setName('');

        setLists([...lists, res.data.moto]);
      }
    } catch (error) {
      setError(error.response.data.error || 'Lưu loại cơ khí lỗi');
    }
  };

  const getLists = async () => {
    const res = await axios.get('/api/nhua/read');
    if (!res.data.error) {
      setLists(res.data.lists);
    }
  };

  const handleUpdate = async (id, namenhua) => {
    setShowUpdate(true);
    const updateName = prompt(`Thay đổi tên ${namenhua} thành:`);
    if (!updateName) {
      console.log(namenhua);
    } else {
      const existName = lists.find(
        (item) =>
          removeVietnameseTones(item.name) === removeVietnameseTones(updateName)
      );
      const index = lists.findIndex((item) => item._id === id);
      if (existName) {
        setError('Tên loại hàng đã tồn tại. Thử lại');
      } else {
        setError(null);
        try {
          const res = await axios.put('/api/nhua/update', {
            id: id,
            nameUpdate: updateName,
          });

          lists[index].name = res.data.moto.name;
          lists[index].convertName = removeVietnameseTones(
            res.data.moto.convertName
          );

          setLists([...lists]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleDelete = async (id) => {
    const check = confirm('Bạn có muốn xoá không?');
    if (check) {
      try {
        const res = await axios.delete(`/api/nhua/delete/${id}`);

        const filterLists = lists.filter((i) => i._id !== id);

        setLists(filterLists);
      } catch (error) {
        setError(error.response.data.error || 'Xoá loại cơ khí lỗi');
      }
    }
  };

  useEffect(() => {
    getLists();
  }, []);

  const handleChange = async (e) => {
    setName(e.target.value);
    setError(null);

    let newLists = lists.filter((item) => {
      if (item.convertName.includes(removeVietnameseTones(e.target.value))) {
        return item;
      }
    });

    setArrayList(newLists);

    if (e.target.value === '') {
      newLists = lists;
    }
  };

  return (
    <div>
      <h2 className="mb-3">Nhựa xe máy</h2>
      <div style={{ maxHeight: '500px', height: '500px', overflow: 'scroll' }}>
        {lists.length > 0 && (
          <ListGroup>
            {(arrayList.length === 0 ? lists : arrayList).map((list) => (
              <ListGroup.Item
                key={list._id}
                className="h5 d-flex justify-content-between align-items-center"
              >
                <Link
                  href={{
                    pathname: `/nhua/${list._id}`,
                    query: { name: list.name },
                  }}
                >
                  <a>{list.name}</a>
                </Link>

                <div className="d-flex ">
                  <button
                    onClick={() => handleUpdate(list._id, list.name)}
                    className="btn btn-warning"
                  >
                    Sửa
                  </button>
                  <div style={{ width: '.3rem' }}></div>
                  <button
                    onClick={() => handleDelete(list._id)}
                    className="btn btn-danger ml-2"
                  >
                    Xoá
                  </button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group mt-5">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập loại xe"
            onChange={handleChange}
            value={name}
          />
        </div>
        {error && <p className="alert alert-danger mt-2">{error}</p>}
        <button type="submit" className="btn btn-primary mt-2">
          <strong>Thêm loại xe</strong>
        </button>
      </form>
    </div>
  );
};

export default Nhua;
