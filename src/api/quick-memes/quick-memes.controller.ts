import { Request, Response } from "express"
import puppeteer from "puppeteer"
import cheerio from "cheerio"
import chrome from "chrome-aws-lambda"


interface IMemes {
    title: string,
    url: string | undefined,
    shareCount: string,
}

export const getMemes = async (req: Request, res: Response): Promise<object | undefined> => {
    try {
        const browser = await puppeteer.launch({
            args: chrome.args,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            defaultViewport: {
                width: 1920,
                height: 1080
            }
        });

        let randomPage = Math.floor(Math.random() * 1000);

        let page = await browser.newPage();
        await page.goto(`http://www.quickmeme.com/page/${randomPage}`);

        let content = await page.content();
        const $ = cheerio.load(content);
        const memes: IMemes[] = []
        $(".post").each((index, data) => {
            memes.push({
                title: $(data).find(".post-header").text().replace(/\s\s+/g, ''),
                url: $(data).find(".post-image").attr("src"),
                shareCount: $(data).find(".sharecounts").text().replace(/\s\s+/g, '')
            })
        })

        await browser.close();
        let randomMeme = memes[Math.floor(Math.random() * memes.length)];
        return res.json({
            status: true,
            data: randomMeme
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: false,
            data: err
        });
    }
}