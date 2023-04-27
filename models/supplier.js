import mongoose from 'mongoose';

export const supplierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== '';
        },
        message: (props) => 'nazwa firmy nie może być pustym łańcuchem znaków',
      },
    },
    street: {
      type: String,
      default: '',
    },
    streetNumber: {
      type: String,
      default: '',
    },
    localNumber: { type: String, default: '' },
    zipCode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{2}-\d{3}$/gm.test(v); //25-651
        },
        message: (props) =>
          `${props.value} jest niepoprawnym formatem kodu pocztowego`,
      },
    },
    city: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== '';
        },
        message: (props) => 'miasto nie może być pustym ciągiem znaków',
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          if (v === '') return true;
          return /^\+{1}\d{2,3}\s{1}\d{2}-\d{3}-\d{2}-\d{2}$/gm.test(v); //+48 41-345-05-61 lub +420 41-345-05-61
        },
        message: (props) => `${props.value} jest niepoprawnym numerem telefonu`,
      },
      default: '',
    },
    mobilePhone: {
      type: String,
      validate: {
        validator: function (v) {
          if (v === '') return true;
          return /^\+{1}\d{2}\s{1}\d{3}-\d{3}-\d{3}$/gm.test(v); //+48 602-191-607
        },
        message: (props) =>
          `${props.value} jest niepoprawnym numerem telefonu komórkowego`,
      },
      default: '',
    },
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
            v
          );
        },
        message: (props) => `${props.value} jest niepoprawnym adresem email`,
      },
    },
    www: {
      type: String,
      validate: {
        validator: function (v) {
          if (v === '') return true;
          return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
            v
          );
        },
        message: (props) => `${props.value} jest niepoprawnym adresem www`,
      },
      default: '',
    },
    nip: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[0-9]{10}$/gm.test(v);
        },
        message: (props) => `${props.value} jest niepoprawnym numerem NIP`,
      },
    },
  },
  { timestamps: true }
);

const Supplier = mongoose.model('Supplier', supplierSchema);
export default Supplier;
