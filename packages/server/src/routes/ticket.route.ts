import express from "express";
import { getSeatReservation } from "../controllers/ticket.controller";

const ticketRouter = express.Router();

ticketRouter.get("/", getSeatReservation);

export default ticketRouter;
