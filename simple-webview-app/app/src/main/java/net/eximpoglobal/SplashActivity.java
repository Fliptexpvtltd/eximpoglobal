package net.eximpoglobal;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.widget.ImageView;
import androidx.appcompat.app.AppCompatActivity;
import java.io.InputStream;
import java.net.URL;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

public class SplashActivity extends AppCompatActivity {
    private static final int SPLASH_DURATION = 3000; // 3 seconds
    private static final String SPLASH_IMAGE_URL = "https://sin1.contabostorage.com/265cb5518b244ea2bdb6eef9784e1983:eximpo-bucket/brand/Eximpo_Splash_Screen.png";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView splashImage = findViewById(R.id.splash_image);
        
        // Load image from URL in background thread
        new Thread(() -> {
            try {
                URL url = new URL(SPLASH_IMAGE_URL);
                InputStream input = url.openStream();
                Bitmap bitmap = BitmapFactory.decodeStream(input);
                
                runOnUiThread(() -> {
                    if (bitmap != null) {
                        splashImage.setImageBitmap(bitmap);
                    }
                });
            } catch (Exception e) {
                e.printStackTrace();
                // Keep default drawable if loading fails
            }
        }).start();

        // Navigate to MainActivity after splash duration
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(SplashActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }
        }, SPLASH_DURATION);
    }
}
