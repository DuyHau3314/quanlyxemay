import { remove } from '../../../../../mongo/nhua/chitiet/delete';
import connectDB from '../../../../../middleware/mongodb';

connectDB();
import { removeVietnameseTones } from '../../../../../utils/convertString';

export default function deleteProduct(req, res) {
  if (req.method === 'DELETE') {
    try {
      remove(req, res);
    } catch (error) {
      return res.json({ error: 'Server Error' });
    }
  }
}
