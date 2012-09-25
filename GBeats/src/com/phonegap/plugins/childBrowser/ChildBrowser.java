/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2005-2011, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */
package com.phonegap.plugins.childBrowser;


import java.io.InputStream;
import java.util.List;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.ggateway.gbeats.R;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Typeface;
import android.net.Uri;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.WindowManager.LayoutParams;
import android.view.inputmethod.InputMethodManager;

import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

public class ChildBrowser extends Plugin {

    protected static final String LOG_TAG = "ChildBrowser";
    private static int CLOSE_EVENT = 0;
    private static int LOCATION_CHANGED_EVENT = 1;

    private String browserCallbackId = null;
  
    private Dialog dialog;
    private WebView webview;
     EditText edittext;
    private boolean showLocationBar = true;
    ProgressDialog progress;
    private String mainUrl;

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action        The action to execute.
     * @param args          JSONArry of arguments for the plugin.
     * @param callbackId    The callback id used when calling back into JavaScript.
     * @return              A PluginResult object with a status and message.
     */
    public PluginResult execute(String action, JSONArray args, String callbackId) {
        PluginResult.Status status = PluginResult.Status.OK;
         
        String result = "";

        try {
            if (action.equals("showWebPage")) {
                this.browserCallbackId = callbackId;

                // If the ChildBrowser is already open then throw an error
                if (dialog != null && dialog.isShowing()) {
                    return new PluginResult(PluginResult.Status.ERROR, "ChildBrowser is already open");
                }

                result = this.showWebPage(args.getString(0), args.optJSONObject(1));
                mainUrl = args.getString(0);
                if (result.length() > 0) {
                    status = PluginResult.Status.ERROR;
                    return new PluginResult(status, result);
                } else {
                    PluginResult pluginResult = new PluginResult(status, result);
                    pluginResult.setKeepCallback(true);
                    return pluginResult;
                }
            }
            else if (action.equals("close")) {
                closeDialog();

                JSONObject obj = new JSONObject();
                obj.put("type", CLOSE_EVENT);

                PluginResult pluginResult = new PluginResult(status, obj);
                pluginResult.setKeepCallback(false);
                return pluginResult;
            }
            else if (action.equals("openExternal")) {
                result = this.openExternal(args.getString(0), args.optBoolean(1));
                if (result.length() > 0) {
                    status = PluginResult.Status.ERROR;
                }
            }
            else if(action.equals("getUrl")){
            	//result =	this.webView.getUrl();
            	closeBrowser();
            }
            else {
                status = PluginResult.Status.INVALID_ACTION;
            }
            return new PluginResult(status, result);
        } catch (JSONException e) {
            return new PluginResult(PluginResult.Status.JSON_EXCEPTION);
        }
    }

    
    public void closeBrowser() {
    
    
    	
    	ActivityManager actvityManager = (ActivityManager)ctx.getApplicationContext().getSystemService(Activity.ACTIVITY_SERVICE);
    			
    			List<RunningAppProcessInfo> procInfos = actvityManager.getRunningAppProcesses();
    			
    			 
    			
    		
    			
    			 
    			
    			for(int i = 0; i < procInfos.size(); i++)
    			
    			{
    				if("com.android.browser".matches(procInfos.get(i).processName)){
    				       int pid = android.os.Process.getUidForName("com.android.browser");
    				             android.os.Process.killProcess(pid);
    				       Log.i("Test","testing");
    				      }
    			
    			  
    			
    			    
    			
    			}

    	
    }
    
    
    
    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param usePhoneGap   Load url in PhoneGap webview
     * @return              "" if ok, or error message.
     */
    public String openExternal(String url, boolean usePhoneGap) {
        try {
            Intent intent = null;
            if (usePhoneGap) {
                intent = new Intent().setClass(this.ctx.getContext(), org.apache.cordova.DroidGap.class);
                intent.setData(Uri.parse(url)); // This line will be removed in future.
                intent.putExtra("url", url);

                // Timeout parameter: 60 sec max - May be less if http device timeout is less.
                intent.putExtra("loadUrlTimeoutValue", 60000);

                // These parameters can be configured if you want to show the loading dialog
                intent.putExtra("loadingDialog", "Wait,Loading web page...");   // show loading dialog
                intent.putExtra("hideLoadingDialogOnPageLoad", true);           // hide it once page has completely loaded
            }
            else {
                intent = new Intent(Intent.ACTION_VIEW);
                intent.setData(Uri.parse(url));
            }
            this.ctx.getContext().startActivity(intent);
            return "";
        } catch (android.content.ActivityNotFoundException e) {
            Log.d(LOG_TAG, "ChildBrowser: Error loading url "+url+":"+ e.toString());
            return e.toString();
        }
    }

    /**
     * Closes the dialog
     */
    private void closeDialog() {
        if (dialog != null) {
            dialog.dismiss();
        }
    }

    /**
     * Checks to see if it is possible to go back one page in history, then does so.
     */
    private void goBack() {
        if (this.webview.canGoBack()) {
            this.webview.goBack();
        }
        else {
        	dialog.dismiss();
        }
    }

    /**
     * Checks to see if it is possible to go forward one page in history, then does so.
     */
    private void goForward() {
        if (this.webview.canGoForward()) {
            this.webview.goForward();
        }
    }

    /**
     * Navigate to the new page
     *
     * @param url to load
     */
    private void navigate(String url) {
        InputMethodManager imm = (InputMethodManager)this.ctx.getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
      //  imm.hideSoftInputFromWindow(edittext.getWindowToken(), 0);

        if (!url.startsWith("http") && !url.startsWith("file:")) {
            this.webview.loadUrl("http://" + url);
        } else {
            this.webview.loadUrl(url);
        }
        this.webview.requestFocus();
    }

     String pageTitle;
    /**
     * Should we show the location bar?
     *
     * @return boolean
     */
    private boolean getShowLocationBar() {
        return this.showLocationBar;
    }

    /**
     * Display a new browser with the specified URL.
     *
     * @param url           The url to load.
     * @param jsonObject
     */
    public String showWebPage(final String url, JSONObject options) {
        // Determine if we should hide the location bar.
        if (options != null) {
            showLocationBar = options.optBoolean("showLocationBar", true);
            pageTitle = options.optString("pageTitle", "");
                           
        }
         final Context context = this.ctx.getContext();   
        // Create dialog in new thread
        Runnable runnable = new Runnable() {
            /**
             * Convert our DIP units to Pixelsurl
             *
             * @return int
             
            private int dpToPixels(int dipValue) {
                int value = (int) TypedValue.applyDimension( TypedValue.COMPLEX_UNIT_DIP,
                                                            (float) dipValue,
                                                           context.getResources().getDisplayMetrics()
                );

                return value;
            }
            */
            public void run() {
                // Let's create the main dialog
                dialog = new Dialog(context, android.R.style.Theme_NoTitleBar);
                dialog.getWindow().getAttributes().windowAnimations = android.R.style.Animation_Dialog;
                dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                dialog.setCancelable(false);
                dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                        public void onDismiss(DialogInterface dialog) {
                            try {
                                JSONObject obj = new JSONObject();
                                obj.put("type", CLOSE_EVENT);

                                sendUpdate(obj, false);
                            } catch (JSONException e) {
                                Log.d(LOG_TAG, "Should never happen");
                            }
                        }
                });

                // Main container layout
                LinearLayout main = new LinearLayout(context);
                main.setOrientation(LinearLayout.VERTICAL);

                // Toolbar layout
                RelativeLayout toolbar = (RelativeLayout)View.inflate(context, R.layout.headerlayout, null);
                ImageButton  back =  (ImageButton)toolbar.findViewById(R.id.btnBack);    
                back.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        goBack();
                    }
                });
                ImageButton  close =  (ImageButton)toolbar.findViewById(R.id.btnClose);    
                close.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                    	  closeDialog();
                    }
                });
                TextView txtPageTitle = (TextView)toolbar.findViewById(R.id.txtArtistName);
                Typeface  fontStyle =   Typeface.createFromAsset(context.getAssets(), "opificio-webfont.ttf");

                txtPageTitle.setTypeface(fontStyle);
                txtPageTitle.setText(pageTitle);
                
                // WebView
                webview = new WebView(context);
                webview.setLayoutParams(new LinearLayout.LayoutParams(LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT));
                webview.setWebChromeClient(new ChildBrowserChromeClient(context));
                WebViewClient client = new ChildBrowserClient(context,edittext);
                webview.setWebViewClient(client);
                WebSettings settings = webview.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setBuiltInZoomControls(false);
                settings.setPluginsEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setPluginState(PluginState.ON);
                webview.loadUrl(url);
                webview.setId(6);
                webview.getSettings().setLoadWithOverviewMode(true);
                webview.getSettings().setUseWideViewPort(true);
                webview.requestFocus();
                webview.requestFocusFromTouch();
         
                      // Don't add the toolbar if its been disabled
                if (getShowLocationBar()) {
                    // Add our toolbar to our main view/layout
                    main.addView(toolbar);
                }

                // Add our webview to our main view/layout
                main.addView(webview);

                WindowManager.LayoutParams lp = new WindowManager.LayoutParams();
                lp.copyFrom(dialog.getWindow().getAttributes());
                lp.width = WindowManager.LayoutParams.FILL_PARENT;
                lp.height = WindowManager.LayoutParams.FILL_PARENT;

                dialog.setContentView(main);
              //  dialog.show();
                dialog.getWindow().setAttributes(lp);
                progress = ProgressDialog.show(context, "", "loading... please wait",true,false);
            }

          private Bitmap loadDrawable(String filename) throws java.io.IOException {
              InputStream input = context.getAssets().open(filename);
              return BitmapFactory.decodeStream(input);
          }
        };
        this.ctx.runOnUiThread(runnable);
        return "";
    }

    /**
     * Create a new plugin result and send it back to JavaScript
     *
     * @param obj a JSONObject contain event payload information
     */
    private void sendUpdate(JSONObject obj, boolean keepCallback) {
        if (this.browserCallbackId != null) {
            PluginResult result = new PluginResult(PluginResult.Status.OK, obj);
            result.setKeepCallback(keepCallback);
            this.success(result, this.browserCallbackId);
        }
    }

    public class ChildBrowserChromeClient extends WebChromeClient{
    	Context context;
    	public ChildBrowserChromeClient(Context context) {
    		this.context = context;
		}
    	@Override
    	public boolean onJsAlert(WebView view, String url, String message,
    			JsResult result) {
    		if(url.equals(mainUrl)||url.equals(mainUrl+"/home")){
    		String uriUrl = "http://globebbcurve.com/content/download/"+message;
    		Intent launchBrowser = new Intent(Intent.ACTION_VIEW, Uri.parse(uriUrl));
    		context.startActivity(launchBrowser);
    		}
    		else if(url.equals(mainUrl+"/videos")){
        		Log.i("Test",message);
    			Intent launchBrowser = new Intent(Intent.ACTION_VIEW, Uri.parse("http://www.yahoo.com"));
        		context.startActivity(launchBrowser);
    			
    		}
    		  result.confirm();
    		  return true;
    	}
    	
    }
    
    
    /**
     * The webview client receives notifications about appView
     */
    public class ChildBrowserClient extends WebViewClient {
        EditText edittext;
        Context context;

        /**
         * Constructor.
         *
         * @param mContext
         * @param edittext
         */
        public ChildBrowserClient(Context mContext,EditText mEditText) {
            //this.edittext = mEditText;
            this.context = mContext;
            
        }

        /**
         * Notify the host application that a page has started loading.
         *
         * @param view          The webview initiating the callback.
         * @param url           The url of the page.
         */
        @Override
        public void onPageStarted(WebView view, String url,  Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            String newloc;
            if (url.startsWith("http:") || url.startsWith("https:") || url.startsWith("file:")) {
                newloc = url;
            } else {
                newloc = "http://" + url;
            }

          //  if (!newloc.equals(edittext.getText().toString())) {
            //    edittext.setText(newloc);
         //   }

            try {
                JSONObject obj = new JSONObject();
                obj.put("type", LOCATION_CHANGED_EVENT);
                obj.put("location", url);

                sendUpdate(obj, true);
            } catch (JSONException e) {
                Log.d("ChildBrowser", "This should never happen");
            }
        }
        
        @Override
		public void onPageFinished(WebView view, String url) {
		  
        	
        	if(url.equals(mainUrl)||url.equals(mainUrl+"/home")){
			//super.onPageFinished(view, url);
        	view.loadUrl("javascript:{" +
        			"var element = document.getElementsByTagName('a')[11];"+
        			 "contentid = element.getAttribute('contentid');"+
        			"element.setAttribute('href','#');" +
        			"element.setAttribute('onclick','alert(contentid);');"+
        			"}");
        	}
        	else if(url.equals(mainUrl+"/videos")){
        		view.loadUrl("javascript:{" +
        				"var element= document.getElementsByTagName('iframe');" +
        				"src = element.getAttribute('src');" +
        				"alert(src);"+
        				"element.setAttribute('onclick','alert(src);');" +
        				"}");
        	}
        	progress.dismiss();
			dialog.show();
		}
		

        
        
        
        @Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
        	Log.i("Test",url);
			 if( url.startsWith("http:") || url.startsWith("https:") ) {
			        return false;
			    }

			    // Otherwise allow the OS to handle it
			    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
			    context.startActivity(intent);
			    //this.ctx.startActivity( intent ); 
			    return true;
		}
        
       
        /*
        @Override
        public void onLoadResource(WebView view, String url) {
        	  if (url.contains("http://www.youtube.com/embed/")) {
                  if(view.getHitTestResult().getType() > 0){
                      view.getContext().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                      view.stopLoading();
                      Log.i("RESLOAD", Uri.parse(url).toString());
                  }
              }
        }
        
        */
        
    }
}
