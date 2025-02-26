package com.todolist;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.provider.MediaStore;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import android.graphics.Bitmap;
import java.io.ByteArrayOutputStream;
import androidx.core.app.ActivityCompat;
import android.content.pm.PackageManager;

public class CameraModule extends ReactContextBaseJavaModule {

    private static final int CAMERA_REQUEST = 1;
    private static final String E_CAMERA_CANCELLED = "E_CAMERA_CANCELLED";
    private static final String E_FAILED_TO_CAPTURE = "E_FAILED_TO_CAPTURE";
    private Promise cameraPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == CAMERA_REQUEST) {
                if (cameraPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        cameraPromise.reject(E_CAMERA_CANCELLED, "Camera was cancelled");
                    } else if (resultCode == Activity.RESULT_OK && data != null) {
                        Bitmap photo = (Bitmap) data.getExtras().get("data");
                        if (photo != null) {
                            // Chuyển đổi Bitmap thành byte array (có thể sử dụng base64 nếu cần)
                            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                            photo.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                            byte[] byteArray = byteArrayOutputStream.toByteArray();

                            // Giải pháp lưu hoặc trả về ảnh dưới dạng Base64 hoặc đường dẫn tệp (ví dụ)
                            String base64String = android.util.Base64.encodeToString(byteArray,
                                    android.util.Base64.DEFAULT);

                            // Trả kết quả về cho React Native
                            cameraPromise.resolve(base64String);
                        } else {
                            cameraPromise.reject(E_FAILED_TO_CAPTURE, "Failed to capture image");
                        }
                    } else {
                        cameraPromise.reject(E_FAILED_TO_CAPTURE, "Failed to capture image");
                    }
                    cameraPromise = null;
                }
            }
        }
    };

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "CameraModule";
    }

    @ReactMethod
    public void captureImage(Promise promise) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            promise.reject("E_ACTIVITY_DOES_NOT_EXIST", "Activity doesn't exist");
            return;
        }

        cameraPromise = promise;

        try {
            Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            if (ActivityCompat.checkSelfPermission(getReactApplicationContext(), Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{Manifest.permission.CAMERA}, 1);
                return;
            }
            currentActivity.startActivityForResult(cameraIntent, CAMERA_REQUEST);
        } catch (Exception e) {
            cameraPromise.reject(E_FAILED_TO_CAPTURE, e);
            cameraPromise = null;
        }
    }
}