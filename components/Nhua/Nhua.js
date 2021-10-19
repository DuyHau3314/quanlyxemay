import { ListGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { removeVietnameseTones } from '../../utils/convertString';
const Nhua = () => {
  const [name, setName] = useState('');
  // const [nameUpdate, setNameUpdate] = useState('');
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
        setLists([...lists, res.data.name]);
      }
    } catch (error) {
      setError(error.response.data.error || 'Lưu loại nhựa lỗi');
    }
  };

  const sort = (array) => {
    return array.sort((a, b) =>
      removeVietnameseTones(a).localeCompare(removeVietnameseTones(b))
    );
  };

  const getLists = async () => {
    const res = await axios.get('/api/nhua/read');
    setLists(res.data.lists);
  };

  const handleUpdate = async (namePhuTung) => {
    setShowUpdate(true);
    const updateName = prompt(`Thay đổi tên ${namePhuTung} thành:`);
    if (!updateName) {
      console.log(namePhuTung);
    } else {
      const existName = lists.find(
        (name) =>
          removeVietnameseTones(name) === removeVietnameseTones(updateName)
      );
      const index = lists.findIndex((name) => name === namePhuTung);
      if (existName) {
        setError('Tên loại hàng đã tồn tại. Thử lại');
      } else {
        setError(null);
        try {
          const res = await axios.put('/api/nhua/update', {
            name: namePhuTung,
            nameUpdate: updateName,
          });

          lists[index] = res.data.name;

          setLists([...lists]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const handleDelete = async (namePhuTung) => {
    const check = confirm('Bạn có muốn xoá không?');
    if (check) {
      try {
        const res = await axios.delete('/api/nhua/delete', {
          data: { name: namePhuTung },
        });

        const filterLists = lists.filter((i) => i !== res.data.name);

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
      if (
        removeVietnameseTones(item).includes(
          removeVietnameseTones(e.target.value)
        )
      ) {
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
      <h2 className="mb-3">Các loại nhựa</h2>
      <div style={{ maxHeight: '500px', height: '500px', overflow: 'scroll' }}>
        <ListGroup>
          {(arrayList.length === 0 ? sort(lists) : sort(arrayList)).map(
            (list, i) => (
              <ListGroup.Item
                key={removeVietnameseTones(list)}
                className="h5 d-flex justify-content-between align-items-center"
              >
                <Link
                  href={{
                    pathname: `/nhua/${removeVietnameseTones(list)}`,
                    query: { name: list },
                  }}
                >
                  <a>{list}</a>
                </Link>

                <div className="d-flex ">
                  <button
                    onClick={() => handleUpdate(list)}
                    className="btn btn-warning"
                  >
                    Sửa
                  </button>
                  <div style={{ width: '.3rem' }}></div>
                  <button
                    onClick={() => handleDelete(list)}
                    className="btn btn-danger ml-2"
                  >
                    Xoá
                  </button>
                </div>
              </ListGroup.Item>
            )
          )}
        </ListGroup>
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
