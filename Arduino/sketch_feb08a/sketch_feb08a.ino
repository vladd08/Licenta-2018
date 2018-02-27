#include <rdm630.h>
#include <SoftwareSerial.h>

unsigned long int previous = 0;
int redLed = 7;
int greenLed = 8;
int btRx = 10;
int btTx = 11;

SoftwareSerial BTSerial(btRx, btTx); // RX | TX
rdm630 rfid(2, 0);  //TX-pin of RDM630 connected to Arduino pin 2

void setup() {
  pinMode(redLed,OUTPUT);
  pinMode(greenLed,OUTPUT);
  
  Serial.begin(9600);  // start serial to PC
  while (!Serial) {
    ; 
  }
  BTSerial.begin(9600);
  rfid.begin();  
}

void loop() {
   byte data[6];
   byte length;
   BTSerial.listen();
   if(BTSerial.available())
   {
    Serial.write(BTSerial.read());
   }

   if(Serial.available())
   {
    BTSerial.write(Serial.read());
   }

   if(rfid.available()){
        rfid.getData(data,length);
        //concatenate the bytes in the data array to one long which can be 
        //rendered as a decimal number
        unsigned long result = 
          ((unsigned long int)data[1]<<24) + 
          ((unsigned long int)data[2]<<16) + 
          ((unsigned long int)data[3]<<8) + 
          data[4];    
        Serial.print("decimal CardID: ");
        Serial.println(result);
    }
}
