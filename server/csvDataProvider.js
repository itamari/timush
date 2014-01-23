var fs = require('fs');
var sitesFile = "./server/sites.csv";
var resultsFile = "./server/results.csv";

// Application initialization
DataProvider = function() {

};


DataProvider.prototype.addSite = function(data) {
    fs.appendFileSync(sitesFile, "\n" + data);
    return this._readSitesFromFile();
};

DataProvider.prototype.removeSite = function(data) {
    var sites = this._readSitesFromFile();
    var indexToRemove = sites.indexOf(data);
    if(indexToRemove != -1){
        sites.splice(indexToRemove, 1);
    }

    fs.writeFileSync(sitesFile, sites.join("\n"));

    return this._readSitesFromFile();
};

DataProvider.prototype.getSites = function(){
    return this._readSitesFromFile();
}

/**
 * Get the sites daya from our sites file.
 * @returns {Array} results of the file's rows as arrays
 * @private
 */
DataProvider.prototype._readSitesFromFile = function(){
    var result = [];

    fs.readFileSync(sitesFile).toString().split('\n').forEach(function (line) {
        result.push(line);
    });

    return result;
}

DataProvider.prototype.setResult = function(siteResult){
    fs.appendFileSync(resultsFile, siteResult.join() + "\n");
}


exports.DataProvider = DataProvider;