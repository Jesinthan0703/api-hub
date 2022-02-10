import { Router } from "express"

import quickMemes from "./quick-memes/quick-memes.route"
import devTo from "./dev.to/dev.to.route"

const api: Router = Router()

api.use("/quick-memes", quickMemes)
api.use("/dev-to", devTo)

export default api