import { check } from '../../../../../mongo/nhua/chitiet/check';
import connectDB from '../../../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../../../utils/convertString';
export default function checkChiTiet(req, res) {
  if (req.method === 'POST') {
    check(req, res);
  }
}
