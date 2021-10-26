import { update } from '../../../../../mongo/phutung/chitiet/update';
import connectDB from '../../../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function updateCategory(req, res) {
  if (req.method === 'PUT') {
    update(req, res);
  }
}
