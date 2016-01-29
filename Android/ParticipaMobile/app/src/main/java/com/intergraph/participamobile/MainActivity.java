package com.intergraph.participamobile;

import org.apache.cordova.DroidGap;

import android.os.Build;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.WebView;

public class MainActivity extends DroidGap {
	public static MainActivity participa;
	public View appView;

	@Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        
        participa = this;
        
        super.loadUrlTimeoutValue = 60000;
        super.loadUrl("file:///android_asset/www/index.html");
        appView = (View)super.appView.getParent();

		/*super.appView.setVerticalScrollBarEnabled(true);
		super.appView.setHorizontalScrollBarEnabled(false);
		// set scrollbar style
		super.appView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);*/
    }
	
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
	    if (keyCode == KeyEvent.KEYCODE_BACK) {
	        return true;
	    }
	 //   return super.onKeyDown(keyCode, event);
	    
	    return true;
	}
}
