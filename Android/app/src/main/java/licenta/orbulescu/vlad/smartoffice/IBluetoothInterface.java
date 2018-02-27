package licenta.orbulescu.vlad.smartoffice;

import android.app.Activity;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.le.ScanCallback;
import android.content.Context;
import android.support.v4.content.ContextCompat;

import java.util.List;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public interface IBluetoothInterface {
    long SCAN_PERIOD = 5000;
    int REQUEST_ENABLE_BT = 1;

    void checkBluetoothPermission();
    void checkBLECapable();
    boolean checkBluetoothEnabled();
    List<BluetoothDevice> startScanning(final boolean enable);
}
