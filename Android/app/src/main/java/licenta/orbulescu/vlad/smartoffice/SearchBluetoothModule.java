package licenta.orbulescu.vlad.smartoffice;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Entity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ListView;
import android.widget.ProgressBar;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public class SearchBluetoothModule implements IBluetoothInterface {
    private Context context;
    private Activity activity;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private boolean mScanning = false;
    private List<BluetoothDevice> deviceList = new ArrayList<BluetoothDevice>();
    private List<String> deviceNameList = new ArrayList<String>();

    public SearchBluetoothModule(Context context, Activity activity) {
        this.activity = activity;
        this.context = context;
    }

    @Override
    //Requests the bluetooth to be enabled
    public void checkBluetoothPermission() {
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            activity.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }
        //finally sets the adapter after the bluetooth was turned on
        final BluetoothManager bluetoothManager =
                (BluetoothManager) activity.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    @Override
    //Checks if the device is bluetooth low energy device compatible
    public void checkBLECapable() {
        if (!context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
            ToasterService tService = new ToasterService();
            tService.setMessage("This device is not BLE compatible!");
            tService.DisplayToast(context, 0);
            tService = null;
        }
    }

    @Override
    public boolean checkBluetoothEnabled() {
        return mBluetoothAdapter.isEnabled();
    }

    @Override
    public List<BluetoothDevice> startScanning(final boolean enable) {
        bluetoothLeScanner = mBluetoothAdapter.getBluetoothLeScanner();
        final licenta.orbulescu.vlad.smartoffice.ProgressBar mProgress = new licenta.orbulescu.vlad.smartoffice.ProgressBar(activity);
        Handler mHandler = new Handler();
        //clear memory
        deviceList = new ArrayList<BluetoothDevice>();
        deviceNameList = new ArrayList<String>();
        if (enable) {
            //this handler makes the scanning to continue for the SCAN_PERIOD define
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    mScanning = false;
                    mProgress.hideBar();
                    bluetoothLeScanner.stopScan(scanCallback);
                    if (!deviceList.isEmpty()) {
                        Log.i("No. of devices:", "" + deviceList.size());
                        for (BluetoothDevice d : deviceList) {
                            Log.i("Device found:", "" + d.getName());
                        }
                    } else {
                        Log.i("No devices", "No devices were found!");
                    }
                    Log.i("Done", "DONE");
                    showDevicesDialog();
                }
            }, SCAN_PERIOD);
            mScanning = true;
            mProgress.showBar();
            bluetoothLeScanner.startScan(scanCallback);
        } else {
            mScanning = false;
            mProgress.hideBar();
            bluetoothLeScanner.stopScan(scanCallback);
        }
        return deviceList;
    }

    //scanning callback
    private ScanCallback scanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            boolean exists = false;
            if (deviceList.isEmpty() && result != null) {
                addDeviceToList(result);
            } else {
                if (result != null) {
                    for (BluetoothDevice d : deviceList) {
                        if (d.getAddress().equals(result.getDevice().getAddress())) {
                            exists = true;
                        }
                    }
                    if (!exists && result.getDevice().getName() != null) {
                        addDeviceToList(result);
                    }
                }
            }
        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
        }

        @Override
        public void onScanFailed(int errorCode) {
            Log.i("Error", String.valueOf(errorCode));
        }

        private void addDeviceToList(ScanResult rs) {
            deviceList.add(rs.getDevice());
            deviceNameList.add(rs.getDevice().getName());
        }
    };

    private void showDevicesDialog() {
        if(deviceList.size() == 0) {
            ToasterService tService = new ToasterService();
            tService.setMessage(context.getString(R.string.no_device_found));
            tService.DisplayToast(context,1);
        } else {
            AlertDialog.Builder builder = new AlertDialog.Builder(activity);
            CharSequence devices[] = deviceNameList.toArray(new CharSequence[deviceNameList.size()]);
            builder.setTitle(R.string.select_a_device);
            builder.setItems(devices, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    // the user clicked on colors[which]
                }
            });
            builder.show();
        }
    }
}
