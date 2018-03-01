package licenta.orbulescu.vlad.smartoffice;

import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;

import java.util.ArrayList;
import java.util.List;

public class BluetoothSearchActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener {
    private BluetoothModule bluetoothModule;
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
        bluetoothModule = new BluetoothModule(this, this);
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

        if (id == R.id.nav_account) {
            // Handle the camera action
        } else if (id == R.id.nav_generator) {
            startActivity(new Intent(this, CodeGeneratorActivity.class));
        } else if (id == R.id.nav_connect) {

        } else if (id == R.id.nav_logout) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return false;
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

