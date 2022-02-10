import { Router } from "express"
import { sendScreenShot } from "./screenshot.controller"

const router: Router = Router()

router.route("/").get(sendScreenShot)

export default router