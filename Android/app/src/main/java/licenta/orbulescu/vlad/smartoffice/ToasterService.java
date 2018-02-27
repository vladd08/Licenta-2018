package licenta.orbulescu.vlad.smartoffice;

import android.content.Context;
import android.widget.Toast;

/**
 * Created by Vlad Orbulescu on 2/27/2018.
 */

public class ToasterService {
    private String Message;
    ToasterService() {
    }

    public void DisplayToast(Context context, int length) {
        Toast.makeText(context,Message, length == 1 ? Toast.LENGTH_LONG : Toast.LENGTH_SHORT).show();
    }

    public void setMessage(String message) {
        Message = message;
    }
}
