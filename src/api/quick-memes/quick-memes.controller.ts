import { Request, Response } from "express"
import cheerio from "cheerio"
import axios, { AxiosResponse } from "axios"


interface IMemes {
    title: string,
    url: string | undefined,
    shareCount: string,
}

export const getMemes = async (req: Request, res: Response): Promise<object | undefined> => {
    try {

        let randomPage = Math.floor(Math.random() * 1000)
        let content: AxiosResponse = await axios.get(`http://www.quickmeme.com/page/${randomPage}`)
        const $ = cheerio.load(content.data);
        const memes: IMemes[] = []
        $(".post").each((index, data) => {
            memes.push({
                title: $(data).find(".post-header").text().replace(/\s\s+/g, ''),
                url: $(data).find(".post-image").attr("src"),
                shareCount: $(data).find(".sharecounts").text().replace(/\s\s+/g, '')
            })
        })
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