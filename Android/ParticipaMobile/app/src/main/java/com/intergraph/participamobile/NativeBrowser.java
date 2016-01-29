package com.intergraph.participamobile;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.intergraph.participamobile.R;

import android.content.Context;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup.LayoutParams;
import android.view.WindowManager;
import android.webkit.WebSettings.PluginState;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;


public class NativeBrowser extends CordovaPlugin
{
	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) {
	    if ("nativebrowser".equals(action)) {
	    	try {
		    	if(args.length() > 5){
		    		final int app_scaling_orig = Integer.parseInt(args.getString(0));
					final int topbar_height = Integer.parseInt(args.getString(1));
					final int contentarea_height = Integer.parseInt(args.getString(2));
					final int contentarea_width = Integer.parseInt(args.getString(6));
					final int bottombar_height = Integer.parseInt(args.getString(3));
					
					final String header = args.getString(4);
					final String url = args.getString(5);
		    		
		    		final MainActivity participa = MainActivity.participa;
		    		
		    		cordova.getActivity().runOnUiThread(new Runnable() {			
						public void run() {
							Display display = participa.getWindowManager().getDefaultDisplay();
							//final double app_scaling = ((double)display.getWidth() / (double)320);
							final double app_scaling = 1; //((double)display.getWidth() / (double)contentarea_width);
							final double app_scaling_height = ((double)display.getHeight()/ (double)contentarea_height);
							
			
							    DisplayMetrics metrics = new DisplayMetrics();
							    //manager.getDefaultDisplay().getMetrics(metrics);
							    display.getMetrics(metrics);
							    System.out.println(	"metrics.widthPixels " + metrics.widthPixels + " metrics.heightPixels: " + metrics.heightPixels + " metrics.density: " + metrics.density);
							
							final LinearLayout.LayoutParams topbar_size = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, (int)Math.floor((app_scaling_height * topbar_height)));
							//final LinearLayout.LayoutParams wvcontent_size = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, (int)Math.floor((app_scaling * contentarea_height)));
							final LinearLayout.LayoutParams wvcontent_size = new LinearLayout.LayoutParams(metrics.widthPixels, metrics.heightPixels-(int)Math.floor((app_scaling_height * 100)));
							//final RelativeLayout.LayoutParams wvcontent_size = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.FILL_PARENT, RelativeLayout.LayoutParams.FILL_PARENT);
							   
							final LinearLayout.LayoutParams bottombar_size = new LinearLayout.LayoutParams(LayoutParams.MATCH_PARENT, (int)Math.floor((app_scaling_height * bottombar_height)));
							final LinearLayout.LayoutParams back_btn_size = new LinearLayout.LayoutParams((int)Math.floor((app_scaling_height * (bottombar_height+1))), (int)Math.floor((app_scaling_height * (bottombar_height+1))));
							final LinearLayout.LayoutParams home_btn_size = new LinearLayout.LayoutParams((int)Math.floor((app_scaling_height * (bottombar_height+1))), (int)Math.floor((app_scaling_height * (bottombar_height+1))));
							
							participa.setContentView(R.layout.nativebrowser);
							
							final TextView topbar = (TextView)participa.findViewById(R.id.textView_topbar);
							final WebView wv = (WebView)participa.findViewById(R.id.webView_content);
							final LinearLayout bottombar = (LinearLayout)participa.findViewById(R.id.linearLayout_bottombar);
							final ImageView backbtn = (ImageView)participa.findViewById(R.id.imageView_back);
							final ImageView homebtn = (ImageView)participa.findViewById(R.id.imageView_home);

							/*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
								wv.setWebContentsDebuggingEnabled(true);
								webview.setWebContentsDebuggingEnabled(true);
							}*/

							wv.setWebViewClient(new WebViewClient() {

								@Override
								public void onPageFinished(android.webkit.WebView view, String url) {
									super.onPageFinished(view, url);

									Display display = participa.getWindowManager().getDefaultDisplay();
									//WindowManager manager = (WindowManager) getContext().getSystemService(Context.WINDOW_SERVICE);

									DisplayMetrics metrics = new DisplayMetrics();
									//manager.getDefaultDisplay().getMetrics(metrics);
									display.getMetrics(metrics);
									//System.out.println(	"metrics.widthPixels " + metrics.widthPixels + " metrics.heightPixels: " + metrics.heightPixels);

									metrics.widthPixels /= metrics.density;

									view.loadUrl("javascript:var scale = " + metrics.widthPixels + " / document.body.scrollWidth; document.body.style.zoom = scale;");
									//view.loadUrl("javascript:var scale = " + metrics.heightPixels + " / document.body.scrollHeight; document.body.style.zoom = scale;");

								}

							});

							wv.loadUrl(url);
							wv.getSettings().setBuiltInZoomControls(true);
							wv.getSettings().setPluginState(PluginState.ON);
							wv.getSettings().setJavaScriptEnabled(true);
							wv.setLayoutParams(wvcontent_size);
							wv.setPadding(0, 50, 0, 50);


                            /*@Override
                            public void onBackPressed(){
                                wv.loadUrl("javascript: var result = window.YourJSLibrary.callSomeFunction(); window.JavaCallback.returnResult(result)");
                            };*/


                            topbar.setLayoutParams(topbar_size);
							topbar.setHeight(50);
							//topbar.setTop((int)Math.floor(0));
							topbar.setPadding((int)Math.floor((app_scaling * 8)),0,0,0);
							topbar.setTextColor(Color.WHITE);
							topbar.setTextSize((int)Math.floor((app_scaling * 14)));
							topbar.setText(header);
							
							
							bottombar.setLayoutParams(bottombar_size);
							bottombar.setPadding(0,0,0,0);
							//bottombar.setBottom((int)Math.floor(0));
					
							
							
							
							// Back Button
							backbtn.setLayoutParams(back_btn_size);
							backbtn.setPadding((int)Math.floor((app_scaling * 2)),0,0,0);														
							backbtn.setOnClickListener(new OnClickListener() {
								
								@Override
								public void onClick(View v) {
									callbackContext.success();								
									participa.setContentView(participa.appView);
								}
							});
							
							// Home Button
							homebtn.setLayoutParams(home_btn_size);
							homebtn.setPadding((int)Math.floor((app_scaling * 4)),0,0,0);							
							homebtn.setOnClickListener(new OnClickListener() {
								
								@Override
								public void onClick(View v) {
									callbackContext.success("goHome");										
									participa.setContentView(participa.appView);
								}
							});							
							
							System.out.println(	"app_scaling_height: " + app_scaling_height + ", " + "topbar_height: " + topbar_height + ", " +
												"contentarea_height: " + contentarea_height + ", " + "bottombar_height: " + (int)Math.floor((app_scaling_height * bottombar_height)) + ", " +
												"header: " + header + ", " + "url: " + url);
							
							
						}
					});
				}	    	

		        return true;
		        
	    	} catch (JSONException e) {
	    		return false;
			}
	    }
	    else
	    	return false;
	}
	
}