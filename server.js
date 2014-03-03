var express = require("express");
var app = express();
var port = 8080;

var DataProvider = require('./server/mongoDataProvider').DataProvider;
var connectQuery = 'mongodb://127.0.0.1:27017/local';
var dataProvider = new DataProvider(connectQuery);

var SitesAnalyzer = require('./server/sitesAnalyzer').SitesAnalyzer;
var sitesAnalyzer = new SitesAnalyzer();

sitesAnalyzer.initialize();


/**************************** SERVER ****************************/
app.use(express.bodyParser());

/**
 * Recieve the post request from the user
 */
app.post('/manual-performance', function (req, res) {
    var siteToTest = req.body.site;
    try{
        if(siteToTest){
            console.log("testing a single site " + siteToTest);
            sitesAnalyzer.testSingleSite(siteToTest, function(result){
                res.end(JSON.stringify(result));
            });
        } else {
            res.end("must send a site url to test...");
        }
    } catch (e){
        res.end(e);
    }
});

app.get('/get-data', function (req, res) {
    console.log("get collection db....");
    dataProvider.getCollection('Timush').then(function(result){
        console.log(result);
        res.end(JSON.stringify(result));
    });
});

/*
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
*/

app.use(express.static(__dirname + '/public/'));

console.log("Listening on port: " + port);
app.listen(port);