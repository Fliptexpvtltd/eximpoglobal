package net.eximpoglobal.app;

import android.webkit.JavascriptInterface;
import android.app.Activity;

public class GoogleSignInBridge {
    private Activity activity;

    public GoogleSignInBridge(Activity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void signIn() {
        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ((MainActivity) activity).startNativeGoogleSignIn();
            }
        });
    }
}
