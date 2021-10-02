Author: Shatil Masud

This project is a search engine website built using Express.js and MongoDB to allow users to search fruits on a sample dummy website and all outgoing links connected to it. This search engine makes use of web crawlers to scrape all data from each page include the outgoing links, and recursively repeats the process using a specified selection policy. Using a combination of the elasticlunr library and by implementing Google's PageRank algorithm, a user can search a word or a series of words and will be outputted a specified number of ranked results of web pages where there search occurs.

1) Install packages with 'npm install'

2) To crawl the fruit website, uncomment line 29 in src/app.js and wait until it console logs 'Done'. 
   (There is an issue with the personal website crawling)
   To run, 'npm start'. If the crawling is done, comment out line 29 if you wish to not keep crawling over and over then search away!

3) Go to /fruits and search using the UI or use the url by entering /query/numberofPages/boost<true or false>

4) To see details for a specific page, enter the id in the url using /fruits/id

5) To see more details of the specific page, click the button beside the results
