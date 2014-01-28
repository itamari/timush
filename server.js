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

//setInterval(function(){
//    console.log("testing sites...");
//    sitesAnalyzer.testSites();
//}, 60000 * 60* 24); //DAILY!

setTimeout(function(){
    console.log("testing sites...");
    sitesAnalyzer.testSites();
}, 3*3600); //DAILY!

/**************************** SERVER ****************************/
app.use(express.bodyParser());

/**
 * Recieve the post request from the user
 */
app.post('/manual-performance', function (req, res) {
    phantom.create(function (err, phantom) {
        phantom.createPage(function (err, page) {
            page.open("http://wixapps.nigiri.wixpress.com/gordonsmedt?timush=true&wconsole=false#!representation/c65q", function (err, status) {

            });

            page.onConsoleMessage = function (msg) {
                if (msg.indexOf("view ready") != -1) {
                    var timeToRender = parseInt(msg.split(':')[2]);
                    result.push(timeToRender);
                    res.send(result);
                    phantom.exit();
                }
            }
        });
    });
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

//    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
//    res.setHeader('Content-type', mimetype);
    res.setHeader('Content-type','text/html');
    //var filestream = fs.createReadStream(file);
    var d = fs.readFileSync(file).toString();
    //d = d.replace(/ /g,"_");
    //d = d.replace(/,/g," ");
    res.end(d);
    //filestream.write(d);
   // filestream.pipe(res);
});

app.use(express.static(__dirname + '/'));

console.log("listening on port " + port);
app.listen(port);