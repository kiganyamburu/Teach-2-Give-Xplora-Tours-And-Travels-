import express, { Router } from "express";
import { EventController } from "../controllers/event.controller";

const router = Router();

router.post("/create", EventController.createEvent);
router.get("/all-events", EventController.fetchAllEvents);

export default router;
