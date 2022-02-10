import { Router } from "express"
import { getArticle } from "./dev.to.controller"

const router: Router = Router()

router.route("/").get(getArticle)

export default router