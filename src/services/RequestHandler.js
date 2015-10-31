var q = require('q');
var request = require('request');

var RequestHandler = function(url){
	this.url = url;
	var headers= {
	'Accept':'*/*',
	'Accept-Language':'pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4',
	'Cache-Control':'no-cache',
	'Connection':'keep-alive',
	'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
	'DNT':'1',
	'Host':'www.peka.poznan.pl',
	'Origin':'http://peka.poznan.pl',
	'Pragma':'no-cache',
	'Referer':'http://www.peka.poznan.pl/vm/?przystanek=SRDW22',
	'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
	'X-Prototype-Version':'1.7',
	'X-Requested-With':'XMLHttpRequest'
	};

};
RequestHandler.prototype.get = function(){
	var deferred = q.defer();
	var that = this;
			request.post({
		headers: that.headers,
		url : that.url		
	}, function(e, r, b){
		if(e){
			deferred.reject(e);
			return;
		}
		deferred.resolve(b);
	
	});
	return deferred.promise;
};

RequestHandler.prototype.post = function(formData){
	var deferred = q.defer();
	var that = this;
			request.post({
		headers: that.headers,
		form: formData,
		url : that.url
	}, function(e, r, b){		
		if(e){
			deferred.reject(e);
			return;
		}
	var data = JSON.parse(b);
	if(!!data){
		deferred.resolve(data);
	}else{
	deferred.resolve(null)
	}
	});
	return deferred.promise;
};


module.exports = RequestHandler;