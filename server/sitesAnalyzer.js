var phantom = require('node-phantom-simple');
var Q = require('q');
var DataProvider = require('./csvDataProvider').DataProvider;
var dataProvider = new DataProvider();

var MAXIMUM_TIME_BEFORE_TIMEOUT = 30000; //30 secs

SitesAnalyzer = function() {

};

SitesAnalyzer.prototype.testSites = function(){
    var self = this;
    var sites = dataProvider.getSites();
    sites.forEach(function(site){
        self._timeUrl(site);
    });
}

/**
 * manualy test a site and return the result to page
 * @param siteUrl
 */
SitesAnalyzer.prototype.testSingleSite = function(siteUrl){
    var deferred = Q.defer();
    var result = [];

    phantom.create(function (err, phantom) {
        phantom.createPage(function (err, page) {
            page.open(siteUrl, function (err, status) {

            });

            page.onConsoleMessage = function (msg) {
                if (msg.indexOf("loading time line") != -1) {
                    result.push(msg);
                }
            }

            setTimeout(function(){
                deferred.resolve(result);
                phantom.exit();
            }, 20*1000); //20 seconds to load a site...
        });
    });

    return deferred.promise;
}

/**
 * recieve a site url, open phantom page with the url, on console log of timush
 * read the log and put it in our csv file for later analyzing
 * @param siteUrl
 * @private
 */
SitesAnalyzer.prototype._timeUrl = function(siteUrl){
    var self = this;
    phantom.create(function (err, phantom) {
        phantom.createPage(function (err, page) {
            console.log("created phantom site for page " + siteUrl);

            page.open(siteUrl, function (err, status) {
                //console.log(status, err);
            });

            page.onError = function(msg, trace) {
                var msgStack = ['ERROR: ' + msg];
                if (trace && trace.length) {
                    msgStack.push('TRACE:');
                    trace.forEach(function(t) {
                        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                    });
                }
                console.error(msgStack.join('\n'));
            };

            page.onConsoleMessage = function (msg) {
                if (msg.indexOf("loading time line") != -1) {
                    var result = self._clearResultStrings(msg);
                    self._analyzeSiteResult(result);
                }
            }

            setTimeout(function(){
                console.log("closed server for page " + siteUrl);
                phantom.exit();
            }, MAXIMUM_TIME_BEFORE_TIMEOUT);
        });
    });
}

/**
 * Takes a an array of strings and clears them from "[", "]" chars
 * and returns an array
 * @param msg
 * @returns {Array|{index: number, input: string}}
 * @private
 */
SitesAnalyzer.prototype._clearResultStrings = function(msg){
    var result = msg.match(/\[(.*?)\]/g);

    for(var i = 0; i < result.length; i++){
        result[i] = result[i].substring(0, result[i].length - 1);
        result[i] = result[i].substring(1);
    }

    return result;
}


/**
 *
 * @param Array such as ["[ppPrt20-h9v]", "[4580.000000016298]", "[584.9999999627471]", "[1394.9999999604188]", "[4870.999999984633]", "[9451.000000000931]"]
 * @private
 */
SitesAnalyzer.prototype._analyzeSiteResult = function(result){
    console.log("writing result to file " + result);
    dataProvider.setResult(result);
}


exports.SitesAnalyzer = SitesAnalyzer;