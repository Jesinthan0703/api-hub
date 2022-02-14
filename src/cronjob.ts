import cron from "node-cron"
import * as fs from "fs"
import * as path from "path"

let directory = path.join(__dirname, "..", "/public/")

export const cronJob = cron.schedule('0 0 * * *', () => {
    fs.readdir(directory, (err, files) => {
        if (err) throw err
        files.forEach((file) => {
            fs.unlink(path.join(directory, file), (err) => {
                if (err) throw err
            })
        })
    })
});