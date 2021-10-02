const express = require('express')
const Fruit = require('./../models/fruit.js')
const mongoose = require('mongoose');
const router = express.Router();
const elasticlunr = require('elasticlunr');
const PageRankJS = require('./../src/pagerank.js');
const personalCrawl = require('./../crawlers/personalCrawler.js');

router.get('/', async (req, res) => {
    try {
        personalCrawl.queue('https://www.w3schools.com/');

        console.log('Crawled personal webiste')

        res.render('index', {done: ""});
    }
    catch (error) {
        throw error
    }
});


module.exports = router