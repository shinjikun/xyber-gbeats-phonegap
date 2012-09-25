var myScroll;
$(document).ready(function loaded() {
	myScroll = new iScroll('wrapper',{hScrollbar: false, onBeforeScrollStart:function(){this.refresh();}});
	
});


