import { search } from '../../../../../mongo/nhua/chitiet/search';
import connectDB from '../../../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../../../utils/convertString';
export default function checkChiTiet(req, res) {
  if (req.method === 'POST') {
    search(req, res);
  }
}
