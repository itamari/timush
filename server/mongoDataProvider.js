/**
 * Created by itamari on 2/27/14.
 */
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var Q = require('q');


DataProvider = function(connectQuery) {
    this.connectQuery = connectQuery;
};

DataProvider.prototype.insertTimushQuery = function(query){
    MongoClient.connect(this.connectQuery, function (err, db) {
        if (err) throw err;

        var collection = db.collection('Timush');
        // Locate all the entries using find
        collection.insert(query, function (err, docs) {
            db.close();
        });
    });
}

DataProvider.prototype.getSites = function(){
    return this._getCollection('sites');
}

DataProvider.prototype._getCollection = function(collectionName) {
    var deferred = Q.defer();
    MongoClient.connect(this.connectQuery, function (err, db) {
        if (err) throw err;

        var collection = db.collection(collectionName);
        // Locate all the entries using find
        collection.find().toArray(function (err, results) {
            console.dir(results);
            deferred.resolve(results);
            // Let's close the db
            db.close();
        });
    });
    return deferred.promise;
};


exports.DataProvider = DataProvider;