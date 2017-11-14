package com.papadroid;

import android.os.Build;

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

public class CPU extends ReactContextBaseJavaModule {
    public CPU(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    private static final String CPU_MODEL = "BatteryInformation";

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(CPU_MODEL, "BatteryInformation");
        return constants;
    }

    @ReactMethod
    public void returnValue(String pid, Callback successCallback, Callback errorCallback) {
        try {
            switch (pid) {
                case "BatteryInformation":
                    successCallback.invoke(Main.get_cpu_info());
                    break;
                case "CPU_ARCH":
                    successCallback.invoke(Main.getArch());
                    break;
                case "CPU_TEMP":
                    successCallback.invoke(Main.fetch_cpu_temp());
                    break;
                case "CPU_CURR_SPEED":
                    successCallback.invoke(Main.curr_cpu_freq("cur"));
                    break;
                case "CPU_MAX_SPEED":
                    successCallback.invoke(Main.curr_cpu_freq("max"));
                    break;
                case "CPU_MIN_SPEED":
                    successCallback.invoke(Main.curr_cpu_freq("min"));
                    break;
                case "CPU_STATISTIC":
                    successCallback.invoke(Main.getCpuUsageStatistic());
                    break;
                case "CPU_COUNT":
                    successCallback.invoke(Main.getCurrentProcessors());
                    break;
            }
        } catch (Exception e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @Override
    public String getName() {
        return "CPU";
    }
}

class Main {
    // cpu name
    public static String get_cpu_info() {
        StringBuffer sb = new StringBuffer();
        sb.append("abi: ").append(Build.CPU_ABI).append("\n");
        if (new File("/proc/cpuinfo").exists()) {
            try {
                BufferedReader br = new BufferedReader(new FileReader(new File("/proc/cpuinfo")));
                String aLine;
                while ((aLine = br.readLine()) != null) {
                    sb.append(aLine + "\n");
                }
                if (br != null) {
                    br.close();
                }

            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    public static String getArch() {
        return Build.CPU_ABI;
    }

    public static float fetch_cpu_temp() {
        Process p;
        try {
            p = Runtime.getRuntime().exec("cat sys/class/thermal/thermal_zone0/temp");
            p.waitFor();
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));

            String line = reader.readLine();
            float temp = Float.parseFloat(line) / 1000.0f;

            return temp;

        } catch (Exception e) {
            e.printStackTrace();
            return 0.0f;
        }
    }

    private static String preparePathString(String which){
        switch (which){
            case "max":
                return "/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_max_freq";
            case "min":
                return "/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_min_freq";
            case "cur":
                return "/sys/devices/system/cpu/cpu0/cpufreq/scaling_cur_freq";
            default:
                return "";
        }
    }

    public static String curr_cpu_freq(String type) {
        String cpuMaxFreq = "";
        String path = preparePathString(type);

        RandomAccessFile reader = null;
        try {
            reader = new RandomAccessFile(path, "r");
            cpuMaxFreq = reader.readLine();
            reader.close();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return e.toString();
        } catch (IOException e) {
            e.printStackTrace();
            return e.toString();
        }

        return cpuMaxFreq;
    }

    public static int getCurrentProcessors(){
        return Runtime.getRuntime().availableProcessors();
    }

    static public String getCpuUsageStatistic() {

        String tempString = executeTop();
        StringBuilder result = new StringBuilder();

        tempString = tempString.replaceAll(",", "");
        tempString = tempString.replaceAll("User", "");
        tempString = tempString.replaceAll("System", "");
        tempString = tempString.replaceAll("IOW", "");
        tempString = tempString.replaceAll("IRQ", "");
        tempString = tempString.replaceAll("%", "");
        for (int i = 0; i < 10; i++) {
            tempString = tempString.replaceAll("  ", " ");
        }
        tempString = tempString.trim();
        String[] myString = tempString.split(" ");
        int[] cpuUsageAsInt = new int[myString.length];
        for (int i = 0; i < myString.length; i++) {
            myString[i] = myString[i].trim();
            if (i != myString.length - 1) {
                result.append(myString[i] + "\n");
            }else{
                result.append(myString[i]);
            }
        }
        return result.toString();
    }

    static private String executeTop() {
        java.lang.Process p = null;
        BufferedReader in = null;
        String returnString = null;
        try {
            p = Runtime.getRuntime().exec("top -n 1");
            in = new BufferedReader(new InputStreamReader(p.getInputStream()));
            while (returnString == null || returnString.contentEquals("")) {
                returnString = in.readLine();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                in.close();
                p.destroy();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return returnString;
    }
}