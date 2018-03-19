using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.IO.Ports;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Smart_Office_Authenticator
{
    public partial class Authenticator : Form
    {
        private string Port;
        private const int BaudRate = 9600;
        private string ReceivedCode;
        public delegate void AddDataDelegate(String myString);
        public AddDataDelegate DataDelegate;
        public Authenticator()
        {
            InitializeComponent();
            serial = new SerialPort
            {
                BaudRate = BaudRate
            };
            DisconnectBttn.Enabled = false;
            generatedCodeBox.Enabled = false;
            receivedCodeBox.Enabled = false;
            GenerateBttn.Enabled = false;
            serial.DataReceived += new SerialDataReceivedEventHandler(Serial_DataReceived);
            DataDelegate = new AddDataDelegate(AddDataMethod);
        }

        private void AddDataMethod(String data)
        {
            receivedCodeBox.Text = data;
        }

        private void ConnectBttn_Click(object sender, EventArgs e)
        {
            if((Port = portBox.Text) != "")
            {
                serial.PortName = Port;
                try
                {
                    serial.Open();
                    serial.WriteLine("C"); //Connected
                    portBox.Enabled = false;
                    ConnectBttn.Enabled = false;
                    DisconnectBttn.Enabled = true;
                }
                catch(Exception ex)
                {
                    MessageBox.Show(ex.Message);
                }
            }
        }

        private void DisconnectBttn_Click(object sender, EventArgs e)
        {
            Disconnect();
        }

        private void Authenticator_FormClosing(object sender, FormClosingEventArgs e)
        {
            Disconnect();
        }

        protected void Disconnect()
        {
            if(serial.IsOpen)
            {
                serial.Write("D"); //Sends the signal to disconnect
                serial.Close();
                ConnectBttn.Enabled = true;
                portBox.Enabled = true;
                DisconnectBttn.Enabled = false;
                receivedCodeBox.Text = "";
                generatedCodeBox.Text = "";
                GenerateBttn.Enabled = false;
            }
        }

        private void Serial_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            ReceivedCode = serial.ReadExisting();
            receivedCodeBox.Invoke(DataDelegate, new Object[] { ReceivedCode });
        }

        private void ReceivedCodeBox_TextChanged(object sender, EventArgs e)
        {
            if(receivedCodeBox.Text != "")
            {
                GenerateBttn.Enabled = true;
            }
        }

        private void GenerateBttn_Click(object sender, EventArgs e)
        {
            generatedCodeBox.Enabled = true;
            var httpWebRequest = (HttpWebRequest)WebRequest.Create(@"https://smart-office-api.herokuapp.com/api/v1/users/login/2fa");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string json = "{\"userCardCode\":" + "\"" +
                                ReceivedCode + "\"}";

                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                var json = JObject.Parse(result);
                generatedCodeBox.Text = json["tfa token"].Value<string>();
            }
        }
    }
}
