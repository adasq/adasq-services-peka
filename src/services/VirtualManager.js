var q = require('q');
var RequestHandler = require('./RequestHandler');

var VirtualManager = function(){
	var url = 'http://www.peka.poznan.pl/vm/method.vm?ts='+(+new Date());
	this.rh = new RequestHandler(url);
}

VirtualManager.prototype.getBollardsByLine = function(line){
	var form = {	
		method:"getBollardsByLine",
		p0: "{name: '"+line+"'}"
	};
	return this.rh.post(form);
};

VirtualManager.prototype.getTimesBySymbol = function(symbol){
	var form = {	
		method:"getTimes",
		p0: "{symbol: '"+symbol+"'}"
	};
	return this.rh.post(form);
};

VirtualManager.prototype.getBollardsByStopPoint = function(stopPointName){
	var form = {	
		method:"getBollardsByStopPoint",
		p0: "{name: '"+stopPointName+"'}"
	};
	return this.rh.post(form);
};

VirtualManager.prototype.getBollardsByStopPoint2 = function(symbol){
	symbol = '/.*/';
	var form = {	
		method:"getLines",
		p0: "{pattern: '"+symbol+"'}"
	};
	return this.rh.post(form);
};


module.exports = VirtualManager;