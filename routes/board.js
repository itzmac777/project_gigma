import express from "express"
import {
  displayBoardPage,
  displaySocketBoardPage,
} from "../controllers/boardControllers.js"

const router = express.Router()

router.get("/", displayBoardPage)
router.get("/:name", displaySocketBoardPage)

export default router
