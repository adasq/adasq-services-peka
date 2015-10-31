var VM = {
    ver: 1.0
}

/**
 *
 */
VM.DateUtils = Class.create({
    initialize: function() {
        this.months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
    },
    formatDate: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber(date.getDate(), 2) + "-" + this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getFullYear(), 4);
            } catch (e) {

            }
        return result;
    },
    formatDateYYYYMMDD: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber(date.getFullYear(), 4) + "-" + this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getDate(), 2);
            } catch (e) {

            }
        return result;
    },
    formatFullDate: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber(date.getFullYear(), 4) + "-" + this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getDate(), 2) + "T" + this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2) + ":" + this.formatNumber(date.getSeconds(), 2) + "." + this.formatNumber(date.getMilliseconds(), 3) + "Z";
            } catch (e) {

            }
        return result;
    },
    formatDateTime: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber(date.getFullYear(), 4) + "-" + this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getDate(), 2) + " " + this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2) + ":" + this.formatNumber(date.getSeconds(), 2);
            } catch (e) {

            }
        return result;
    },
    formatDateTimeNoSec: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber(date.getFullYear(), 4) + "-" + this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getDate(), 2) + " " + this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2);
            } catch (e) {

            }
        return result;
    },
    /**
     *
     */
    formatDateMonthDayTimeNoSec: function(date) {
        var result = "";
            if (!date) {
                return result;
            }
            try {
                result = this.formatNumber((date.getMonth() + 1), 2) + "-" + this.formatNumber(date.getDate(), 2) + " " + this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2);
            } catch (e) {

            }
        return result;
    },
    formatTime: function(date) {
        var result = "";
            try {
                result = this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2);
            } catch (e) {

            }
        return result;
    },
    formatTimeSec: function(date) {
        return this.formatNumber(date.getHours(), 2) + ":" + this.formatNumber(date.getMinutes(), 2) + ":" + this.formatNumber(date.getSeconds(), 2);
    },  
    formatNumberToTime: function(num) {
        var hours = (num - (num % 60)) / 60;
        var minutes = num % 60;

        return this.formatNumber(hours, 2) + ":" + this.formatNumber(minutes, 2);
    },
    formatNumber: function(num, len) {
        var result = null;
        try {
            result = "" + parseInt(num);
            while (result.length < len) {
                result = "0" + result;
            }
        } catch (e) {

        }
        
        if (isNaN(parseInt(num))) {
            result = "";
        }
        
        return result;
    },
    parseNumber: function(number) {
    },
    parseDate: function(dateStr) {

        if (!dateStr) {
            return "";
        }

        var parser = new DateParser("yyyy-MM-ddTHH:mm:ss.SSSZ");
            result = parser.parse(dateStr);

        return result;
    },
    getMonthName: function(zeroBasedNo) {
        return this.months[zeroBasedNo];
    },
    rollDays: function(pDate, pDays) {
        var result = pDate;
            result.setDate(result.getDate() + pDays);
        return result;
    },
    rollHours: function(pDate, pHours) {
        var result = new Date();
            result.setTime(pDate.getTime() + (pHours * 60 * 60 *1000));
        return result;
    },
    dayDiff: function(startDate, endDate) {
        var result = 0;
            var sDate = new Date();
                sDate.setFullYear(startDate.getFullYear());
                sDate.setMonth(startDate.getMonth());
                sDate.setDate(startDate.getDate());
                sDate.setHours(0);
                sDate.setMinutes(0);
                sDate.setSeconds(0);
                sDate.setMilliseconds(0);
                
            var eDate = new Date();
                eDate.setFullYear(endDate.getFullYear());
                eDate.setMonth(endDate.getMonth());
                eDate.setDate(endDate.getDate());
                eDate.setHours(0);
                eDate.setMinutes(0);
                eDate.setSeconds(0);
                eDate.setMilliseconds(0);
                
            result = (eDate.getTime() - sDate.getTime()) / 1000 / 60 / 60 / 24;
     
        return result;
    },
    hoursDiff: function(startDate, endDate) {
        var result = 0;
            var sDate = new Date();
                sDate.setFullYear(startDate.getFullYear());
                sDate.setMonth(startDate.getMonth());
                sDate.setDate(startDate.getDate());
                sDate.setHours(startDate.getHours());
                sDate.setMinutes(0);
                sDate.setSeconds(0);
                sDate.setMilliseconds(0);
                
            var eDate = new Date();
                eDate.setFullYear(endDate.getFullYear());
                eDate.setMonth(endDate.getMonth());
                eDate.setDate(endDate.getDate());
                eDate.setHours(endDate.getHours());
                eDate.setMinutes(0);
                eDate.setSeconds(0);
                eDate.setMilliseconds(0);
                
            result = (eDate.getTime() - sDate.getTime()) / 1000 / 60 / 60;

        return result;
    },
    yearDiff18: function(birthDate, currDate) {
        
        var result = false;
        
            var currDate = new Date (currDate);
            var birthDate = new Date (birthDate);
            
            var currYear = new Date(currDate);
            var currMonth = new Date(currDate);
            var currDay = new Date(currDate);
            
            var birthYear = new Date(birthDate);
            var birthMonth = new Date(birthDate);
            var birthDay = new Date(birthDate);
            
            currYear = currYear.getFullYear();
            currMonth = currMonth.getMonth() + 1;
            currDay = currDay.getDate();
            
            birthYear = birthYear.getFullYear(birthDate);
            birthMonth = birthMonth.getMonth(birthDate) + 1;
            birthDay = birthDay.getDate(birthDate);
            
            if ( (currYear - birthYear > 18)   || ((currYear - birthYear >= 18) && (currMonth - birthMonth >= 0) && (currDay - birthDay >= 0))) {
                result = true;
            } else {
                result = false;
            }
        return result;
    },
    roundToDay: function(date) {
        if(date === undefined || date ==""){
            date = new Date();
        }
        var eDate = new Date();
            eDate.setFullYear(date.getFullYear());
            eDate.setMonth(date.getMonth());
            eDate.setDate(date.getDate());
            eDate.setHours(0);
            eDate.setMinutes(0);
            eDate.setSeconds(0);
            eDate.setMilliseconds(0);
            
        return eDate;
    },
    getNowMinutes: function() {
        var result = 0;
            var d = new Date();
            result = (d.getHours() * 60) + d.getMinutes();
        return result;
    }
});

VM.Progress = Class.create({
    /**
     * 
     */
    initialize: function(config) {
        this.config = Object.extend({

        }, config || {});
        
        this.topOffset = 0;
        this.render();
    },
    /**
     *
     */
    render: function() {
    	var handler = this;

    	handler.bg = new Element("DIV", {
    		style: "position:absolute; top:0px; left:0px; right:0px; bottom:0px; background-color:transparent; z-index:10000000"
    	});
    	window.document.body.insert(handler.bg);
    	
    	handler.img = new Element("IMG", {
    		src: "img/ajax-loader.gif",
    		style: "position:absolute; top:50%; left:50%; margin-left:-100px;"
    	});
    	
    	handler.bg.insert(handler.img);
    },
    close: function() {
    	this.bg.remove();
    }
});

VM.Scrollbox = Class.create({
	
	initialize: function(config) {
		this.config = Object.extend({}, config || {});
        this.offset = 0;
        this.render();
	}, 
	
	render: function() {
		var handler = this;
		this.contentDiv = new Element("DIV",{
			style: handler.config.style
		});
		
		this.config.parentHTML.insert(this.contentDiv);
		
		this.msgDiv = new Element("DIV",{
			style: "width:10000px"
		});
		this.contentDiv.insert(this.msgDiv);
		this.offset = this.contentDiv.getWidth();
		
		this.renderMessages();
	},
	
	renderMessages: function() {
		var handler = this;
		this.msgDivWidth = 0;
		if(this.messages !== undefined) {
			var msgCount = this.messages.length;
			for(var i=0; i < msgCount; i++) {
				if(this.isMsgValid(handler.messages[i])) {
					var msg = new Element("P", 
					{
						style: "white-space: nowrap;" + this.config.textStyle 
					});
					handler.msgDiv.insert(msg);
					msg.update(handler.messages[i].content);
					handler.msgDivWidth += (msg.getWidth() + 1);
				}
			}	
		
			this.msgDiv.setStyle({
				width: (this.msgDivWidth) + 'px',
				marginLeft: this.offset + 'px'
			});
		
			this.animate();
		}
	},
	
	animate: function() {
		var handler = this;
	
		handler.animation = setInterval(function () {
			handler.offset -= 1;
			handler.msgDiv.setStyle({
				marginLeft: handler.offset + 'px'
			});
			
			if (handler.offset < (0 - handler.msgDivWidth)) {
				window.clearInterval(handler.animation);
				handler.offset = handler.contentDiv.getWidth();
				handler.msgDiv.descendants().each(function(elem) {
					Element.remove(elem);
		        });
				handler.renderMessages();
			};

		}, 25);
	},
	
	isMsgValid:function(msg) {
		var currentDate = new Date();
		var endDate = new Date(msg.endDate);
		var endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate(),  endDate.getUTCHours(), endDate.getUTCMinutes(), endDate.getUTCSeconds());
		var startDate = new Date(msg.startDate);
		var startDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(),  startDate.getUTCHours(), startDate.getUTCMinutes(), startDate.getUTCSeconds());
		
		if ((currentDate.getTime() < startDate.getTime()) || (currentDate.getTime() > endDate.getTime()) ) {
			return false;
		} else {
			return true 
		}
	},

	setMessages: function(messages) {
		var handler = this;
		this.messages = messages;
		
		if(handler.animation !== undefined) {
			window.clearInterval(handler.animation);
			handler.offset = handler.contentDiv.getWidth();
			handler.msgDiv.descendants().each(function(elem) {
				Element.remove(elem);
	        });
		}
		
		this.renderMessages();
	}
});

VM.Coordinator = Class.create({
    /**
     * 
     */
    initialize: function(config) {
        this.config = Object.extend({
            
        }, config || {});
        
        this.du = new VM.DateUtils();
        
        this.render();
    },
    hideEverything: function() {
        this.bollards.hide();
        this.streets.hide();
        this.lines.hide();
    },
    render: function() {
        var handler = this;

        window.document.body.observe("mouseup", function() {
            handler.hideEverything();
        });

        this.bollards = new VM.VMList({
            title: "Przystanki",
            parentHTML: handler.config.search,
            top: 20,
            zIndex: 1000,
            placeholder: "wpisz nazwę lub numer przystanku",
            render: function(bean) {
                var result = "";
                    result = bean.name;
                return result;
            },
            find: function(pattern) {
                var dao = new VM.DAO({
                    onSuccess: function(bollards) {
                        handler.bollards.fetchData(bollards);
                    }
                });
                dao.getStopPoints({
                    pattern: pattern
                });
            },
            subFind: function(bean) {
                var dao = new VM.DAO({
                    onSuccess: function(model) {
                        handler.bollards.fetchSubDataAsString(model);
                    }
                });
                dao.getBollardsByStopPoint({
                    name: bean.name
                });
            },
            onAllSelect: function(bean) {
            	handler.topOffset = 0;
            	handler.loadTimesForAllBollards(bean);
            },
            onSelect: function(bean) {
            	handler.topOffset = 0;
                handler.loadTimes(bean.tag);
                
                var messageDao = new VM.DAO({
                	onSuccess: function(model) {
                		handler.messages.setMessages(model);
	                }
                });
                messageDao.findMessagesForBollard({
                	symbol: bean.tag
                });
            }
        });

        this.streets = new VM.VMList({
            title: "Ulice",
            parentHTML: handler.config.search,
            top: 55,
            zIndex: 2000,
            placeholder: "wpisz ulicę lub miejscowość",
            render: function(bean) {
                var result = "";
                    result = "" + bean.name;
                return result;
            },
            find: function(pattern) {
                var dao = new VM.DAO({
                    onSuccess: function(bollards) {
                        handler.streets.fetchData(bollards);
                    }
                });
                dao.getStreets({
                    pattern: pattern
                });
            },
            subFind: function(bean) {
                var dao = new VM.DAO({
                    onSuccess: function(model) {
                        handler.streets.fetchSubDataAsString(model);
                    }
                });
                dao.getBollardsByStreet({
                    name: bean.name
                });
            },
            onSelect: function(bean) {
            	handler.topOffset = 0;
                handler.loadTimes(bean.tag);
                
                var messageDao = new VM.DAO({
                	onSuccess: function(model) {
                		handler.messages.setMessages(model);
	                }
                });
                
                messageDao.findMessagesForBollard({
                    loid: bean.tag
                });
            }
        });

        this.lines = new VM.VMList({
            title: "Linie",
            parentHTML: handler.config.search,
            placeholder: "wpisz numer linii",
            top: 90,
            zIndex: 3000,
            orientation: "horizontal",
            render: function(bean) {
                var result = "";
                    result = "" + bean.name;
                return result;
            },
            find: function(pattern) {
                var dao = new VM.DAO({
                    onSuccess: function(bollards) {
                        handler.lines.fetchData(bollards);
                    }
                });
                dao.getLines({
                    pattern: pattern
                });
            },
            subFind: function(bean) {
                var dao = new VM.DAO({
                    onSuccess: function(model) {
                        handler.lines.fetchSubData(model);
                    }
                });
                dao.getBollardsByLine({
                    name: bean.name
                });
            },
            onSelect: function(bean) {
            	handler.topOffset = 0;
                handler.loadTimes(bean.tag);
                
                var messageDao = new VM.DAO({
                	onSuccess: function(model) {
                		handler.messages.setMessages(model);
	                }
                });
                
                messageDao.findMessagesForBollard({
                	symbol: bean.tag
                });
            }
        });
        
        var refreshFun = function() {
        	
        	handler.topOffset = handler.config.times.scrollTop;
        	
        	if (handler.selectedStopPoint !== undefined)  {
        		handler.loadTimesForAllBollards(handler.selectedStopPoint);
        	} else if (handler.selectedSymbol !== undefined) {
                handler.loadTimes(handler.selectedSymbol);
            }        	
        }

        handler.intervalRefresh = setInterval(refreshFun, 20000);
        
        this.messages = new VM.Scrollbox({
        	parentHTML: handler.config.messages,
        	style: "width: 100%; height: 35px; overflow:hidden;",
        	textStyle: "diplay:block; float:left; margin:5px 0 0 0; padding-left:20px; text-transform:uppercase; color:red; font-weight:bold; font-size:1.2em;"
        }) ;
    },
    /**
     * 
     */
    loadTimes: function(symbol) {
        var handler = this;
        
        if(handler.selectedStopPoint !== undefined) {
        	  delete handler.selectedStopPoint;
        }
        
        handler.selectedSymbol = symbol;
        
        handler.config.times.update("");
        
        this.renderHeader();

        var dao = new VM.DAO({
            onSuccess: function(model) {
                handler.config.title.update(model.bollard.name);
                
                var symbol = new Element("P",{
                	class: "bollardSymbol"
                }).update(model.bollard.symbol);
                handler.config.title.insert(symbol);

                for (var i=0; i<model.times.length; i++) {
                    handler.addRow(i, model.times[i]);
                }
                
                if(handler.link === undefined) {
	                handler.link = new Element("A", {
	                	href: "",    
	                	class: "bollardLink",
	                }).update("Bezposredni link do przystanku");
	            } else {
	            	handler.link.update("Bezposredni link do przystanku");
	            }	            	                
                
	            handler.link.stopObserving('click');
                handler.link.observe("click", function(event) {
                	 Event.stop(event);
                	 handler.copyToClipboard(location.host + location.pathname + "?przystanek=" + model.bollard.symbol);
                	 
                });
                
                handler.config.search.insert(handler.link);
                
                handler.config.times.scrollTop = handler.topOffset;
            }
        });
        dao.getTimes({
            symbol: handler.selectedSymbol
        });
    },
    /**
     * 
     */
    loadTimesForAllBollards: function(stopPoint) {
        var handler = this;
        
        if(handler.selectedSymbol !== undefined) {
        	  delete handler.selectedSymbol;
        }
        
        handler.selectedStopPoint = stopPoint;
        
        handler.config.times.update("");
        handler.config.title.update("");
        if(handler.link !== undefined) {
        	handler.link.update("");
        }

        var dao = new VM.DAO({
		onSuccess: function(model) {
        	var bollards = model.bollardsWithTimes;
        	handler.config.title.update(bollards[0].bollard.name);
	    		for(var i=0; i<bollards.length; i++) {
	    			handler.renderAllBollardsHeader(bollards[i].bollard) 
	    			for(var j=0; j<bollards[i].times.length; j++) {
	    				handler.addRow(j,bollards[i].times[j]);
	    			}	
	    		}
	    		handler.config.times.scrollTop = handler.topOffset;
        	}
		});
        
        dao.getTimesForAllBollards({
        	 name: stopPoint.name
        });
    },
    /**
     *     	
     */
    renderAllBollardsHeader: function (bollard) {
        var handler = this;
        
        	var row = new Element("DIV", {
                class: "listRowAllBollardsHead"
            });
        	
            row.update("<text style='color:black'>Nazwa: </text>" + bollard.name + "<br /><text style='color:black'>Symbol: </text>" + bollard.tag);
            handler.config.times.insert(row);

            var html = new Element("DIV", {
                class: "timesHeader",
                style: "margin-top:0"
            });
            var lineHTML = new Element("DIV", {
                class: "line"
            });
            lineHTML.update("Linia");
            html.insert(lineHTML);
        
            var timeHTML = new Element("DIV", {
                class: "time"
            });
            timeHTML.update("Odjazd");
            html.insert(timeHTML);

            var directionHTML = new Element("DIV", {
                class: "direction"
            });
            directionHTML.update("Kierunek");
            html.insert(directionHTML);            

        
        handler.config.times.insert(html);
    },
    /**
     * 
     */
    renderHeader: function () {
        var handler = this;

            var html = new Element("DIV", {
                class: "timesHeader"
            });
            var lineHTML = new Element("DIV", {
                class: "line"
            });
            lineHTML.update("Linia");
            html.insert(lineHTML);
        
            var timeHTML = new Element("DIV", {
                class: "time"
            });
            timeHTML.update("Odjazd");
            html.insert(timeHTML);

            var directionHTML = new Element("DIV", {
                class: "direction"
            });
            directionHTML.update("Kierunek");
            html.insert(directionHTML);            
        
        handler.config.times.insert(html);
    },
    /**
     * 
     */
    addRow: function(index, time) {
        var handler = this;
        	var html = new Element("DIV", {
            	class: "row"
        	});
            var lineHTML = new Element("DIV", {
                class: "line"
            });
            lineHTML.update(time.line);
            html.insert(lineHTML);
        
            var timeHTML = new Element("DIV", {
                class: "time"
            });
            
            if (time.realTime === undefined || time.realTime === false) {
            	timeHTML.update(handler.du.formatTime(handler.du.parseDate(time.departure)));
            } else {
            	timeHTML.update(time.minutes + " min. ");
            }
            
            html.insert(timeHTML);
            
            if (time.realTime === true && time.minutes == 0) {
        		timeHTML.addClassName("blink");
        	}
            
            var directionHTML = new Element("DIV", {
                class: "direction"
            });
            directionHTML.update(time.direction);
            html.insert(directionHTML);


        handler.config.times.insert(html);
    },
    
    copyToClipboard: function(text) {
		  var response = prompt("Naciśnij Ctrl+C aby skopiować link.", text);
	}
     
    
});


module.exports = VM;