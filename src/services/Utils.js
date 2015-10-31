var q = require('q');
var md5 = require('MD5');
var fs = require('fs');
var _ = require('underscore'); 

var Utils = {
	getHash: function(item){
		return md5(item);
	},
	decorateWithHash: function(obj, key){
		var result = {};
		result[key] = obj;
		result.hash = this.getHash(obj);
		return result;
	}
};

module.exports = Utils;