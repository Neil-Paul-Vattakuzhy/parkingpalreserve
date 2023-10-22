
#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>
#include<String.h>
//
const char* ssid = "Light_2.4G";
const char* password = "naresh2003";
//const char* ssid = "Neil Phone";
//const char* password = "neilpaul15";


//int indx[]={1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20};
char ver[]={'g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g','g'};
#define STRMAX 100



int ledState = LOW;             
long previousMillis = 0;        
long interval = 2000; 

WebSocketsServer webSocket = WebSocketsServer(81);

int findint(char x)
{
  switch(x){
    case '0': return 0;
    break;
    case '1': return 1;
    break;
    case '2': return 2;
    break;
    case '3': return 3;
    break;
    case '4': return 4;
    break;
    case '5': return 5;
    break;
    case '6': return 6;
    break;
    case '7': return 7;
    break;
    case '8': return 8;
    break;
    case '9': return 9;
    break;
    default : return NULL;
  }
  
}

String converter(uint8_t *str){
    return String((char *)str);
}

void updateslots(String got)
{
  int num=(findint(got[1])*10)+findint(got[2]);
  int zone=0;
  if(got[0]=='c')
  {
    zone=10;
    ver[zone+num-1]=got[3];
              
  }
  else
  {
    zone=0;
    ver[zone+num-1]=got[3];
  }
  
}

void sendslotdata()
{
  char* msg=ver;
  webSocket.broadcastTXT(msg, sizeof(ver));
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
      break;
    case WStype_CONNECTED:
      {
        
        
        IPAddress ip = webSocket.remoteIP(num);
        Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
        sendslotdata();
        

      }
      break;
    case WStype_TEXT:
      {
        Serial.printf("[%u] Received text: %s\n", num, payload);
        String got=converter(payload);
        updateslots(got);     
           
      }
      

      // You can handle incoming WebSocket messages here
      // For example, you can send a response:
      
      break;
  }
}

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  pinMode(D4,OUTPUT);

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(D4,HIGH);
    delay(500);
    digitalWrite(D4,LOW);
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.println("Connected to WiFi:");
  Serial.println(WiFi.localIP());

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

void loop() {
  webSocket.loop();
  
  unsigned long currentMillis = millis();
  
  if(currentMillis - previousMillis > interval) {
      // save the last time you blinked the LED 
      previousMillis = currentMillis;   

      // if the LED is off turn it on and vice-versa:
      if (ledState == LOW)
        ledState = HIGH;
      else
        ledState = LOW;

      // set the LED with the ledState of the variable:
    digitalWrite(D4, ledState);
  }
  
  
}