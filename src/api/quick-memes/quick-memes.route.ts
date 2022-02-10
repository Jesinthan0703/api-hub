import { Router } from "express"
import { getMemes } from "./quick-memes.controller"

const router: Router = Router()

router.route("/").get(getMemes)

export default router