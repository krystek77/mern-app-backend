import mongoose from 'mongoose';
import URLSlug from 'mongoose-slug-generator';
const options = {};
mongoose.plugin(URLSlug, options);

const laundryPhotoSchema = new mongoose.Schema(
  {
    fieldname: { type: String, default: 'images' },
    originalname: { type: String, default: 'temp.webp' },
    encoding: { type: String, default: '7bit' },
    mimetype: { type: String, default: 'image/webp' },
    destination: { type: String, default: './public/assets/laundryPhotos' },
    filename: {
      type: String,
      default: `temp-${new Date().toLocaleDateString('pl-PL')}.webp`,
    },
    path: {
      type: String,
      default: `public/assets/laundryPhotos/temp-${new Date().toLocaleDateString(
        'pl-PL'
      )}.webp`,
    },
    alt: { type: String, default: 'Pralnia przemysłowa ' },
    title: { type: String, default: 'Dom Pomocy Społecznej' },
    slug: { type: String, slug: 'title' },
    size: { type: String, default: 'O' },
  },
  { timestamps: true }
);

laundryPhotoSchema.pre('save', function (next) {
  this.slug = this.title.split(' ').join('-').toLowerCase();
  next();
});

const LaundryPhoto = mongoose.model('LaundryPhoto', laundryPhotoSchema);
export default LaundryPhoto;
