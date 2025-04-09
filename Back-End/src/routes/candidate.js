import express from "express"

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import controllerCandidate from "../controller/controllerCandidate.js";
const { controllerGetCandidate: getCandidate,
    controllerPostCandidate: registerCandidate,
    controllerPutCandidate: putCandidate
 } = controllerCandidate
const candidateRoute = express.Router()

candidateRoute.get("/candidatos", authMiddleware, adminMiddleware, getCandidate)
candidateRoute.post("/cadastro")
