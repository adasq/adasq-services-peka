
var request = require('request');
var _ = require('underscore'); 
var cheerio = require('cheerio'); 
var q = require('q');



var headers= {
'Accept':'*/*',
'Accept-Language':'pl-PL,pl;q=0.8,en-US;q=0.6,en;q=0.4',
'Cache-Control':'no-cache',
'Connection':'keep-alive',
'Content-Type':'text/x-gwt-rpc; charset=UTF-8',
'DNT':'1',
'Host':'poznan.jakdojade.pl',
'Origin':'http://poznan.jakdojade.pl',
'Pragma':'no-cache',
'Referer':'http://poznan.jakdojade.pl/',
'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
'X-GWT-Module-Base':'http://poznan.jakdojade.pl/molbas/',
'X-GWT-Permutation':'8431701D3E3F23F810B221A7F06CAA0D'
};




var RequestHandler = function(){

};






RequestHandler.prototype.send= function(body){
	var deferred = q.defer();
request.post({
	headers: headers,
	body: body,
	url : 'http://poznan.jakdojade.pl/molbas/transit',
}, function(e, r, b){


if(e){
	deferred.reject(e);
}else{
	deferred.resolve(b);
}

});
return deferred.promise;
};



module.exports = RequestHandler;