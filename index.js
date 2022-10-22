const PORT = 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const { response } = require("express");

//Get express and call it
const app = express();
const articles = [];

const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "thehindu",
    address: "https://www.thehindu.com/sci-tech/energy-and-environment/",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/future/tags/climatechange",
    base: "https://www.bbc.com/",
  },
  {
    name: "indianexpress",
    address: "https://indianexpress.com/section/world/climate-change/",
    base: "",
  },
  {
    name: "economist",
    address: "https://www.economist.com/climate-change",
    base: "https://www.economist.com",
  },
  {
    name: "chinadaily",
    address: "https://www.chinadaily.com.cn/china/environment",
    base: "https:",
  },
];

newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        //arrow functions won't work here
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.get("/", (request, response) => {
  response.json(
    "Welcome to my first express server For creating Climate Change API"
  );
});

app.get("/news", (request, response) => {
  response.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];
      $('a:contains("climate")', html).each(function () {
        //arrow functions won't work here
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((error) => {
      console.log(error.message);
    });
  console.log(specificArticles);
});

app.listen(PORT, () => console.log("Server running on Port 8000"));
