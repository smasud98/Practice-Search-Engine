const express = require('express')
const Fruit = require('./../models/fruit.js')
const mongoose = require('mongoose');
const router = express.Router();
const elasticlunr = require('elasticlunr');
const PageRankJS = require('./../src/pagerank.js');
const fruitCrawl = require('./../crawlers/fruitCrawler.js');

const index = elasticlunr(function () {
    this.addField('url');
    this.addField('text');
    this.setRef('id')
})

let pageranks = []

router.get('/', async (req, res) => {
    try {
        res.render('index', {done: ""});
    }
    catch (error) {
        throw error
    }
});

// SEARCH FRUIT PAGE BY ID
router.get('/:id', async (req, res) => {
    try {
        const rank = pageranks.get(req.params.id)
        const page = await Fruit.findOne({id: req.params.id }).lean();
        res.render('page', {page, rank });

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// SEARCH QUERY BY URL
router.get('/:q/:limit/:boost', async(req, res)=>{
    try {
        const query = req.params.q;
        const limit = Number.isInteger(parseInt(req.params.limit)) == true ? req.params.limit : 10
        const checkBoost = req.params.boost == "true" ? req.params.boost : "false";

        const result = await searchFruits(query, limit, checkBoost);

        res.render('index', {query, response: result })

    } catch(error) {
        res.status(400).render('index')
    }
})


// SEARCH QUERY BY UI
router.post('/', async (req, res) => {
    try {
        const checkBoost = req.body.checkBoost;        
        const query = req.body.queryFruits;
        const limit = req.body.limit;

        const result = await searchFruits(query, limit, checkBoost);

        res.render('index', {query, response: result })

    } catch(error) {
        res.status(400).render('index')
    }
});



// HELPER FUNCTION =============================================

// Search function
async function searchFruits(q, lim, boost) {
    
    let numResults = 10;

    if(lim <= 50 && lim >= 1) numResults = lim;

    // ElasticLunr Search
    await elasticLunrSearch();

    let elasticResults = index.search(q);

    //If boost is true
    if(boost=="true") {
        console.log(`Boost is true`)
        elasticResults = await boostByPageRank(elasticResults)
    }
    
    elasticResults.sort((a,b) => parseFloat(b.score) - parseFloat(a.score))

    if(elasticResults.length < numResults) {
        var response = elasticResults;
    } else{
        var response = elasticResults.slice(0, numResults)
    }
    return response
}


async function elasticLunrSearch() {
    try {
        const count = await Fruit.find().countDocuments();
        const arr = await Fruit.find();
    
        for(i = 0; i < count; i++) {
            const doc = {
                id: arr[i].id,
                url: arr[i].url,
                text: String(arr[i].text)
            }
            index.addDoc(doc)
        }
    } catch(error) {

    }
}

async function boostByPageRank(eResults) {
    try {
        pageranks = await PageRankJS(Fruit);
        
        for(i = 0; i < eResults.length; i++) {
            eResults[i].score *= pageranks.get(eResults[i].ref);
        }
        return eResults;
    }
    catch(error) {

    }
}

module.exports = router