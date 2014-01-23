var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

DataProvider = function(host, port) {
    this.db= new Db('node-mongo-sites', new Server(host, port, {auto_reconnect: true}, {}));
    this.db.open(function(){});
};


DataProvider.prototype.getCollection= function(callback) {
    this.db.collection('sites', function(error, sites_collection) {
        if( error ) callback(error);
        else callback(null, sites_collection);
    });
};

DataProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, sites_collection) {
        if( error ) callback(error)
        else {
            sites_collection.find().toArray(function(error, results) {
                if( error ) callback(error)
                else callback(null, results)
            });
        }
    });
};


DataProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, sites_collection) {
        if( error ) callback(error)
        else {
            sites_collection.findOne({_id: sites_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
                if( error ) callback(error)
                else callback(null, result)
            });
        }
    });
};

DataProvider.prototype.save = function(sites, callback) {
    this.getCollection(function(error, sites_collection) {
        if( error ) callback(error)
        else {
            if( typeof(sites.length)=="undefined"){
                sites = [sites];
            }

            sites_collection.insert(sites, function() {
                callback(null, sites);
            });
        }
    });
};

exports.DataProvider = DataProvider;