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
    BatteryInfUtils utils;
    public BatteryInf(ReactApplicationContext reactContext) {
        super(reactContext);
        this.utils = new BatteryInfUtils(reactContext);
    }

    @ReactMethod
    public void returnValue(String type, Callback successCallback, Callback errorCallback) {
        try {
            switch (type) {
                case "PERCENTAGE":
                    successCallback.invoke(this.utils.getPercentage());
                    break;
                case "STATUS":
                    successCallback.invoke(this.utils.getStatus());
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
}

class BatteryInfUtils {
    static ReactApplicationContext context;
    static IntentFilter ifilter;
    static Intent batteryStatus;

    public BatteryInfUtils(ReactApplicationContext reactContext) {
        this.context = reactContext;

        this.ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        this.batteryStatus = this.context.registerReceiver(null, ifilter);
    }

    public static String getPercentage(){
        int level = batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);

        return String.valueOf(level);
    }

    public static String getStatus(){
        int status = batteryStatus.getIntExtra(BatteryManager.EXTRA_STATUS, -1);
        if (status == BatteryManager.BATTERY_STATUS_FULL)
            return  "Full charge";

        return status == BatteryManager.BATTERY_STATUS_CHARGING ? "Charging" : "Not charging";
    }
}