import { Request, Response } from "express"
import puppeteer from "puppeteer"
import cheerio from "cheerio"
import chrome from "chrome-aws-lambda"
import axios, { AxiosResponse } from "axios"

interface IArticles {
    title: string,
    link: string,
    author: string
}


export const getArticle = async (req: Request, res: Response): Promise<object | undefined> => {
    try {
        // Getting Random Tags
        const tagPage: AxiosResponse = await axios.get("https://dev.to/tags")
        const $ = cheerio.load(tagPage.data);
        const tags: string[] = []
        $('.tag-card.crayons-card').each((index, data) => {
            tags.push($(data).find('.crayons-tag').text())
        })
        let randomTag = tags[Math.floor(Math.random() * tags.length)].replace("#", "")

        // Getting Random Articles
        let contentPageUrl = `https://dev.to/t/${randomTag}`
        const contentPage: AxiosResponse = await axios.get(contentPageUrl)
        const $$ = cheerio.load(contentPage.data);
        const articles: IArticles[] = []
        $$('.crayons-story').each((index, data) => {
            articles.push({
                title: $$(data).find('.crayons-story__hidden-navigation-link').text(),
                link: `https://dev.to${$$(data).find('.crayons-story__hidden-navigation-link').attr('href')}`,
                author: $$(data).find('.crayons-story__secondary').text().trim()
            })
        })
        let randomArticle: IArticles = articles[Math.floor(Math.random() * articles.length)]

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
