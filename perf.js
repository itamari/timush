var page = require('webpage').create(),
    system = require('system'),
    t, address;

	
page.onConsoleMessage = function(msg) {
	if(msg.indexOf("view ready") != -1){
		console.log(msg);
		//phantom.exit()
	}
}	
	
if (system.args.length === 1) {
    console.log('Usage: perf.js <some URL>');
    //phantom.exit(1);
} else {
    t = Date.now();
    address = system.args[1];
	//setInterval(function(){
		page.open(address, function (status) {
			if (status !== 'success') {
				console.log('FAIL to load the address');
			} else {
				//SUCCESS!
			}
			/*
			setTimeout(function(){
				console.log('FAIL to load the address-- TIMEOUT!');
				phantom.exit()
			}, 60000);
			*/
		});
	//}, 30000);
    
}