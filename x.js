var items2 = [], items = document.getElementsByClassName('route');
for(var i=0;i<items.length;++i){
console.log(items[i].innerHTML)
}





var lines = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","20","201","L","45","46","47","48","49","50","51","52","54","55","56","57","58","59","60","61","62","63","64","65","66","67","68","69","71","73","74","75","76","77","78","79","80","81","82","83","84","85","87","89","90","91","92","93","94","95","96","97","98","231","232","233","234","235","236","237","238","239","240","242","243","244","245","246","247","248","249","251","252","312","320","321","322","323","341","342","348","396","397","398","511","512","527","601","602","603","610","611","614","616","651","701","702","703","710","716","718","719","830","832","833","891","893","901","902","903","904","905","907","911"];

var newLines = _.groupBy(lines, function(line){ 
  if(_.isNaN(+line)){
    return 'S';
  }
  line = +line;
  if(line < 10){
    return 0;
  }else if (line < 100){
    return parseInt(line/10);
  }else{
    return parseInt(line/10);
  }
});


var x = _.toArray(newLines);
var keys = _.map(newLines, function(val, key){
  return key;
});
keys = _.unique(keys);
console.log(keys);
_.each(keys, function(key){
  console.log(newLines[key]);  
});




var _retriveAllBollards = function(){
	var deferred = q.defer();
	var lines =_.range(1,10);
	var promises = _.map(lines, function(lineNo){	
		return getNormalizedBollardsByLine(lineNo);
	});

	q.all(promises).then(function(result){
		var bollards = _.union.apply(null, result);
		var all = {};
		_.each(bollards, function(bollard){
			var shortSymbol = bollard.symbol.substr(0, bollard.symbol.length-2);
			if(all[shortSymbol]){
				return;
				if(!_.contains(all[shortSymbol].symbols, bollard.symbol)){
					all[shortSymbol].symbols.push(bollard.symbol);
				}				
			}else{
				all[shortSymbol] = {
					shortSymbol: shortSymbol,
					name: bollard.name.substr(bollard.name, bollard.name.length-5),
					//symbols: [bollard.symbol]
				}
			}			
		});
		all = _.map(all, function(value, key){
			return {
				n: value.name,
				s: key,
				//symbols: value.symbols
			}
		}); 
		deferred.resolve(all);
	});
	return deferred.promise;
};





var retriveAllBollards = function(){
_retriveAllBollards().then(function(bollards){
	var bollardsString = (bollards);
	var bollardsStringHash = md5(bollardsString);
	console.log(bollardsStringHash);

	var fileContent = JSON.stringify({
		hash: bollardsStringHash,
		data: bollards
	});

	fs.writeFile("bollards.json", fileContent, function(err) {
		    if(err) {
		        return console.log(err);
		    }
		    console.log("The file was saved!");
	});
});
};

var readAllBollards = function(){
	var deferred = q.defer();
	fs.readFile("bollards.json", "UTF-8", function(err, content){
		deferred.resolve(JSON.parse(content));
	});
	return deferred.promise;
};



//retriveAllBollards();

return;
readAllBollards().then(function(result){
	var bollards = result.data;
	console.log(bollards.length);
	//bollards = bollards.splice(0,50);	
	var promises = _.map(bollards, function(bollard){
		return vm.getBollardsByStopPoint(bollard.n);
	});
	var directions = [];
	var additional = [];
	q.all(promises).then(function(results){
		_.each(results, function(result, i){
			if(result.success.bollards){
				directions.push( {
					s: bollards[i].s,
					d: _.map(result.success.bollards, function(item){
						return {
						n: item.bollard.name,
						s: item.bollard.symbol,
						d: _.map(item.directions, function(direction){
							return [direction.lineName, direction.direction];
						})
					};
					})
				} );
			}else{
				additional.push(bollards[i]);
			}
		});
		var promises = _.map(additional, function(bollard){
			return vm.getBollardsByStopPoint(bollard.n+' n/ż');
		});
		q.all(promises).then(function(results){
			
			_.each(results, function(result, i){			
				if(result.success.bollards){

					directions.push( {
					s: bollards[i].s,
					d: _.map(result.success.bollards, function(item){
						return {
						n: item.bollard.name,
						s: item.bollard.symbol,
						d: _.map(item.directions, function(direction){
							return [direction.lineName, direction.direction];
						})
					};
					})
				} );
				}else{
					console.log(additional[i])
				}
			});
			directions = _.map(directions, function(direction){
				return direction;
				// return {

				// };
			})
			fs.writeFile("directions.json", JSON.stringify(directions), function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The file was saved!");
			});
		});
	});
});


//===================================================================



var jdm = new JDManager();



// jdm.getLineStops("73_0").then(function(lineStops){
// 	console.log(lineStops);
// });

// jdm.getTimeTable("73_1", "BOGU-22").then(function(timeTable){
// 	console.log(JSON.stringify(timeTable));
// });

return;
var timetable = {"week":[{"hour":"4","min":[{"min":"28","tooltio":true},"59"]},{"hour":"5","min":["20",{"min":"44","tooltio":true}]},{"hour":"6","min":["20",{"min":"46","tooltio":true}]},{"hour":"7","min":["18","46"]},{"hour":"8","min":["20","47"]},{"hour"
:"9","min":["17","57"]},{"hour":"10","min":[{"min":"20","tooltio":true},"57"]},{"hour":"11","min":["27"]},{"hour":"12","min":["07","38"]},{"hour":"13","min":[{"min":"06","tooltio":true},"46"]},{"hour":"14","min":["07","34"]},{"hour":"15","min":[{"min":"07","tooltio":true},"34"]},{"hour":"16","min":["07",{"min":"34","tooltio":true}]},{"hour":"17","min":["07","34"]},{"hour":"18","min":[{"min":"01","tooltio":true},"39"]},{"hour":"19","min":["09",{"min":"39","tooltio":true}]},{"hour":"20","min":["08","37"]},{"hour":"21","min":["07",{"min":"47","tooltio":true}]},{"hour":"22","min":["17","47"]},{"hour":"23","min":["27"]}],"saturday":[{"hour":"4","min":[{"min":"35","tooltio":true}]},{"hour":"5","min":["23"]},{"hour":"6","min":[{"min":"10","tooltio":true}]},{"hour":"7","min":["10"]},{"hour":"8","min":["06","51"]},{"hour":"9","min":[{"min":"13","tooltio":true},"51"]},{"hour":"10","min":["21","51"]},{"hour":"11","min":[{"min":"21","tooltio":true},"51"]},{"hour":"12","min":["23","52"]},{"hour":"13","min":["23","53"]},{"hour":"14","min":["23",{"min":"53","tooltio":true}]},{"hour":"15","min":["23","53"]},{"hour":"16","min":[{"min":"23","tooltio":true},"53"]},{"hour":"17","min":["16","49"]},{"hour":"18","min":[{"min":"36","tooltio":true}]},{"hour":"19","min":["41"]},{"hour":"20","min":["24"]},{"hour":"21","min":["14"]},{"hour":"22","min":["04",{"min":"54","tooltio":true}]},{"hour":"23","min":["20"]}],"sunday":[{"hour":"4","min":[]},{"hour":"5","min":["23"]},{"hour":"6","min":[{"min":"10","tooltio":true}]},{"hour":"7","min":["10"]},{"hour":"8","min":["06","51"]},{"hour":"9","min":[{"min":"13","tooltio":true},"51"]},{"hour":"10","min":["21","51"]},{"hour":"11","min":[{"min":"21","tooltio":true},"51"]},{"hour":"12","min":["23","52"]},{"hour":"13","min":["23","53"]},{"hour":"14","min":["23",{"min":"53","tooltio":true}]},{"hour":"15","min":["23","53"]},{"hour":"16","min":[{"min":"23","tooltio":true},"53"]},{"hour":"17","min":["16","49"]},{"hour":"18","min":[{"min":"36","tooltio":true}]},{"hour":"19","min":["41"]},{"hour":"20","min":["24"]},{"hour":"21","min":["14"]},{"hour":"22","min":["04",{"min":"54","tooltio":true}]},{"hour":"23","min":["20"]}]}
 
  var TimeTable = function(){
this.data = timetable;
  };

  TimeTable.prototype.getNextRoute = function(date){

var timeTableCol= 'week', currentDay = date.getDay();

if(currentDay === 6){
	timeTableCol = 'saturday';
}else if(currentDay === 0){
	timeTableCol = 'sunday';
}

console.log(timeTableCol)	
var properlyDayTable = this.data[timeTableCol];

console.log(properlyDayTable)

var parsed = [];
_.each(properlyDayTable, function(row){
	var hour = row.hour;
	_.each(row.min, function(min){
		var minute = _.isObject(min)?min.min:min;

		var tempDate = new Date(date);
		tempDate.setHours(hour);
		tempDate.setMinutes(minute);
		tempDate.setSeconds(0);
		//hour+":"+minute
		parsed.push(tempDate);

	});
})


console.log(parsed);
console.log('============');
var dateIndex;
var nextRoute = _.find(parsed, function(tableDate, i){
	dateIndex = -1;
	if(date < tableDate){
		dateIndex = i;
		return true;
	}
	
});

var diff = Math.ceil((nextRoute - date)/1000/60);
console.log(diff)
console.log('next: ',nextRoute);
console.log('previous: ',parsed[dateIndex-1]);



  };



  var table = new TimeTable();


  table.getNextRoute(new Date());


  //handle lines
// q.all([Lines.read(), Lines.fetch()]).then(function(result){
// 	var fileContent = result[0];
// 	var serverLines = result[1];
// 	var fileHash = fileContent.hash;
// 	var serverhash = Utils.getHash(serverLines);
// 	console.log('fileContent: ', fileHash);
// 	console.log('serverLines: ', serverhash);
// 	if(fileHash !== serverhash){
// 		Lines.write(serverLines).then(function(){
// 			console.log('zapisano');
// 		});
// 	}
// });

 
// Lines.read().then(function(fc){
// 	var lines = fc.lines;
// 	var places = Places.generateByLines(lines);
// 	console.log(Utils.getHash(places));
// 	// Places.write(places).then(function(){
// 	// 	console.log('saved');
// 	// });
// });

// Places.read().then(function(fc){
// 	var palces = fc.places;
// 	Directions.fetchByPlaces(['Rondo Śródka']).then(function(directions){
// 		console.log(Utils.getHash(directions));
// 		Directions.write(directions).then(function(){
// 			console.log('zapisano');
// 		});
// 	});
// });

// Directions.read().then(function(fc){
// 	_.each(fc.directions[0], function(direction){
// 		console.log(JSON.stringify(direction));
// 	})
// })