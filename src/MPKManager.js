
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

 
var MPKManager = {
data: JSON.parse(fs.readFileSync(path.join(__dirname,'/mpk.json'), 'utf8')),
getNameByShortName: function(shortName){
	shortName = shortName.replace('-', '');
	var found = _.find(this.data.features, function(stop){
		return stop.id === shortName;
	});
	found = found && found.properties.a3;
	return found;
}
};


module.exports = MPKManager;


// var url = 'http://www.poznan.pl/featureserver/featureserver.cgi/mpk_przystanki_wgs/';
// request(url, function(e,r,b){
// 	var stops = JSON.parse(b);
// 	var found = _.find(stops.features, function(stop){
// 		return stop.id === "WOLO23";
// 	});
// 	console.log(found)
// });
