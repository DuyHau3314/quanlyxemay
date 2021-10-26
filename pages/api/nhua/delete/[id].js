import { remove } from '../../../../mongo/nhua/delete';
import connectDB from '../../../../middleware/mongodb';

connectDB();

export default function deleteCategory(req, res) {
  if (req.method === 'DELETE') {
    remove(req, res);
  }
}
