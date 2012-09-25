function initTesting() {
	document.addEventListener("deviceready", onDeviceTesting, true);  
}

function onDeviceTesting(){
	test(" Check if input is prepaid or postpaid subscriber",
			function() {
		    var value = isPrepaid('0905','5192192');
		  
	        equal( isPrepaid('0905','5192192'), true, "Expecting true. 09055192192 is prepaid number");
	        equal( isPrepaid('0917','5426510'), false, "Expecting false. 09175426510 is postpaid number");
	    	
			}
	
	
	
	);
	test("Check if this method detects mobile connectivity disconnected/connected",
			function(){
				equal(checkConnectivity2(),true,"Should return true..the device is connected to wifi/3g");
			}
	
	
	);
	asyncTest("Google Analytics Tracking Page",function(){
		var value = trackPageView("#home");
		setTimeout(function(){
			var value = trackPageView("#home");
	    equal(value,true,"Expecting to return for Successful " +
	    		"Tracking the current for Google Analytics purposes");
	    start();
		},5000);
	});
	
	
	test("alert dialog",function() {
		var val  = alertDismissed();
		equal(val,true,"OK test alert");
	});
}