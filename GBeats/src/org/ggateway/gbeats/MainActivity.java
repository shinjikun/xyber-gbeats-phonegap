package org.ggateway.gbeats;

import org.apache.cordova.DroidGap;


import android.os.Bundle;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;



public class MainActivity extends DroidGap {

    @Override
    public void onCreate(Bundle savedInstanceState) {
    	CookieSyncManager.createInstance(this);
    	CookieSyncManager.getInstance().startSync();
        CookieManager.getInstance().setAcceptCookie(true);
      
        
       super.onCreate(savedInstanceState);
     
       super.setIntegerProperty("splashscreen", R.drawable.splashscreen);
        super.loadUrl("file:///android_asset/www/index.html",5000);
      
      
        
    }

  
    
}
