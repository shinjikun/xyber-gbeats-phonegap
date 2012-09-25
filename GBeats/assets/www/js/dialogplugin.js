var DialogPlugin = function(){
	
}


/**
 * Close the dialog
 */
DialogPlugin.prototype.hideDialog = function() {
	 cordova.exec(null,
			null,
			"DialogPlugin",
			"hideDialog",[]);
    
};


/**
 * Show the dialog
 */
DialogPlugin.prototype.progressTest = function() {
	cordova.exec(null,
			null,
			"DialogPlugin",
			"progressTest",[]);
};


//PhoneGap.addConstructor(function() {
//	PhoneGap.addPlugin('dialogplugin', new DialogPlugin());
//});

if(!window.plugins) {
    window.plugins = {};
}
if (!window.plugins.dialogplugin) {
    window.plugins.dialogplugin = new DialogPlugin();
}