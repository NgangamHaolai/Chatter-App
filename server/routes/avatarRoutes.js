// import avatarsData from "../models/avatarsModel.js";
import express from "express";
import Avatar from "../controller/Avatar.js";

const router = express.Router();

router.put('/avatar', Avatar);

export default router;