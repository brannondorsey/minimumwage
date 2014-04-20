var hourlyIncome;
var priceRegex = /\$[\d]+[\.]*[\d,]*/ig;
var refreshRate = 2; // in seconds
var priceContainers = [
	".price",
	".listprice",
	"span",
	"td",
	"del",
	"b", 
	"strong", 
	"strike"
];

$(document).ready(function(){
	console.log("has access");
	getHourlyIncome(function(_hourlyIncome){
		hourlyIncome = _hourlyIncome;
		replacePrices();
		setInterval(function(){
			if (document.hasFocus) {
				replacePrices();
			}
		}, refreshRate * 1000);
	});

});

function getHourlyIncome(callback) {
	
	var hourlyIncome = 7.25; // default
	
	if (localStorage) {
		var storedHourlyIncome = localStorage.getItem("stateMinimumWage");
		if (storedHourlyIncome) {
			callback(storedHourlyIncome);
		} else {
			console.log("localStorage not found making requests");
			$.ajax({
		        url: chrome.extension.getURL("data/wages.json"),
		        success: function(data){
		        	var states = JSON.parse(data);
		        	
		        	$.ajax({
						url: "http://www.telize.com/ip",
						success: function(data) {

							$.getJSON("https://freegeoip.net/json/" + data.trim(), function(data){
					
								if (states[data.region_code]) hourlyIncome = states[data.region_code];
								localStorage.setItem("stateMinimumWage", hourlyIncome);
								callback(hourlyIncome);
							});
						}
					});
		        }
		    });
		}
	} else callback(hourlyIncome);

	
}


function replacePrices() {
	
	$(priceContainers.join(',')).each(function(){
		
		var text = $(this).text();
		var matches = text.match(priceRegex);
		
		if (matches &&
			text.indexOf('function') == -1) {
			matches.forEach(function(match){
				if (match != "$.") {
					var hours = parseFloat(match.substring(1)) / hourlyIncome;
					var now = moment();
					var then = moment().add('hour', hours);
					var display = capitalize(now.from(then, true));
					text = text.replace(match, display);
					
				}
			});

			$(this).text(text);
		}	
	});
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}
