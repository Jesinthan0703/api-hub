import { Request, Response } from "express"
import puppeteer from "puppeteer"
import chrome from "chrome-aws-lambda"
import { scrollPageToBottom } from "puppeteer-autoscroll-down"
import { v4 as uuidv4 } from 'uuid'
import * as path from "path"



export const sendScreenShot = async (req: Request, res: Response): Promise<any> => {
    try {
        let url: any = req.query.url || "https://www.pintoinfant.tech"
        let height: any = req.query.height || "1080"
        let width: any = req.query.width || "1920"
        let delay: any = req.query.delay || "0"

        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            // headless: chrome.headless,
            defaultViewport: {
                width: Number(width),
                height: Number(height)
            }
        });

        //Getting Screenshot
        let page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0
        });

        await page.waitFor(Number(delay));

        await scrollPageToBottom(page, {
            size: 250,
            delay: 200
        })

        let imageName = uuidv4()
        await page.screenshot({ path: `public/${imageName}.png`, fullPage: true });
        await browser.close()
        return res.sendFile(path.join(__dirname, "..", "..", "..", "/public/") + `${imageName}.png`)

    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: false,
            data: err
        });
    }
}