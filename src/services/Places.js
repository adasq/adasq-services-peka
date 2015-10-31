//================================= LINES

var VirtualManager = require('./VirtualManager.js');
var Utils = require('./Utils.js');
var q = require('q');
var md5 = require('MD5');
var fs = require('fs');
var path = require('path');
var _ = require('underscore'); 

var vm = new VirtualManager();

function getPlacesByLines(lines){
	var all = [];
	_.each(lines, function(line){
		var bollards = line[2];			
		_.each(bollards, function(bollard){			
			var symbol = bollard[2];
			var name = bollard[0];			
				all.push(name.substr(name, name.length-5));				
		
		});			
	});
	return _.sortBy(_.uniq(all));
}

function writeToFile(places){
	var deferred = q.defer();
	var hash = Utils.getHash(places);
	var content = {
				hash: hash,
				places: places
	};	
	fs.writeFile(path.join(__dirname, "../../places.json"), JSON.stringify(content), function(err) {
		    if(err) {
		        deferred.reject(err);
		    }
		    deferred.resolve(content);
	});	
	return deferred.promise;
}

var readPlaces = function(){
	var deferred = q.defer();
	fs.readFile(path.join(__dirname, "../../places.json"), "UTF-8", function(err, content){
		if(err){
			deferred.reject();
		}else{
			deferred.resolve(JSON.parse(content));
		}
		
	});
	return deferred.promise;
};

function creatAndSaveAllPlaces(){
	var funcs = [readLines, function(fileObj){return fileObj.lines;}, getPlacesByLines, saveAllPlaces];
	var result = q();
	funcs.forEach(function (f) {
	    result = result.then(f);
	});
	return result;
}


var api = {
	generateByLines: getPlacesByLines,
	write: writeToFile,
	read: readPlaces
};

module.exports = api;