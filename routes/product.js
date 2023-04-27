import express from "express";
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductDetails,
  updateProduct,
  getProductsByCategoryName,
  deleteProduct,
  deleteProductByModel,
  getProductDetailsByModel,
  getProductsByTags,
  getProductsByCategoryId,
  getProductsBasedOnSpecyfiedTags,
} from "../controllers/product.js";
import { isAdmin } from "../middleware/auth/isAdmin.js";

router.get("/", getProducts);
router.get("/basedOnTags", getProductsBasedOnSpecyfiedTags);
router.get("/category/:categoryName", getProductsByCategoryName);
router.get("/:id", getProductDetails);
router.get("/model/:model", getProductDetailsByModel);
router.get("/model/:model/tags-search", getProductsByTags);
router.get("/category/:categoryId/products", getProductsByCategoryId);
router.post("/", isAdmin, createProduct);
router.patch("/:model", isAdmin, updateProduct);
router.delete("/:id", isAdmin, deleteProduct);
router.delete("/model/:model", isAdmin, deleteProductByModel);

export default router;
