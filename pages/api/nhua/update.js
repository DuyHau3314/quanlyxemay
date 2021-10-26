import { update } from '../../../mongo/nhua/update';
import connectDB from '../../../middleware/mongodb';

connectDB();

export default function updateCategory(req, res) {
  if (req.method === 'PUT') {
    update(req, res);
  }
}
