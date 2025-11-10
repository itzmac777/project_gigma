import express from "express"
import { displayRootPage } from "../controllers/rootControllers.js"

const router = express.Router()

router.get("/", displayRootPage)

export default router
