package net.eximpoglobal.app;

import android.content.Intent;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.os.Build;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.CookieManager;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.activity.OnBackPressedCallback;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private View noNetworkLayout;
    private GoogleSignInClient googleSignInClient;
    private ActivityResultLauncher<Intent> signInLauncher;
    private static final String TAG = "EximpoWebView";
    private static final String BASE_URL = "https://app.eximpoglobal.net";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Set status bar color to blue
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(Color.parseColor("#2563EB"));
        }
        
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        noNetworkLayout = findViewById(R.id.no_network_layout);
        Button retryButton = findViewById(R.id.retry_button);
        
        retryButton.setOnClickListener(v -> loadWebsite());

        // Configure Google Sign-In
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken("651479721750-80l0ekebtn6088mocnaitr2qkti9pg2r.apps.googleusercontent.com")
                .build();
        
        googleSignInClient = GoogleSignIn.getClient(this, gso);
        
        // Setup activity result launcher for sign-in
        signInLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == RESULT_OK) {
                        Intent data = result.getData();
                        handleSignInResult(data);
                    }
                });

        // Configure WebView settings
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Enable third-party cookies (required for Google Sign-In)
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);
        
        // Set user agent to mimic mobile browser (so Google Sign-In works)
        String userAgent = webSettings.getUserAgentString();
        // Remove "wv" from user agent to make it look like a regular browser
        userAgent = userAgent.replace("; wv)", ")");
        webSettings.setUserAgentString(userAgent);
        
        // Enable additional features for modern web apps
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setCacheMode(WebSettings.LOAD_NO_CACHE); // Don't use cache to detect network issues
        
        // Disable zoom
        webSettings.setSupportZoom(false);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        
        // Add JavaScript interface for native Google Sign-In
        webView.addJavascriptInterface(new GoogleSignInBridge(this), "AndroidGoogleAuth");
        
        // Set WebViewClient to handle navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
            
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    Log.e(TAG, "Error loading page: " + error.getDescription());
                    showNoNetwork();
                }
            }
            
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.d(TAG, "Page started: " + url + ", canGoBack: " + view.canGoBack());
                hideNoNetwork();
                // Hide Capacitor splash immediately when page starts loading
                String hideCapacitorSplash = "javascript:(function() { " +
                    "var style = document.createElement('style'); " +
                    "style.innerHTML = 'capacitor-welcome, .capacitor-welcome, #capacitor-welcome, " +
                    "[class*=\"capacitor\"], [id*=\"capacitor\"], .splash, #splash, " +
                    ".splash-screen, #splash-screen { display: none !important; }'; " +
                    "document.head.appendChild(style); " +
                    "})()";
                view.loadUrl(hideCapacitorSplash);
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d(TAG, "Page finished: " + url + ", canGoBack: " + view.canGoBack());
                // Hide any remaining splash screens after page loads
                String javascript = "javascript:(function() { " +
                    "document.querySelectorAll('capacitor-welcome, .capacitor-welcome, #capacitor-welcome, " +
                    "[class*=\\\"capacitor\\\"], [id*=\\\"capacitor\\\"], .splash, #splash, " +
                    ".splash-screen, #splash-screen').forEach(function(el) { " +
                    "el.style.display='none'; el.remove(); }); " +
                    "})()";
                view.evaluateJavascript(javascript, null);
            }
        });
        
        webView.setWebChromeClient(new WebChromeClient());
        
        // Handle back button press
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                Log.d(TAG, "Back pressed, canGoBack: " + webView.canGoBack());
                if (webView.canGoBack()) {
                    Log.d(TAG, "Going back in WebView");
                    webView.goBack();
                } else {
                    Log.d(TAG, "Exiting app");
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });
        
        // Load deep link URL if launched via App Link, otherwise load home
        android.net.Uri deepLinkUri = getIntent().getData();
        if (deepLinkUri != null) {
            loadDeepLink(deepLinkUri);
        } else {
            loadWebsite();
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        android.net.Uri deepLinkUri = intent.getData();
        if (deepLinkUri != null) {
            loadDeepLink(deepLinkUri);
        }
    }

    private void loadDeepLink(android.net.Uri uri) {
        if (!isNetworkAvailable()) {
            showNoNetwork();
            return;
        }
        hideNoNetwork();
        String url = uri.toString();
        Log.d(TAG, "Loading deep link: " + url);
        webView.loadUrl(url);
    }
    
    private void loadWebsite() {
        if (!isNetworkAvailable()) {
            showNoNetwork();
            return;
        }
        hideNoNetwork();
        webView.loadUrl(BASE_URL);
    }
    
    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (connectivityManager != null) {
            Network network = connectivityManager.getActiveNetwork();
            if (network == null) return false;
            
            NetworkCapabilities capabilities = connectivityManager.getNetworkCapabilities(network);
            return capabilities != null && (
                capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)
            );
        }
        return false;
    }
    
    private void showNoNetwork() {
        runOnUiThread(() -> {
            webView.setVisibility(View.GONE);
            noNetworkLayout.setVisibility(View.VISIBLE);
        });
    }
    
    private void hideNoNetwork() {
        runOnUiThread(() -> {
            noNetworkLayout.setVisibility(View.GONE);
            webView.setVisibility(View.VISIBLE);
        });
    }

    public void startNativeGoogleSignIn() {
        Intent signInIntent = googleSignInClient.getSignInIntent();
        signInLauncher.launch(signInIntent);
    }

    private void handleSignInResult(Intent data) {
        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
        try {
            GoogleSignInAccount account = task.getResult(ApiException.class);
            String idToken = account.getIdToken();
            String email = account.getEmail();
            
            Log.d(TAG, "Sign-in successful: " + email);
            
            // Pass the token back to the web page
            String javascript = String.format(
                "javascript:window.handleNativeGoogleSignIn('%s', '%s')",
                idToken, email
            );
            webView.evaluateJavascript(javascript, null);
            
        } catch (ApiException e) {
            Log.e(TAG, "Sign-in failed: " + e.getStatusCode());
        }
    }
}
