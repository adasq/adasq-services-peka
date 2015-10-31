
var q = require('q');
var _ = require('underscore');
var RequestHandler = require('./RequestHandler.js');
var MPKManager = require('./MPKManager.js');
var cheerio = require('cheerio'); 

var MPK_STOP_PATTERN =  /[A-Z]{4}-[\d]{2}/;



var JDManager = function(){
	this.rh = new RequestHandler();
};



JDManager.prototype.getLineStops = function(id){

var deferred = q.defer();


	
var body = "7|0|8|http://poznan.jakdojade.pl/molbas/|989369F57BFA0AF5BBF5BDFAE1514725|com.molbas.gwt.client.services.TransitServices|getLineStops|J|java.lang.String/2004016611|"+id+"|12.12.14 19:28|1|2|3|4|5|5|5|6|6|6|Po|B|7|0|8|";
var result = "";
this.rh.send(body).then(function(b){
 
	result = b.substr(4);
	result = result
	.replace(/'/g, '"');

	result = JSON.parse(result);
	arr = result[result.length-3];	
	console.log(arr)
	var stopsArray = _.filter(arr, function(item){
		return MPK_STOP_PATTERN.test(item);
	});
	var normalizednameArray = _.map(stopsArray, function(stop){	

		return (MPKManager.getNameByShortName(stop));
	}); 

	var resultArray = _.map(stopsArray, function(stopArray, i){
		return {
			id: stopArray,
			name: normalizednameArray[i]
		};
	});

	deferred.resolve(resultArray);
});
return deferred.promise;
};







// var body = "asdas dsadasd<!-- markersDef=new Array();markersDef['O']='<b>O</b> - kurs wydłużony do Janikowo Ogrodnicza'; --> asd dsfsdf"


 
// var patt = /<!--(.)+-->/;
// var res = patt.exec(body);

// console.log(res)










JDManager.prototype.getTimeTable = function(lid, sid){
var deferred = q.defer();
var body = "7|0|10|http://poznan.jakdojade.pl/molbas/|8955B525EE3F252C38173FCFA99359DA|com.molbas.gwt.client.services.TransitServices|getHtmlTimeTable|J|java.lang.String/2004016611|Z|"+lid+"|"+sid+"|12.12.14 19:28|1|2|3|4|6|5|5|6|6|6|7|Po|B|8|9|10|0|";

var result = "";
this.rh.send(body).then(function(b){
 	result = b
	.replace(/\\x3C/g, '<')
	.replace(/\\x3D/g, '=')
	.replace(/\\x27/g, "'")
	.replace(/\\x3E/g, '>');
	result = result.substr(9, result.length - 16);
	

	

var $ = cheerio.load(result, {normalizeWhitespace: true});
			var timeTableElem = $('.timeTable tr');
			var from = $('.message-header i').text().trim();
			var text = $('.body').text().trim(); 


var timeTable = [];
_.each(timeTableElem, function(row, i){
	if(i === 0)return;
	var $ = cheerio.load(timeTableElem.eq(i).html());	

	var hourElems = $('td.h');
	var minuteElems = $('div.ms');
	var row = {
		week: {
			hour: 0,
			min: []
		},
		saturday: {
			hour: 0,
			min: []
		},
		sunday: {
			hour: 0,
			min: []
		}
	}
	_.each(hourElems, function(elem, i){
		var text = $(elem).text();
		if(i === 0){
			row.week.hour = text;
		}else if(i === 1){
			row.saturday.hour = text;
		}else if(i === 2){
			row.sunday.hour = text;
		}else{

		}
	});
	

		_.each(minuteElems, function(elem, i){
			var x = minuteElems.eq(i).html();		
			var $ = cheerio.load(x);
			var minutes = $('.m');
			var currentHour = i;	
			var minutesList = [];		
			//console.log($(minutes).html())
			_.each(minutes, function(minute){
				if(minute.attribs.onmouseout){
					minutesList.push({
						min: minute.children[0].data,
						tooltio: true
					});
					
				}else{
					minutesList.push($(minute).text());
				}	
				
			});
			
			if(i === 0){
				row.week.min = minutesList;
			}else if(i === 1){
				row.saturday.min = minutesList;
			}else if(i === 2){
				row.sunday.min = minutesList;
			}else{

			}
	});
		timeTable.push(row) 
});


	 var week = _.pluck(timeTable, 'week');
	 var saturday = _.pluck(timeTable, 'saturday');
	 var sunday = _.pluck(timeTable, 'sunday');
	 deferred.resolve({
	 	week: week,
	 	saturday: saturday,
	 	sunday: sunday
	 });

 });
return deferred.promise;
};








module.exports = JDManager;