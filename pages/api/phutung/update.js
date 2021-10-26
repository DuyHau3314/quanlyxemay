import { update } from '../../../mongo/phutung/update';
import connectDB from '../../../middleware/mongodb';

connectDB();

export default function updateCategory(req, res) {
  if (req.method === 'PUT') {
    update(req, res);
  }
}
