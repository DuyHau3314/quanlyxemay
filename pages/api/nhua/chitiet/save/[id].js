import { save } from '../../../../../mongo/nhua/chitiet/save';
import connectDB from '../../../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function saveProduct(req, res) {
  if (req.method === 'POST') {
    save(req, res);
  }
}
