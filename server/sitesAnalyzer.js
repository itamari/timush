var phantom = require('node-phantom-simple');
var Q = require('q');
var _ = require('lodash');

var DataProvider = require('./mongoDataProvider').DataProvider;
var connectQuery = 'mongodb://127.0.0.1:27017/local';
var dataProvider = new DataProvider(connectQuery);

var MAXIMUM_TIME_BEFORE_TIMEOUT = ((1.8) * 60 * 1000); //
var INTERVAL_BETWEEN_SITES_TEST = (2 * 60 * 1000); //
var INTERVAL_TO_START_TESTING = (60 * 60 * 1000); //

var SITES_TO_TEST = [
    "http://wixapps.nigiri.wixpress.com/gordonsmedt?timush=true&statemap=140302.1221.36&mode=debug&wconsole=false#!representation/c65q",
    "http://wixapps.nigiri.wixpress.com/opinioncarib?timush=true&statemap=140302.1221.36&mode=debug&wconsole=false"
];

var currentSitesQueue = [];

/**
 * Start testing all sites once every hour!
 * @constructor
 */
SitesAnalyzer = function() {

};

SitesAnalyzer.prototype.initialize = function(){
    var self = this;
    console.log("Registered Site Analyzer, will start testing sites in 1 hour");
    setInterval(function(){
        self.startSitesTesting();
        console.log("Sites Analyzer has started to run hourly tests...");
    }, INTERVAL_TO_START_TESTING); // 1 hour
}

/**
 * Iterate over all sites, take 2 min max for each site!
 * Once the result returns insert it into our mongo db >:O
 */
SitesAnalyzer.prototype.startSitesTesting = function (){
    var self = this;
    currentSitesQueue = _.clone(SITES_TO_TEST);

    var intervalId = setInterval(function(){
        if(!currentSitesQueue.length){
            clearInterval(intervalId);
            console.log("Sites Analyzer has finished testing sites... waiting for next interval...");
            return;
        }
        self.testSingleSite(currentSitesQueue.pop(), self.registerTimingResult);
    }, INTERVAL_BETWEEN_SITES_TEST);
}


SitesAnalyzer.prototype.registerTimingResult = function(result){
    console.log("Site analyzer finished testing a site: " + result);
    if(result.indexOf("error") != -1){
        return;
    }
    dataProvider.insertTimushQuery(result);
}

/**
 * manualy test a site and return the result to page
 * @param siteUrl
 */
SitesAnalyzer.prototype.testSingleSite = function(siteUrl, onEnd){
    var self = this;
    console.log("Site analyzer started testing a site: " + siteUrl);
    phantom.create(function (err, phantom) {
        phantom.createPage(function (err, page) {
            page.open(siteUrl, function (err, status) {

            });

            page.onConsoleMessage = function (msg) {
                if (msg.indexOf("repoEnd") != -1) {
                    var result = JSON.parse(msg);
                    console.log("----------------------------------------");
                    console.log("Timush found string: " + msg);
                    if(onEnd){
                        onEnd(result);
                    } else {
                        self.registerTimingResult(result);
                    }
                    clearTimeout(timoutId);
                    phantom.exit();
                }
            }

            var timoutId = setTimeout(function(){
                console.log("----------------------------------------");
                console.log("Timush could not find the timush string!");
                onEnd("{error: 'Could not get a timush result'}");
                phantom.exit();
            }, MAXIMUM_TIME_BEFORE_TIMEOUT);
        });
    });

}

exports.SitesAnalyzer = SitesAnalyzer;