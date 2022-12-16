const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const log = console.log;

const getHtml = async (url) => {
    try {
      return await axios.get(url);
    } catch (error) {
      console.error(error);
    }
  };

const titleList = [];

const getTitle = async (url) => {
    getHtml(url)
    .then(html => {
      let ulList = [];
      const $ = cheerio.load(html.data);
      const $bodyList = $("div#container ul").children("li");
  
      $bodyList.each(function(i, elem) {
        ulList[i] = {
            title: $(this).find('.news-con a strong').text(),
            url: $(this).find('.news-con a').attr('href'),
            image_url: $(this).find('.img-con a img').attr('src'),
            image_alt: $(this).find('.img-con a img').attr('alt'),
            summary: $(this).find('.news-con p.lead').text(),
            date: $(this).find('.item-box01 .txt-time').text()
        };
      });
  
      const data = ulList.filter(n => n.date);
      return data;
    })
    .then(res => res.forEach(item => {
        fs.appendFile('./tmp/title.txt', item.title + '\n', err => {
            if (err) {
                console.error(err)
                return
            }})
    }));
}

  
getTitle("https://www.yna.co.kr/sports/all")