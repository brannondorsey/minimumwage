var hourlyIncome = 8.25;
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

replacePrices();
	setInterval(function(){
		if (document.hasFocus) {
			replacePrices();
		}
	}, refreshRate * 1000);

});

function replacePrices() {
	
	// replacePrices($("body"));
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
					var display = now.from(then, true);
					text = text.replace(match, display);
					
				}
			});

			$(this).text(text);
		}	
	});
}
