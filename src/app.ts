import express, { Application, Request, Response } from "express"
import api from "./api"

const app: Application = express()

//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req: Request, res: Response) => {
    return res.json({
        author: "Pinto Infant",
        githubUrl: "https://github.com/pintoinfant/api-hub"
    })
})

app.use("/api", api)


export default app