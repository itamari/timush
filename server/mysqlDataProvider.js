var express    = require('express'),
    mysql      = require('mysql');

// Application initialization
DataProvider = function() {
    console.log("initializing database connection");
    this.dbconnection = mysql.createConnection({
        host     : '127.0.0.1',
        port     : '3306',
        user     : 'root',
        password : 'tom is test',
        database : 'timush'
    });
};


DataProvider.prototype.getSites = function(callback) {
    var connection = this.dbconnection;
    console.log("fetching sites from database");
    connection.query('SELECT * FROM sites', function (err, rows) {
            console.log("got sites from database: " + rows);
            callback(rows);
            connection.destroy();
        }
    );
};

DataProvider.prototype.setSites = function(sites, callback) {
    var connection = this.dbconnection;
    console.log("fetching sites from database");
    connection.query('SELECT * FROM sites', function (err, rows) {
            console.log("got sites from database: " + rows);
            callback(rows);
            connection.destroy();
        }
    );
}

exports.DataProvider = DataProvider;