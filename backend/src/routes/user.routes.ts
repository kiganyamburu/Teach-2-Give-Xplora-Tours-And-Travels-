import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/register", UserController.registerUser);
router.get("/fetch-all", UserController.fetchAllUsers);
router.get("/:user_id", UserController.fetchSingleUser);
router.patch("/switch-role", UserController.switchRoles);
router.put("/:user_id", UserController.updateUserDetails);

export default router;
