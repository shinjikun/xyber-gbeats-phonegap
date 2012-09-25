package com.phonegap.plugins.dialog;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.apache.cordova.api.PluginResult.Status;
import org.json.JSONArray;


import android.app.ProgressDialog;

import android.os.Handler;
import android.os.Message;
import android.util.Log;



public class DialogPlugin  extends Plugin{

	ProgressDialog dialog;
	int ACTION_TYPE_INT;
	
	
	
	@Override
	public PluginResult execute(String action, JSONArray data, String callbackID) {
		Log.i("Test",action);
		PluginResult result = null;
		if(action.equals("progressTest")){
			ACTION_TYPE_INT = 1;
		}
		else if (action.equals("hideDialog")){
			ACTION_TYPE_INT = 2;
		}
		else {
			result = new PluginResult(Status.INVALID_ACTION);
			return result;
		}

		try {
				Thread thread = new Thread() {
					@Override
					public void run() {

						Message msg = Message.obtain();
						msg.what = ACTION_TYPE_INT;
						  
						   handler.sendMessage(msg);
					}
				};
				thread.start();
				
				
					
			}catch(Exception e){
				e.printStackTrace();
				Log.i("Test",e.getMessage());
			}
			
	   result = new PluginResult(Status.OK);
		
		return result;
	}

	
	Handler handler = new Handler(){
		@Override
		public void handleMessage(Message msg) {
		  try {
			  switch(msg.what){
				case 1:
					dialog = ProgressDialog.show(ctx.getContext(), "", "Loading",true,true);
					break;
				case 2:
					
					if(dialog!=null)
				    dialog.dismiss();
			
					break;
				}

  
		  }catch(Exception e){
			  e.printStackTrace();
		  }
			
			
			



		}
	};
	
}
