const Crawler = require('crawler')
const Fruit = require('./../models/fruit.js')

var listOfLinks = new Set();
var filterText = [",", ".", "\\n"]

const fruitCrawl = new Crawler({
    maxConnections : 1,

    callback: async (error, res, done) => {
        if(error) console.log(error);
        else {
            let $ = res.$;
            let links = $("a");

            const id = $("title").text().replace("N-", "");
            listOfLinks.add(id);

            let pageText = $("p")
            
            const currentPage = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${$("title").text()}.html`;
            outgoingLinks = [];

            // If initial link
            if(currentPage === 'https://people.scs.carleton.ca/~davidmckenney/fruitgraph/N-0.html') {
                const fruit = new Fruit({
                    id: id,
                    url: currentPage,
                    text: pageText
                })
                try {
                    await fruit.save()
                    console.log('Created N-0')
                }
                catch(e) {
                    throw e
                }
            }

            $(links).each(async (i, link) => {
                const currentLink = `https://people.scs.carleton.ca/~davidmckenney/fruitgraph/${$(link).text()}.html`;
                const linkId = $(link).text().replace("N-", "");
                outgoingLinks.push(currentLink);

                const findLink = listOfLinks.has(linkId);

                // If link was not visited
                if(!findLink) {
                    const fruit = new Fruit({
                        id: linkId,
                        url: currentLink,
                        incomingLinks: [currentPage],
                    })
                    try {
                        await fruit.save();
                    } catch (e) {

                    }
                    fruitCrawl.queue(currentLink);
                    listOfLinks.add(linkId);
                }
                else { // If link was visited
                    try {
                        await Fruit.findOneAndUpdate({id: linkId}, {
                            $push: { incomingLinks: currentPage}
                        });
                    } catch (e) {}
                }

                // Outgoing links
                try {
                    await Fruit.findOneAndUpdate({id: id}, { outgoingLinks: outgoingLinks, text: pageText });
                } catch (e) {

                }
            });
        }
        done();
    }
});

// Crawl Fruit Website
fruitCrawl.on('drain', () => console.log(`Done.`));

module.exports = fruitCrawl;