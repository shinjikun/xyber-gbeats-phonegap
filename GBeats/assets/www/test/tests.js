var TestSuit = function($,proceed){
	return {
		gbeats: function() {
		//	module("gbeats testing module");
			test("test",function(){
				alert("test");
				testNodes([
					{
					
					 node:"head",
					 assert:"exists",
					 msg:"Body exists"
					}
				]);
			   });
			proceed();
                }
         }




};
