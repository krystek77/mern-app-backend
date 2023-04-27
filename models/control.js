import mongoose from 'mongoose';

export const controlSchema = new mongoose.Schema({
  categoryId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Sterownik musi należeć do kategorii'],
    },
  ],
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return (
          v !== '' && /[\/!@#$%\^~?&ąęćĄĘĆłŁńŃŹźŻżśŚ]+/gm.test(v) === false
        );
      },
      message: (props) => `${props.value} - jest niepoprawną nazwą sterownika`,
    },
  },
  image: {
    type: String,
    default: '',
  },
  list: [
    {
      type: String,
    },
  ],
});

const Control = mongoose.model('Control', controlSchema);
export default Control;
