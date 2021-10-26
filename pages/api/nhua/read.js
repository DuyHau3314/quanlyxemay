import { read } from '../../../mongo/nhua/read';
import connectDB from '../../../middleware/mongodb';

connectDB();

export default function listCategory(req, res) {
  if (req.method === 'GET') {
    read(req, res);
  }
}
