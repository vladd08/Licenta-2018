package licenta.orbulescu.vlad.smartoffice;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public interface IPermissionsInterface {
    int MY_PERMISSIONS_REQUEST_LOCATION = 99;

    void checkLocationPermission();
    void onRequestPermissionsResult(int requestCode,String permissions[], int[] grantResults);
    boolean checkLocationPermissionEnabled();
}
