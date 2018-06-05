#include <rdm630.h>

unsigned long int previous = 0;
int redLed = 7;
int greenLed = 8;

rdm630 rfid(3, 0);  //TX-pin of RDM630 connected to Arduino pin 2

void setup() {
  // put your setup code here, to run once:
  pinMode(redLed,OUTPUT);
  pinMode(greenLed,OUTPUT);
  Serial.begin(9600);
  rfid.begin();
  while(!Serial){
    ;
  }

}

void loop() {
  // put your main code here, to run repeatedly:
  byte data[6];
  byte length;

  if(Serial.available()) {
    char c = (char)Serial.read();
    if(c == 'C') {
      digitalWrite(greenLed,HIGH);
    } else if(c == 'D') {
      digitalWrite(greenLed,LOW);
    }
  }
   
  if(rfid.available()){
       rfid.getData(data,length);
       digitalWrite(redLed, HIGH);
       //concatenate the bytes in the data array to one long which can be 
       //rendered as a decimal number
       unsigned long result = 
         ((unsigned long int)data[1]<<24) + 
         ((unsigned long int)data[2]<<16) + 
         ((unsigned long int)data[3]<<8) + 
         data[4];    
       Serial.print(result);
       digitalWrite(redLed, LOW);
    }
}
