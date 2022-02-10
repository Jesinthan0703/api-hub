import { Request, Response } from "express"
import puppeteer from "puppeteer"
import chrome from "chrome-aws-lambda"
import { scrollPageToBottom } from "puppeteer-autoscroll-down"
import { v4 as uuidv4 } from 'uuid'



export const sendScreenShot = async (req: Request, res: Response): Promise<any> => {
    try {
        let { url } = req.body

        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            defaultViewport: {
                width: 3840,
                height: 2160
            }
        });

        //Getting Screenshot
        let page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0
        });

        await scrollPageToBottom(page, {
            size: 250,
            delay: 200
        })

        let imageName = uuidv4()
        await page.screenshot({ path: `public/${imageName}.png`, fullPage: true });
        await browser.close()
        return res.sendFile(`D:\\code-space\\browser-automation\\public\\${imageName}.png`)

    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: false,
            data: err
        });
    }
}