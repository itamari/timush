var phantom = require('node-phantom-simple');
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
                    var result = msg.match(/\[(.*?)\]/g);
                    for(var i = 0; i < result.length; i++){
                        result[i] = result[i].substring(0, result[i].length - 1);
                        result[i] = result[i].substring(1);
                    }
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
 *
 * @param Array such as ["[ppPrt20-h9v]", "[4580.000000016298]", "[584.9999999627471]", "[1394.9999999604188]", "[4870.999999984633]", "[9451.000000000931]"]
 * @private
 */
SitesAnalyzer.prototype._analyzeSiteResult = function(result){
    console.log("writing result to file " + result);
    dataProvider.setResult(result);
}


exports.SitesAnalyzer = SitesAnalyzer;