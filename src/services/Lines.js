//================================= LINES

var VirtualManager = require('./VirtualManager.js');
var Utils = require('./Utils.js');
var q = require('q');
var md5 = require('MD5');
var fs = require('fs');
var async = require('async');
var _ = require('underscore'); 

var vm = new VirtualManager();
var JSON_FILE = require('path').join(__dirname, "../../lines.json");

function fetchLine(line){	
	return vm.getBollardsByLine(line);
}
function normalizeLine(serverData){
	var parsed = _.map(serverData.success.directions, function(direction){
		var lineName = direction.direction.lineName;
		var directionName = direction.direction.direction;
		var bollards = _.map(direction.bollards, function(bollard){		
			return [bollard.name, bollard.tag, bollard.symbol];
		});
		return [lineName, directionName, bollards];
		
	});
	return parsed;
}
function fetchAllLines(lines){
	var deffered = q.defer();
	var promises = _.map(lines, function(line){
		return function(cb){
			fetchLine(line).then(function(result){
				console.log(line)
				cb(null, result);
			}, function(err){
				cb(err);
			});
		};
	});
	
	async.series(promises, function(err, result){
		deffered.resolve(result);
	});
	return deffered.promise;
}
function normalizeAllLines(results){
	var parsed = [];
	_.each(results, function(lineResult){
		if(lineResult.success){
			parsed = _.union(normalizeLine(lineResult),parsed);
		}
	});
	return parsed;
}
function saveAllLines(lines){
	var deferred = q.defer();
	var hash = Utils.getHash(lines);
	var content = {
				hash: hash,
				lines: lines
	};	
	fs.writeFile(JSON_FILE, JSON.stringify(content), function(err) {
		    if(err) {
		        deferred.reject(err);
		    }
		    deferred.resolve(content);
	});	
	return deferred.promise;
}


function fetchLines(){
	var funcs = [fetchAllLines, normalizeAllLines];
	var result = q(_.union(_.range(1,1000), ['L']));
	funcs.forEach(function (f) {
	    result = result.then(f);
	});
	return result;
}

var readLines = function(){
	var deferred = q.defer();
	fs.readFile(JSON_FILE, "UTF-8", function(err, content){
		if(err){
			deferred.reject();
		}else{
			deferred.resolve(JSON.parse(content));
		}		
	});
	return deferred.promise;
};

var api = {
	fetch: fetchLines,
	write: saveAllLines,
	read: readLines
};

module.exports = api;