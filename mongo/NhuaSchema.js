import mongoose from 'mongoose';
const { Schema } = mongoose;

const nhuaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  convertName: {
    type: String,
    required: true,
    unique: true,
  },

  categories: [
    {
      code: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      convertName: {
        type: String,
        required: true,
      },
      giaban: {
        type: Number,
      },
      gianhap: {
        type: Number,
        required: true,
      },
      giathay: {
        type: Number,
        required: true,
      },
      soluong: {
        type: Number,
        default: 0,
      },
      chuthich: {
        type: String,
        default: '',
      },
    },
  ],
});

export default mongoose.models.Nhua || mongoose.model('Nhua', nhuaSchema);

//Moto - Nhua
