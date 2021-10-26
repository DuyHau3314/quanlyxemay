import save from '../../../mongo/nhua/save';
import connectDB from '../../../middleware/mongodb';

connectDB();

export default function saveCategory(req, res) {
  if (req.method === 'POST') {
    save(req, res);
  }
}
