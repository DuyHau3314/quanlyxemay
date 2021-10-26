import save from '../../../mongo/phutung/save';
import connectDB from '../../../middleware/mongodb';

connectDB();

export default function saveCategory(req, res) {
  if (req.method === 'POST') {
    save(req, res);
  }
}
