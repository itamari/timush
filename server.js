var express = require("express");
var app = express();
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var phantom = require('node-phantom-simple');
var Q = require('q');
var DataProvider = require('./server/csvDataProvider').DataProvider;
var SitesAnalyzer = require('./server/sitesAnalyzer').SitesAnalyzer;

var port = 80;
var result = [];

var dataProvider = new DataProvider();

var sitesAnalyzer = new SitesAnalyzer();

/****** Test sites every hour *****/
setInterval(function(){
    console.log("testing sites...");
    sitesAnalyzer.testSites();
}, 60*60*1000); //every hour

/**************************** SERVER ****************************/
app.use(express.bodyParser());

/**
 * Recieve the post request from the user
 */
app.post('/manual-performance', function (req, res) {
    var siteToTest = req.body.site;

    if(siteToTest){
        console.log("testing a single site " + siteToTest);
        sitesAnalyzer.testSingleSite(siteToTest).then(function(result){
            res.end(JSON.stringify(result));
        });
    } else {
        res.end("must send a site url to test...");
    }
});

app.get('/get-sites', function (req, res) {
    console.log("Recieved request to get sites");
    var result = dataProvider.getSites();
    console.log(result);
    res.end(JSON.stringify(result));
});

app.post('/add-site', function (req, res) {
    console.log("Recieved request to add a new site.");
    var newSite = req.body.site;
    var result = dataProvider.addSite(newSite);
    res.end(JSON.stringify(result));
});

app.post('/remove-site', function (req, res) {
    console.log("Recieved request to add a new site.");
    var newSite = req.body.site;
    var result = dataProvider.removeSite(newSite);
    res.end(JSON.stringify(result));
});

app.get('/download', function(req, res){
    var file = __dirname + '/server/results.csv';
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    res.setHeader('Content-type','text/html');
    var d = fs.readFileSync(file).toString();
    res.end(d);
});

app.use(express.static(__dirname + '/public/'));

console.log("listening on port " + port);
app.listen(port);