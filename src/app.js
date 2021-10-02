require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express')
const mongoose = require('mongoose')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const fruitCrawl = require('./../crawlers/fruitCrawler.js');
const personalCrawl = require('./../crawlers/personalCrawler.js')

const app = express();

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

// Handlebars Set up
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//fruitCrawl.queue('https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html');

// Crawl Personal Website
//personalCrawl.queue('https://webscraper.io/test-sites/e-commerce/allinone');

app.use('/fruits', require('./../routes/fruits.js'))
app.use('/personal', require('./../routes/personal.js'))

app.get('/', async (req, res) => {
    try {
        res.render('index')
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.listen(PORT, console.log(`Server listening on http://localhost:${PORT}`))