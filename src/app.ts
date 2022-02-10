import express, { Application } from "express"
import api from "./api"

const app: Application = express()


//MiddleWares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", api)


export default app