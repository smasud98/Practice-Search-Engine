const Crawler = require('crawler')
const Personal = require('./../models/personal.js')

listOfLinks = new Set();

let id = 0;

const personalCrawl = new Crawler({
    maxConnections : 1,

    callback: async (error, res, done) => {
        if(error) console.log(error);

        else {

            let $ = res.$;
            let links = $("a");

            let pageText = $("p");

            const currentPage = String(res.options.uri);
            outgoingLinks = [];
            
            // If initial link
            if(currentPage === 'https://www.w3schools.com/') {
                const personal = new Personal({
                    id: currentPage,
                    url: currentPage,
                    text: pageText
                })
                try {
                    await personal.save()
                    console.log('Saved initial page')
                }
                catch(e) {
                    console.log('Failed to save inital page')
                    throw e
                }
            }
            let chunks = currentPage.substring(8).split('/')
            chunks.push('http')
            chunks.push('undefined')

            // Traverse each link
            $(links).each(async (i, link) => {
                const currentLink = String($(link).attr('href'))
                let flag = true;
                
                chunks.forEach(chunk => {
                    if (currentLink.includes(chunk))  {
                        flag = false;
                    }
                })
                if (flag == true && outgoingLinks.includes(`${res.options.uri}${currentLink}`) == false) {
                    outgoingLinks.push(`${res.options.uri}${currentLink}`)

                    const findLink = listOfLinks.has(`${res.options.uri}${currentLink}`);

                    // If link was not visited
                    if(!findLink) {
                        const personal = new Personal({
                            id: `${res.options.uri}${currentLink}`,
                            url: `${res.options.uri}${currentLink}`,
                            incomingLinks: [currentPage]
                        });
                        try {
                            await personal.save();
                        } catch(e) {}

                        // Add to queue
                        if(listOfLinks.size >= 500) {
                            personalCrawl.queue(`${res.options.uri}${currentLink}`)
                            listOfLinks.add(`${res.options.uri}${currentLink}`)
                        }
                    }
                    else { // If link was visited
                        try {
                            await Personal.findOneAndUpdate({id: `${res.options.uri}${currentLink}`}, {
                                $push: { incomingLinks: currentPage}
                            });
                        } catch(e) {}
                    }
                }
                console.log(`On link: ${$(link).attr('href')}`)

            });

            try {
                await Personal.findOneAndUpdate({id: currentPage}, { outgoingLinks: outgoingLinks, text: pageText });
                listOfLinks.add(currentPage)
            } catch(error) {

            }
        }
        done();
    }
})

// Crawl Fruit Website
personalCrawl.on('drain', () => console.log(`Done.`));

module.exports = personalCrawl;
