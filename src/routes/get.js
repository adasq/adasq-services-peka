
var routes = [];



routes.push({
	url: "/test",
	callback: (function(){
	return function(req, res){	 


res.send({x:'d'});

	};
	})()
});













module.exports = routes;