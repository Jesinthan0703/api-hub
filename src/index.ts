import app from "./app";
import { cronJob } from "./cronjob"

app.listen(5000, () => {
    cronJob.start();
    console.log("Server is running on port 5000");
})