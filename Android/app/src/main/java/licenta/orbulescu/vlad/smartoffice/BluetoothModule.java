package licenta.orbulescu.vlad.smartoffice;

import android.app.Activity;
import android.app.AlertDialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattServer;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.bluetooth.BluetoothSocket;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.ParcelUuid;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public class BluetoothModule implements IBluetoothInterface, Serializable {
    private Context context;
    private Activity activity;
    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothLeScanner bluetoothLeScanner;
    private OutputStream outputStream;
    private InputStream inStream;
    private BluetoothGatt bluetoothGatt;
    private List<BluetoothDevice> deviceList = new ArrayList<BluetoothDevice>();
    private List<String> deviceNameList = new ArrayList<String>();
    private BluetoothDevice connectedDevice;
    private BluetoothGattCharacteristic mWriteCharacteristic;
    private BluetoothGattCharacteristic mReadCharacteristic;
    private ParcelUuid[] uuids;

    public BluetoothModule(Context context, Activity activity) {
        this.activity = activity;
        this.context = context;
        final BluetoothManager bluetoothManager =
                (BluetoothManager) activity.getSystemService(Context.BLUETOOTH_SERVICE);
        mBluetoothAdapter = bluetoothManager.getAdapter();
    }

    @Override
    //Requests the bluetooth to be enabled
    public void checkBluetoothPermission() {
        if (mBluetoothAdapter == null || !mBluetoothAdapter.isEnabled()) {
            Intent enableBtIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            activity.startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
        }
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
        final ProgressBarModule mProgress = new ProgressBarModule(activity);
        Handler mHandler = new Handler();
        //clear memory
        deviceList = new ArrayList<BluetoothDevice>();
        deviceNameList = new ArrayList<String>();
        if (enable) {
            //this handler makes the scanning to continue for the SCAN_PERIOD define
            mHandler.postDelayed(new Runnable() {
                @Override
                public void run() {
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
            mProgress.showBar();
            bluetoothLeScanner.startScan(scanCallback);
        } else {
            mProgress.hideBar();
            bluetoothLeScanner.stopScan(scanCallback);
        }
        return deviceList;
    }

    @Override
    public BluetoothDevice connectToGatt(final BluetoothDevice device) {
        BluetoothGattCallback gattCallback = new BluetoothGattCallback() {
            @Override
            public void onPhyUpdate(BluetoothGatt gatt, int txPhy, int rxPhy, int status) {
                super.onPhyUpdate(gatt, txPhy, rxPhy, status);
            }

            @Override
            public void onPhyRead(BluetoothGatt gatt, int txPhy, int rxPhy, int status) {
                super.onPhyRead(gatt, txPhy, rxPhy, status);
            }

            @Override
            public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
                super.onConnectionStateChange(gatt, status, newState);
                if(status == gatt.GATT_SUCCESS) {
                    if(newState == BluetoothProfile.STATE_CONNECTED) {
                        bluetoothGatt.discoverServices();
                    } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                        activity.startActivity(new Intent(context, CodeGeneratorActivity.class));
                    }
                } else {
                    //TODO do something
                }
            }

            @Override
            public void onServicesDiscovered(BluetoothGatt gatt, int status) {
                super.onServicesDiscovered(gatt, status);
                List<BluetoothGattService> services = gatt.getServices();
                for(BluetoothGattService service: services) {
                    List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();
                    for(BluetoothGattCharacteristic charact : characteristics) {
                        final int charaProp = charact.getProperties();
                        if (((charaProp & BluetoothGattCharacteristic.PROPERTY_WRITE) |
                                (charaProp & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE)) > 0) {
                            mWriteCharacteristic = charact;
                        }
                        if (((charaProp & BluetoothGattCharacteristic.PROPERTY_READ)) > 0) {
                            mReadCharacteristic = charact;
                            bluetoothGatt.setCharacteristicNotification(mReadCharacteristic,true);
                            for(BluetoothGattDescriptor descriptor : charact.getDescriptors()) {
                                descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                            }
                        }
                    }
                }
            }

            @Override
            public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                super.onCharacteristicRead(gatt, characteristic, status);
            }

            @Override
            public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
                super.onCharacteristicWrite(gatt, characteristic, status);
            }

            @Override
            public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
                super.onCharacteristicChanged(gatt, characteristic);
                //value is the response
                String value = new String(characteristic.getValue(), StandardCharsets.UTF_8);
            }

            @Override
            public void onDescriptorRead(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
                super.onDescriptorRead(gatt, descriptor, status);
            }

            @Override
            public void onDescriptorWrite(BluetoothGatt gatt, BluetoothGattDescriptor descriptor, int status) {
                super.onDescriptorWrite(gatt, descriptor, status);
            }

            @Override
            public void onReliableWriteCompleted(BluetoothGatt gatt, int status) {
                super.onReliableWriteCompleted(gatt, status);
            }

            @Override
            public void onReadRemoteRssi(BluetoothGatt gatt, int rssi, int status) {
                super.onReadRemoteRssi(gatt, rssi, status);
            }

            @Override
            public void onMtuChanged(BluetoothGatt gatt, int mtu, int status) {
                super.onMtuChanged(gatt, mtu, status);
            }
        };
        bluetoothGatt = device.connectGatt(context, true, gattCallback);
        ToasterService tService = new ToasterService();
        if(bluetoothGatt.getDevice().equals(device)) {
           tService.setMessage(context.getString(R.string.connected_to) + " " + device.getName());
           connectedDevice = device;
           tService.DisplayToast(context, 1);
           return device;
        } else {
            tService.setMessage(context.getString(R.string.device_connection_error));
            tService.DisplayToast(context, 1);
            return null;
        }
    }

    @Override
    public BluetoothDevice getConnectedDevice() {
        if(connectedDevice != null) {
            return connectedDevice;
        } else {
            return null;
        }
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
            final CharSequence devices[] = deviceNameList.toArray(new CharSequence[deviceNameList.size()]);
            builder.setTitle(R.string.select_a_device);
            builder.setItems(devices, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    for(BluetoothDevice dev : deviceList) {
                        if(dev.getName().equals(devices[which])) {
                            Intent intent = new Intent(activity, CodeGeneratorActivity.class);
                            intent.putExtra("ConnectToDevice", dev);
                            activity.startActivity(intent);
                        }
                    }
                }
            });
            builder.show();
        }
    }
    public void sendData(String data) throws IOException {
        if(mBluetoothAdapter.getBondedDevices().size() > 0) {
            byte[] dataBytes = data.getBytes();
            mWriteCharacteristic.setValue(dataBytes);
            bluetoothGatt.writeCharacteristic(mWriteCharacteristic);
        }
    }
}
