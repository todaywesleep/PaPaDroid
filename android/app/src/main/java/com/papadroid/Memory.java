package com.papadroid;

import android.app.ActivityManager;
import android.content.Context;
import android.os.Debug;
import android.os.StatFs;
import android.os.Environment;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.lang.Object;

import java.io.IOException;
import java.io.RandomAccessFile;

public class Memory extends ReactContextBaseJavaModule {
    public Memory(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void getInformation(String type, Callback successCallback, Callback errorCallback) {
        try {
            switch (type) {
                case "TOTALRAM":
                    successCallback.invoke(MemoryFunc.getTotalRAM());
                    break;
                case "FREERAM":
                    successCallback.invoke(MemoryFunc.freeRam());
                    break;
                case "FREESTORAGE":
                    successCallback.invoke(MemoryFunc.freeStorage());
                    break;
                case "TOTALSTORAGE":
                    successCallback.invoke(MemoryFunc.totalStorage());
                    break;
            }
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "Memory";
    }
}

class MemoryFunc{
    public static String getTotalRAM() {
        RandomAccessFile reader = null;
        String load = null;
        try {
            reader = new RandomAccessFile("/proc/meminfo", "r");
            load = reader.readLine();
            reader.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return load;
    }

    public static String freeRam(){
        long freeSize = 0L;
        long totalSize = 0L;
        long usedSize = -1L;
        try {
            Runtime info = Runtime.getRuntime();
            freeSize = info.freeMemory();
            totalSize = info.totalMemory();
            usedSize = totalSize - freeSize;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return Long.toString(usedSize);
    }

    public static String freeStorage(){
        StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
        long bytesAvailable = (long)stat.getBlockSize()*(long)stat.getAvailableBlocksLong();
        long megAvailable = bytesAvailable / (1024*1024);

        return Long.toString(megAvailable);
    }

    public static String totalStorage(){
        StatFs stat = new StatFs(Environment.getExternalStorageDirectory().getPath());
        long bytesAvailable = (long)stat.getBlockSize()*(long)stat.getBlockCountLong();
        long megAvailable = bytesAvailable / 1024;

        return Long.toString(megAvailable);
    }
}