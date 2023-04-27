import mongoose from 'mongoose';
import INPUT_PATTERNS from '../constants/patterns.js';

export const userSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: '' },
    name: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return INPUT_PATTERNS.NAME.test(v);
        },
        message: (props) => `${props.value} - imię może zawierać tylko litery`,
      },
    },
    lastName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return INPUT_PATTERNS.LASTNAME.test(v);
        },
        message: (props) =>
          `${props.value} - nazwisko może zawierać tylko litery`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return INPUT_PATTERNS.EMAIL.test(v);
        },
        message: (props) => `${props.value} nie jest poprawnym adresem email`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'customer'],
        message: `{VALUE} - nie dostępne`,
      },
      default: 'admin',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
