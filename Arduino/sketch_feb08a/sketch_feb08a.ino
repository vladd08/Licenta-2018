#include <rdm630.h>
#include <SoftwareSerial.h>
#include <EEPROM.h>

unsigned long int previous = 0;
int redLed = 7;
int greenLed = 8;
int btRx = 10;
int btTx = 11;
char deviceName[11] = {'\0'};

int address = 0;
byte value;

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

//DEBUGGING 
//  for(int i = 0 ; i < EEPROM.length(); i ++) {
//    EEPROM.write(i,'\0');
//  }
  
  char firstEEChar = (char) EEPROM.read(address);
  if(firstEEChar != '\0') {
//    Serial.println("Nothing saved in EEPROM, retrieving the default device name...");
//    BTSerial.write("AT+NAME\r\n");
//  } else {
    Serial.println("Found a name saved in EEPROM, retrieving it...");
    readFromEEProm();
    char command[] = "AT+NAME";
    char dest[sizeof(command) + sizeof(deviceName)];
    strcpy(dest,command);
    strcat(dest,deviceName);
    strcat(dest,"\r\n");
    Serial.println("The command for setting the name is: ");
    Serial.println(dest);
    Serial.println("Setting up the name...");
    BTSerial.write(dest, sizeof(dest));
    
  }
}
void loop() {
   byte data[6];
   byte length;
   char content[20] = {'\0'};
   int j = 0;
   
   BTSerial.listen();

   if(BTSerial.available() > 0) {
    while(BTSerial.available() > 0) {
      char character = (char) BTSerial.read();
      if(character != '\0') {
        Serial.println("Character read: ");
        Serial.println(character);
        content[j] = character;
        Serial.println("Content is now: ");
        Serial.println(content);
        j++;
      }
    }
    Serial.println("Final content is: ");
    Serial.println(content);
    char *p = strstr(content, "+BLTE");
    if(p) {
      Serial.println("We have a response containing a name!");
      Serial.println("The name is:");
      char subString[10];
      int y = 0;
      //gets what is after '=', because the text command has this format : NAME = name
      for(int i = 6 ; i < strlen(content); i++)
      {
        subString[y] = content[i];
        y++;
      }
      subString[y] = '\0';
      Serial.println(subString);
//      Serial.println("Setting up device name...");
//      char command[] = "AT+NAME";
//      char dest[sizeof(subString) + sizeof(command)];
//      strcpy(dest,command);
//      strcat(dest,subString);
//      strcat(dest,"\r\n");
//      Serial.println("name changing command is: ");
//      Serial.println(dest);
//      BTSerial.write(dest,sizeof(dest));
//      Serial.println("Saving the name to EEPROM...");
      saveToEEProm(subString, strlen(subString));
    }
   }
   
   if(Serial.available()) {
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

void saveToEEProm(char arrayToSave[], int arrLen) {
  for(int i = 0 ; i < EEPROM.length() ; i++) {
    EEPROM.write(i,'\0');
  }
  
  Serial.print("Array length: ");
  Serial.print(arrLen);
  Serial.print(" kb");
  Serial.println("\n");
  Serial.println("We will write: ");
  Serial.println(arrayToSave);

  for(int i = 0 ; i < arrLen ; i++)
  {
    EEPROM.write(i,arrayToSave[i]);
  }
}

void readFromEEProm() {
  for(int i = 0 ; i < 10 ; i++) {
    char character = EEPROM.read(i);
    if(character != '\0') {
    deviceName[i] = character;
    }
  }
  Serial.println("The name found in EEPROM is: ");
  Serial.println(deviceName);
}

