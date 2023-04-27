import mongoose from 'mongoose';

export const parameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: '-',
  },
  unit: {
    type: String,
    default: '-',
    required: true,
    enum: [
      '-',
      'mm',
      'kg',
      'litrów',
      'obr./min.',
      'kW',
      'kPa',
      'bar',
      'cal',
      'l/min.',
      'm/min.',
      'kWh',
      'l/s',
      'g/s',
      'dB(A)',
      'm3',
      'l',
      'C',
      'F',
      'kg/godz.',
      'dm3',
      'kBTU/godz.',
      'm3/godz.',
      'g/min.',
      'szt',
      'A',
      'V',
      'W',
      's',
      'min.',
      'godz.',
      '0',
    ],
  },
  value: {
    type: String,
    default: '-',
    required: true,
  },
});
parameterSchema.pre('save', function (next) {
  const temp = false;
  const error = new Error('Something went wrong');
  if (temp) next(error);
  next();
});

const Parameter = mongoose.model('Parameter', parameterSchema);
export default Parameter;
