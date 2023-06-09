dotenv.config();
import * as dotenv from "dotenv"
import * as path from 'path'

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import controlRoutes from "./routes/control.js";
import tagRoutes from "./routes/tag.js";
import customerRoutes from "./routes/customer.js";
import documentRoutes from "./routes/document.js";
import postRoutes from "./routes/post.js";
import heatingRoutes from "./routes/heating.js";
import optionRoutes from "./routes/option.js";
import voltageRoutes from "./routes/voltage.js";
import priceListRoutes from "./routes/pricelist.js";
import laundryPhotoRoutes from "./routes/laundryPhoto.js";
import supplierRoutes from "./routes/supplier.js";
import sparePartRoutes from "./routes/sparepart.js";
import additionalEquipmentRoutes from "./routes/additionalEquipment.js";
import userRoutes from "./routes/user.js";
import NBPRoutes from "./routes/nbp.js";
import watchedRoutes from './routes/watched.js';
import mostPopularRoutes from './routes/mostPopular.js'
import {whiteList} from './config/config.js'

const app = express();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
mongoose.set("strictQuery", false);

app.use(
  cors({
    origin: (origin,callback)=>{
      if(whiteList.indexOf(origin)!==-1 || !origin ) {
        callback(null,true)
      } else {
        callback(new Error(`Not allowed by CORS: --- ${origin} ---`))
      }
    },
    methods: "GET,PUT,POST,DELETE,PATCH",
    credentials: true,
    optionsSuccessStatus: 200
  })
);
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"public")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/control", controlRoutes);
app.use("/tag", tagRoutes);
app.use("/customer", customerRoutes);
app.use("/document", documentRoutes);
app.use("/post", postRoutes);
app.use("/heating", heatingRoutes);
app.use("/option", optionRoutes);
app.use("/voltage", voltageRoutes);
app.use("/pricelist", priceListRoutes);
app.use("/kurs", NBPRoutes);
app.use("/laundryPhoto", laundryPhotoRoutes);
app.use("/sparepart", sparePartRoutes);
app.use("/supplier", supplierRoutes);
app.use("/additional-equipment", additionalEquipmentRoutes);
app.use("/user", userRoutes);
app.use("/watched",watchedRoutes);
app.use("/mostPopular",mostPopularRoutes)

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.URL_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => app.listen(PORT, () => console.log(`Server connected to database on port:${PORT}`)))
  .catch((error) => console.error(error.message));
