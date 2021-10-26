import { read } from '../../../mongo/phutung/chitiet/read';
import connectDB from '../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../utils/convertString';

export default function readProduct(req, res) {
  if (req.method === 'GET') {
    try {
      read(req, res);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
