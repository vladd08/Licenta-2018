package licenta.orbulescu.vlad.smartoffice;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
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
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import static android.bluetooth.BluetoothProfile.GATT;

public class CodeGeneratorActivity extends AppCompatActivity implements
        NavigationView.OnNavigationItemSelectedListener {
    private BluetoothDevice connectedDevice;
    private BluetoothModule bluetoothModule;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bluetoothModule = new BluetoothModule(this,this);

        setContentView(R.layout.activity_code_generator);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        Bundle bundle = new Bundle();
        bundle = getIntent().getExtras();

        if(bundle!=null) {
            if((connectedDevice = (BluetoothDevice) bundle.get("ConnectToDevice"))!=null) {
                connectedDevice = bluetoothModule.connectToGatt(connectedDevice);
            }
        }
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.addDrawerListener(toggle);
        toggle.syncState();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);
    }

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

    @Override
    public void onResume() {
        super.onResume();
        //if already connected
        if(connectedDevice != null) {
            findViewById(R.id.connected_image).setVisibility(View.VISIBLE);
            findViewById(R.id.connected_text1).setVisibility(View.VISIBLE);
            findViewById(R.id.connected_text2).setVisibility(View.VISIBLE);
            findViewById(R.id.connected_to).setVisibility(View.VISIBLE);
            findViewById(R.id.placeholder).setVisibility(View.VISIBLE);
            TextView tv = (TextView) findViewById(R.id.placeholder);
            tv.setText(connectedDevice.getName());

            findViewById(R.id.not_connected_image).setVisibility(View.INVISIBLE);
            findViewById(R.id.not_connected_text).setVisibility(View.INVISIBLE);
        } else { //if not connected
            findViewById(R.id.connected_image).setVisibility(View.INVISIBLE);
            findViewById(R.id.connected_text1).setVisibility(View.INVISIBLE);
            findViewById(R.id.connected_text2).setVisibility(View.INVISIBLE);
            findViewById(R.id.connected_to).setVisibility(View.INVISIBLE);
            findViewById(R.id.placeholder).setVisibility(View.INVISIBLE);

            findViewById(R.id.not_connected_image).setVisibility(View.VISIBLE);
            findViewById(R.id.not_connected_text).setVisibility(View.VISIBLE);
        }
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override

    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        if (id == R.id.nav_account) {

        } else if (id == R.id.nav_generator) {

        } else if (id == R.id.nav_connect) {
            if(bluetoothModule.getConnectedDevice() != null) {
                ToasterService tService = new ToasterService();
                tService.setMessage(getString(R.string.already_connected_to_device));
                tService.DisplayToast(this, 1);
            } else {
                startActivity(new Intent(this, BluetoothSearchActivity.class));
            }
        } else if (id == R.id.nav_logout) {

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return false;
    }
}
