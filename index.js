const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const PORT = process.env.PORT || 8000

const app = express()

const newspapers = [
    {
        name: "guardian",
        address: "https://www.theguardian.com/world/ukraine",
        base: ""
    },
    {
        name: "telegraph",
        address: "https://www.telegraph.co.uk/russia-ukraine-war/",
        base: "https://www.telegraph.co.uk"
    },
    {
        name: "times",
        address: "https://www.thetimes.co.uk/russia-ukraine-war",
        base: ""
    },
    {
        name: "bbc",
        address: "https://www.bbc.com/news/world-60525350",
        base: "https://www.bbc.com"
    },
    {
        name: "reuters",
        address: "https://www.reuters.com/world/europe/",
        base: "https://www.reuters.com"
    },
    {
        name: "usatoday",
        address: "https://www.usatoday.com/news/ukraine/",
        base: "https://www.usatoday.com"
    },
    {
        name: "nytimes",
        address: "https://www.nytimes.com/section/world/europe",
        base: "https://www.nytimes.com"
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $("a:contains('Ukraine')", html).each(function () {
            const title = $(this).text()
            const url = $(this).attr("href")

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})

app.get("/", (req,res) => {
    res.json("welcome to my news api on Ukraine Russia conflict")
})

app.get("/news", (req,res) => {
    res.json(articles)
})

app.get("/news/:newspaperId", (req,res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticle = []

        $("a:contains('Ukraine')", html).each(function () {
            const title = $(this).text()
            const url = $(this).attr("href")
            specificArticle.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticle)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))