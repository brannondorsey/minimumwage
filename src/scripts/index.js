var hourlyIncome;
var defaultHourlyIncome = 7.25;
var priceRegex = /\$[\d]+[\.]*[\d,]*/ig;
var refreshRate = 2; // in seconds
var priceContainers = [
	".price",
	"span",
	"b", 
	"strong", 
	"strike"
];

$(document).ready(function(){


    $.ajax({
        url: chrome.extension.getURL("data/wages.json"),
        success: function(data){
        	var states = JSON.parse(data);
        	
        	$.ajax({
				url: "http://www.telize.com/ip",
				success: function(data) {

					$.getJSON("https://freegeoip.net/json/" + data.trim(), function(data){
			
						hourlyIncome = states[data.region_code] || defaultHourlyIncome;

						replacePrices();
						setInterval(function(){
							if (document.hasFocus) {
								replacePrices();
							}
						}, refreshRate * 1000);
					});
				}
			});
        }
    });
});

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


