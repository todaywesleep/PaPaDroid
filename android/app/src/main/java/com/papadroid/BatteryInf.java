package com.papadroid;

import android.os.BatteryManager;
import android.os.Build;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;

public class BatteryInf extends ReactContextBaseJavaModule {
    ReactApplicationContext context;

    public BatteryInf(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
    }

    @ReactMethod
    public void returnValue(String type, String lang, Callback successCallback, Callback errorCallback) {
        try {
            switch (type) {
                case "PERCENTAGE":
                    successCallback.invoke(BatteryInfUtils.getPercentage(getStatus()));
                    break;
                case "STATUS":
                    successCallback.invoke(BatteryInfUtils.getStatus(getStatus(), lang));
                    break;
            }
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "BatteryInf";
    }

    public Intent getStatus(){
         IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);

         return this.context.registerReceiver(null, ifilter);
    }
}

class BatteryInfUtils {
    public static String getPercentage(Intent batteryStatus){
        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);

        return String.valueOf(level);
    }

    public static String getStatus(Intent batteryStatus, String lang){
        int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
        if (status == BatteryManager.BATTERY_STATUS_FULL)
            return lang.equals("en") ? "Full charge" : "Полностью заряжена";

        return lang.equals("en") ?
                (status == BatteryManager.BATTERY_STATUS_CHARGING ? "Charging" : "Not charging") :
                (status == BatteryManager.BATTERY_STATUS_CHARGING ? "Заряжается" : "Разряжается");
    }
}