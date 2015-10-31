var q = require('q');
var _ = require('underscore'); 

function SequentialManager(fns){
	var that = this;
	this.functions = _.map(fns, function(fn){
		return _.bind(fn, that);
	});	
}

SequentialManager.prototype.run = function(initialArg){
	var result = q(initialArg);
	this.functions.forEach(function (f) {
	    result = result.then(f);
	});
	return result;
};


module.exports = SequentialManager;