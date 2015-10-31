//================================= LINES

var VirtualManager = require('./VirtualManager.js');
var SequentialManager = require('./SequentialManager.js');
var Utils = require('./Utils.js');
var q = require('q');
var md5 = require('MD5');
var fs = require('fs');
var _ = require('underscore'); 

var JSON_FILE = require('path').join(__dirname, "../../directions.json");

var vm = new VirtualManager();

function fetchDirectionsByPlace(place){
	var deferred = q.defer();
	vm.getBollardsByStopPoint(place).then(function(result){
		deferred.resolve({
			place: place,
			result: result
		});
	});
	return deferred.promise;

}

function fetchDirectionsByPlaces(places){
	var promises = _.map(places, function(place){
		return fetchDirectionsByPlace(place);
	});
	return q.all(promises);
}
function filterInvalidDirections(directions){
	var validDirections = this.validDirections, invalidPlaces = [];
	_.each(directions, function(result){
		var direction = result.place;
		var data = result.result.success;
		if(!data.bollards){			
			invalidPlaces.push(direction);		
		}else{
			validDirections.push(result);
		}
	});
	return invalidPlaces;
}

function appendOnDemandToInvalidPlaces(invalidPlaces){
		var placesOnDemand = _.map(invalidPlaces, function(place){
			return place+' n/ż';
		});		
		return placesOnDemand;
	}

function parse(){
	return _.map(this.validDirections, function(item){
		
		var place =  item.place;
		var subPlaces = item.result.success.bollards;
		return _.map(subPlaces, function(subPlace){
			var bollard = subPlace.bollard;
			var directions = subPlace.directions;			
			directions = _.map(directions, function(direction){
				return [direction.direction, direction.lineName];
			});
			return [bollard.name, bollard.tag, bollard.symbol, directions];
		});
		
		return place;
	});
}

function saveAllDirections(directions){
	var deferred = q.defer();
	var hash = Utils.getHash(directions);
	var content = {
				hash: hash,
				directions: directions
	};	
	fs.writeFile(JSON_FILE, JSON.stringify(content), function(err) {
		    if(err) {
		        deferred.reject(err);
		    }
		    deferred.resolve(content);
	});	
	return deferred.promise;
}

var readDirections = function(){
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






function getDirectionsByPlaces(places){

var funcs = [
	// readPlaces,
	// function(fileObj){
	// 	var obj = {
	// 		'PLWI': 'Pl. Wielkopolski',
	// 		'PLCR': 'Pl. Cyryla Ratajskiego'
	// 	};		
	// 	//return obj;
	// 	return fileObj.places;
	// }, 
	fetchDirectionsByPlaces,
	filterInvalidDirections,
	appendOnDemandToInvalidPlaces,
	fetchDirectionsByPlaces,
	filterInvalidDirections,
	parse
];

var sm = new SequentialManager(funcs);
sm.validDirections = [];
return sm.run(places);
}



var api = {
	read: readDirections,
	write: saveAllDirections,
	fetchByPlaces: getDirectionsByPlaces

};


module.exports = api;