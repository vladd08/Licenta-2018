package licenta.orbulescu.vlad.smartoffice;

import android.bluetooth.BluetoothDevice;

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
    BluetoothDevice connectToGatt(BluetoothDevice device);
    BluetoothDevice getConnectedDevice();
}
