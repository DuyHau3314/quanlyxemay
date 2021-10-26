import mongoose from 'mongoose';

const connection = {};

const connectDB = async () => {
  if (connection.isConnected) {
    return;
  }
  const db = await mongoose.connect('mongodb://mongo-server:27017/xemay', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  connection.isConnected = db.connections[0].readyState;
  console.log(connection.isConnected);
};

export default connectDB;
