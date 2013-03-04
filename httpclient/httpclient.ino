/*
 * Modified from WiFlyHQ Example httpclient.ino
 *
 * This sketch implements a simple Web client that connects to a 
 * web server, sends a GET, and then sends the result to the 
 * Serial monitor.
 *
 * This sketch is released to the public domain.
 *
 */

#include <WiFlyHQ.h>

#include <SoftwareSerial.h>
SoftwareSerial wifiSerial(2,3);

//#include <AltSoftSerial.h>
//AltSoftSerial wifiSerial(8,9);

WiFly wifly;

/* Change these to match your WiFi network */
const char mySSID[] = "your_ssid";
const char myPassword[] = "your_password";

//const char site[] = "arduino.cc";
//const char site[] = "www.google.co.nz";
const char site[] = "notificationbutton.herokuapp.com";
int light = 12; // define our light

void terminal();

void setup()
{
    char buf[32];
    boolean first = false;
    Serial.begin(9600);
    pinMode(light, OUTPUT);

    Serial.println("Starting");
    Serial.print("Free memory: ");
    Serial.println(wifly.getFreeMemory(),DEC);

    wifiSerial.begin(9600);
    if (!wifly.begin(&wifiSerial, &Serial)) {
        Serial.println("Failed to start wifly");
	terminal();
    }

    /* Join wifi network if not already associated */
    if (!wifly.isAssociated()) {
	/* Setup the WiFly to connect to a wifi network */
	Serial.println("Joining network");
	wifly.setSSID(mySSID);
	wifly.setPassphrase(myPassword);
	wifly.enableDHCP();

	if (wifly.join()) {
	    Serial.println("Joined wifi network");
	} else {
	    Serial.println("Failed to join wifi network");
	    terminal();
	}
    } else {
        Serial.println("Already joined network");
    }

    //terminal();

    Serial.print("MAC: ");
    Serial.println(wifly.getMAC(buf, sizeof(buf)));
    Serial.print("IP: ");
    Serial.println(wifly.getIP(buf, sizeof(buf)));
    Serial.print("Netmask: ");
    Serial.println(wifly.getNetmask(buf, sizeof(buf)));
    Serial.print("Gateway: ");
    Serial.println(wifly.getGateway(buf, sizeof(buf)));

    wifly.setDeviceID("Wifly-WebClient");
    Serial.print("DeviceID: ");
    Serial.println(wifly.getDeviceID(buf, sizeof(buf)));

    if (wifly.isConnected()) {
        Serial.println("Old connection active. Closing");
        wifly.close();
    }

    if (wifly.open(site, 80)) {
        Serial.print("Connected to ");
        Serial.println(site);
    } else {
        Serial.println("Failed to connect");
    }
}

void loop()
{
    first = true;
    if (wifly.available() > 0) {
	char ch = wifly.read();
	Serial.write(ch);
	if (ch == '\n') {
	    /* add a carriage return */ 
	    Serial.write('\r');
	}
        if (first) {
          if (atoi(ch) > 0) {
            // turn on the light
            digitalWrite(light, HIGH);
            
          } else {
            // turn off the light
            digitalWrite(light, HIGH);
          }
        }
        first = false;
    }
    
    // send off the get request
    wifly.println("GET /action/your_number HTTP/1.1"); // paste your number here
    
    delay(5000); // delay for a bit before we check again
}

/* Connect the WiFly serial to the serial monitor. */
void terminal()
{
    while (1) {
	if (wifly.available() > 0) {
	    Serial.write(wifly.read());
	}


	if (Serial.available() > 0) {
	    wifly.write(Serial.read());
	}
    }
}
