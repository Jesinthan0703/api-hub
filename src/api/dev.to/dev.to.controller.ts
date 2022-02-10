import { Request, Response } from "express"
import puppeteer from "puppeteer"
import cheerio from "cheerio"
import chrome from "chrome-aws-lambda"


interface IArticles {
    title: string,
    link: string,
    author: string
}


export const getArticle = async (req: Request, res: Response): Promise<object | undefined> => {
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

        // Getting Random Tags
        const tagPage = await browser.newPage();
        await tagPage.goto('https://dev.to/tags');

        const tagContent = await tagPage.content();
        const $ = cheerio.load(tagContent);
        const tags: string[] = []
        $('.tag-card.crayons-card').each((index, data) => {
            tags.push($(data).find('.crayons-tag').text())
        })
        let randomTag = tags[Math.floor(Math.random() * tags.length)].replace("#", "")

        // Getting Random Articles
        let contentPageUrl = `https://dev.to/t/${randomTag}`
        const contentPage = await browser.newPage();
        await contentPage.goto(contentPageUrl);
        let pageContent = await contentPage.content();
        const $$ = cheerio.load(pageContent);
        const articles: IArticles[] = []
        $$('.crayons-story').each((index, data) => {
            articles.push({
                title: $$(data).find('.crayons-story__hidden-navigation-link').text(),
                link: `https://dev.to/${$$(data).find('.crayons-story__hidden-navigation-link').attr('href')}`,
                author: $$(data).find('.crayons-story__secondary').text().trim()
            })
        })
        let randomArticle: IArticles = articles[Math.floor(Math.random() * articles.length)]
        await browser.close();


        //Getting Screenshot of Random Article
        // let articlePage = await browser.newPage();
        // await articlePage.goto(randomArticle?.link, {
        //     waitUntil: 'networkidle2',
        //     timeout: 0
        // });

        // await scrollPageToBottom(articlePage, {
        //     size: 250,
        //     delay: 200
        // })

        // await articlePage.waitForSelector('#footer-container')
        // await articlePage.screenshot({ path: `articles/${randomArticle.title}.png`, fullPage: true });

        return res.json({
            status: true,
            data: randomArticle
        })

    } catch (err) {
        console.error(err);
        res.status(500).send({
            status: false,
            data: err
        });
    }
}