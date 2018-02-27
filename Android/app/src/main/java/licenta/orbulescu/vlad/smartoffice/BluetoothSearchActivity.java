package licenta.orbulescu.vlad.smartoffice;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.support.design.widget.NavigationView;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class BluetoothSearchActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {
    private SearchBluetoothModule bluetoothModule;
    private PermissionsModule permissionsModule;
    private Button searchBttn;
    private List<BluetoothDevice> deviceList = new ArrayList<BluetoothDevice>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bluetooth_search);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        //start of declarations needed for the search
        searchBttn = (Button) findViewById(R.id.searchBttn);
        searchBttn.setOnClickListener(new ClickListener());

        //bluetooth module start
        bluetoothModule = new SearchBluetoothModule(this, this);
        permissionsModule = new PermissionsModule(this,this);
        bluetoothModule.checkBLECapable();
        bluetoothModule.checkBluetoothPermission();
        permissionsModule.checkLocationPermission();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.bluetooth_search, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override

    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_camera) {
            // Handle the camera action
        } else if (id == R.id.nav_gallery) {

        } else if (id == R.id.nav_slideshow) {

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_share) {

        } else if (id == R.id.nav_send) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    private class ClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            boolean btEn = bluetoothModule.checkBluetoothEnabled();
            boolean locEn = permissionsModule.checkLocationPermissionEnabled();
            if(btEn && locEn ) {
                bluetoothModule.startScanning(true);
            } else if(!btEn) {
                ToasterService tService = new ToasterService();
                tService.setMessage(getString(R.string.please_enable_bluetooth));
                tService.DisplayToast(getBaseContext(), 1);
                bluetoothModule.checkBluetoothPermission();
            } else if (!locEn) {
                ToasterService tService = new ToasterService();
                tService.setMessage(getString(R.string.please_grant_location_permission));
                tService.DisplayToast(getBaseContext(), 1);
                permissionsModule.checkLocationPermission();
            }
        }
    }
}

