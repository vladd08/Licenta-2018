package licenta.orbulescu.vlad.smartoffice;

import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.TextInputEditText;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import org.w3c.dom.Text;

import java.io.IOException;

public class ConfigureDeviceFragment extends Fragment implements View.OnClickListener {
    private EditText deviceName;
    private EditText devicePassword;
    private BluetoothModule module;
    private BluetoothDevice connectedDevice;
    private OnFragmentInteractionListener mListener;

    public ConfigureDeviceFragment() {
        // Required empty public constructor
    }

    // TODO: Rename and change types and number of parameters
    public static ConfigureDeviceFragment newInstance(String param1, String param2) {
        ConfigureDeviceFragment fragment = new ConfigureDeviceFragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_configure_device, container, false);
        Button cancelButton =  (Button) view.findViewById(R.id.button_cancel);
        Button configureButton =  (Button) view.findViewById(R.id.button_configure);
        deviceName = (EditText) view.findViewById(R.id.editName);
        devicePassword = (EditText) view.findViewById(R.id.editPass);
        cancelButton.setOnClickListener(this);
        configureButton.setOnClickListener(this);
        module = (BluetoothModule) getArguments().getSerializable("module");
        connectedDevice = module.getConnectedDevice();
        return view;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        module = new BluetoothModule(getActivity().getApplicationContext(), getActivity());
        if (context instanceof OnFragmentInteractionListener) {
            mListener = (OnFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    @Override
    public void onClick(View view) {
        switch(view.getId()) {
            case R.id.button_cancel: getActivity().onBackPressed(); break;
            case R.id.button_configure :
                try {
                    configureDevice();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                break;
        }
    }

    public void configureDevice() throws IOException {
        if(deviceName.getText().toString() != "" && devicePassword.getText().toString() != "") {
            module.sendData("AT");
        } else {
            ToasterService tService = new ToasterService();
            tService.setMessage(getString(R.string.fill_the_form));
            tService.DisplayToast(getContext(),0);
        }
    }

    @Override
    public void onActivityCreated(@Nullable Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);

    }

    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }
}
