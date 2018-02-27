package licenta.orbulescu.vlad.smartoffice;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public class PermissionsModule implements IPermissionsInterface {
    private Context context;
    private Activity activity;

    public PermissionsModule(Context context, Activity activity) {
        this.context = context;
        this.activity = activity;
    }

    @Override
    //Requests the location permission
    public void checkLocationPermission() {
        //if ACCESS_FINE_LOCATION is not granted
        if (ContextCompat.checkSelfPermission(context,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            //then we request the permission
            ActivityCompat.requestPermissions(activity,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    MY_PERMISSIONS_REQUEST_LOCATION);
        }
    }

    @Override
    //Permission handler
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        ToasterService tService = new ToasterService();
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // permission was granted
                    if (ContextCompat.checkSelfPermission(context,
                            Manifest.permission.ACCESS_FINE_LOCATION)
                            == PackageManager.PERMISSION_GRANTED) {
                        //display a toast so the user knows everything is ok with the permission
                        tService.setMessage(activity.getString(R.string.location_permission_granted));
                        tService.DisplayToast(context,0);
                        tService = null;
                    }
                } else {
                    // permission denied.
                    tService.setMessage(activity.getString(R.string.location_permission_not_granted));
                    tService.DisplayToast(context,0);
                }
            }
        }
        tService = null;
    }

    @Override
    public boolean checkLocationPermissionEnabled() {
        if (ContextCompat.checkSelfPermission(context,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            return false;
        } else {
            return true;
        }
    }
}
