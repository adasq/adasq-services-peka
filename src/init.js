
var express = require('express');
var q = require('q');
var request = require('request');

var JDManager = require('./JDManager.js');
var _ = require('underscore'); 
var cheerio = require('cheerio'); 
 var routesGET = require('./routes/get.js');
var md5 = require('MD5');
var fs = require('fs');
var cheerio = require('cheerio'); 

var RequestHandler = require('./services/RequestHandler.js');
var VirtualManager = require('./services/VirtualManager.js');
var Lines = require('./services/Lines.js');
var Places = require('./services/Places.js');
var Directions = require('./services/Directions.js');
var Utils = require('./services/Utils.js');

module.exports = function(){
 

function getTimesBySymbol (symbol){
var deferred = q.defer();
vm.getTimesBySymbol(symbol).then(function(response){
	if(response.success){
		var times = response.success.times;
		var bollard = response.success.bollard;
		var times = _.map(times, function(row){			
			var departureTimeString = row.departure.substr(11, 5);
			return [row.realTime, row.line, row.direction, row.minutes, departureTimeString]
		});
        console.log(times)
		deferred.resolve({bollard: bollard, times: times});
	}else if(response.failure){
			deferred.resolve({
                times: []
            });
	}else{
		deferred.reject();
	}
}, deferred.reject );
return deferred.promise;
}



function fetchData(){
	var deferred = q.defer();
	Lines.fetch().then(function(lines){		
		var places = Places.generateByLines(lines);		
		Directions.fetchByPlaces(places).then(function(directions){
			deferred.resolve({
				places: places,
				lines: lines,
				directions: directions
			});
		}, deferred.reject);				
	}, deferred.reject);
	return deferred.promise;
}
 
function readDataFromFile(){
	var deferred = q.defer();
	var database = {};
	q.all([Places.read(), Lines.read(), Directions.read()]).then(function(data){
		database.places = data[0];
		database.lines = data[1];
		database.directions = data[2];
		deferred.resolve(database);
	}, deferred.reject);
	return deferred.promise;
}


function saveDataToFile(data){
	return q.all([
			Directions.write(data.directions), 
			Lines.write(data.lines), 
			Places.write(data.places)
		]);
}


var watchService = {
	fetchData: fetchData,
	read: readDataFromFile,
	save: saveDataToFile
};

 

var database = {
	places: null,
	lines: null,
	directions: null
};

// Lines.fetch().then(function(lines){
// var hash = Utils.getHash(lines);
// console.log(hash);
// })
	// watchService.fetchData().then(function(data){ 
	// 	var hash = Utils.getHash(data.lines);
	// 	console.log(hash);
	// }, function(){
	// 	console.log('watchService.fetchData err');
	// });	


watchService.read().then(function(db){
	database = db;
	console.log('db loaded');
}, function(){
	console.log('err while reading');
	watchService.fetchData().then(function(data){
		console.log(!!data);
		watchService.save(data).then(function(){
			console.log('saved!');
		}, function(){
			console.log('err while writing');
		});
	}, function(){
		console.log('watchService.fetchData err');
	});	
});

//routes ===============================================

    var routes = [{
        method: 'GET',
        path: '/check',
        handler: function (request, reply) {
        	var obj = {};
			obj.places = database.places.hash;
			obj.lines = database.lines.hash;
			obj.directions = database.directions.hash;
			reply(result);            
        }
    },{
        method: 'GET',
        path: '/all',
        handler: function (request, reply) {        	
				reply(database);           
        }
    },{
        method: 'GET',
        path: '/places',
        handler: function (request, reply) {
        	reply(database.places);          
        }
    },{
        method: 'GET',
        path: '/lines',
        handler: function (request, reply) {
        	reply(database.lines);
        }
    },{
        method: 'GET',
        path: '/directions',
        handler: function (request, reply) {
        	
        	reply(database.directions);
        }
    },{
        method: 'GET',
        path: '/getTimes/{symbol}/{format*}',
        handler: function (request, reply) {        	
        	getTimesBySymbol(request.params.symbol).then(function(result){
                if(request.params.format === 'text'){

                    var html = "<table>";
                    _.each(result.times, function(time){
                        html += `<tr><td>${time[1]}</td><td>${time[2]}</td><td>${time[3]}</td><td>${time[4]}</td></tr>`;
                    });
                    html+="</table>";

                    const html2 = `
                        <html>
                            <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    td {
                                        border: none;
                                    }
                                    tr:nth-child(even) {
                                        background-color: #f1f1f1;
                                    }
                                    tr:nth-child(odd) {
                                        
                                    }
                                </style>
                            </head>
                            <body>
                                ${html}
                            </body>
                        </html>
                    `;
                    reply(html2);

                }else{
                    reply(result);
                }
				
			}, function(){
				reply({error: true}, 500);
			});
        }
    },{
        method: 'GET',
        path: '/track/{line}/{direction}/{format*}',
        handler: function (request, reply) {

        	var line = request.params.line || 1;
			var direction = (request.params.direction == '1') ? 1 : 0;
			prepare(line, direction).then(function(result){
                console.log(result)
				if(request.params.format === 'text'){
					var html = "<table>";
					_.each(result, function(place){
						html += `<tr><td><a href="/peka/getTimes/${place.t2}/text">`+place.stop+`</a></td><td>`+(place.min ? place.min+'min.': place.fcked ? "fcked": "-")+`</td></tr>`;
					});
					html+="</table>";

                    const html2 = `
                        <html>
                            <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                    td {
                                        border: none;
                                    }
                                    tr:nth-child(even) {
                                        background-color: #f1f1f1;
                                    }
                                    tr:nth-child(odd) {
                                        
                                    }
                                </style>
                            </head>
                            <body>
                            <a href="/peka/track/${line}/${+!(direction)}/text">change direction of ${line}</a>
                                ${html}
                            </body>
                        </html>
                    `;

					reply(html2);
				}else{
					reply(result);
				}
			}, function(err){
				reply({error: err});
			});	
        }
    }];



 //routes ===============================================

var vm = new VirtualManager();


var readLines = function(lineNo, target){
	var deferred = q.defer();
	vm.getBollardsByLine(lineNo).then(function(resp){
		if(!resp.success){
			return deferred.reject('could not retrive line stops');
		}
		var d1 = resp.success.directions[target];	 	
		deferred.resolve(_.map(d1.bollards, function(bollard){
	 		return [bollard.name, bollard.tag, bollard.symbol];
		 }));
	},deferred.reject);
	return deferred.promise;
};


function prepare(lineNo, target){
	var deferred = q.defer();
	readLines(lineNo, target).then(function(lineStops){
		var promises = _.map(lineStops, function(stop){
			return getTimesBySymbol(stop[1]);
		});
		q.all(promises).then(function(timeTables){
            console.log(timeTables)
			var result = [];
			_.each(timeTables, function(timeTable, i){
				//console.log(i+'. '+lineStops[i][0]+' '+lineStops[i][1]+' '+lineStops[i][2]);
				var stop = _.find(timeTable.times, function(stop){
					return stop[0] && stop[1] == lineNo;
				}); 
				if(stop){
				//	console.log('\t\tprzyjedzie za: '+stop[3]);
				}else{
					//console.log('\t\t-------');
				}
				result.push({
                    fcked: (timeTable.times.length === 0),
					min: (stop && stop[3]) || null,
					stop: lineStops[i][0],
					t1: lineStops[i][1],
					t2: lineStops[i][2]					
				});
			});
			deferred.resolve(result);
		}, function(err){
            console.log('err', err);
        });
	}, deferred.reject);		
	return deferred.promise;
}

	var api = {
		route: 'peka',
		routes: routes,
		init: function(){}
	};

	return api;

 
 





};