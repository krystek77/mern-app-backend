import express from "express";
import {
  getAdditionalEquipment,
  getAdditionalEquipments,
  createAdditionalEquipment,
  updateAdditionalEquipment,
  deleteAdditionalEquipment,
} from "../controllers/additionalEquipment.js";
const router = express.Router();
import { isAdmin } from "../middleware/auth/isAdmin.js";

router.get("/:slug", isAdmin, getAdditionalEquipment);
router.get("/", getAdditionalEquipments);
router.post("/", isAdmin, createAdditionalEquipment);
router.patch("/:slug", isAdmin, updateAdditionalEquipment);
router.delete("/:slug", isAdmin, deleteAdditionalEquipment);

export default router;
