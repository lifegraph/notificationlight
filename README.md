# Notification Light, a light that gets FB notifications

**What you’ll learn:** How to create a device that lights up when you get a new notification on Facebook

**What you'll need:**
* [A WiFly Module](https://www.sparkfun.com/products/10822) ($35)
* [An Arduino](https://www.sparkfun.com/products/11021) ($30)
* An LED
* A resistor (~500 ohms)

## Setting up the circuit
Wire up the LED in series with the resistor betweein Pin 12 and the ground pin of the Arduino. The [WiFly module can be attached to your Arduino by soldering to the TX/RX/VCC/GND pins](https://github.com/lifegraph/graphbutton-wifly#soldering-the-wifly-xbee-form-factor)

## Making HTTP Requests

We'll be using [WiFlyHQ](https://github.com/harlequin-tech/WiFlyHQ) as our library for interfacing with the WiFly module. This allows us to talk to the WiFly over serial.

In order to setup WiFlyHQ, you'll need to download it to your Arduino libaries. On OSX this is typically in `~/Documents/Arduino/libaries/`. If you don't have a library folder, you'll need to make one. 

```
cd ~/Documents/Arduino/libraries;
git clone https://github.com/harlequin-tech/WiFlyHQ;
```

After you add the library, you'll need to restart the Arduino IDE for it to pick up the library. If you've added it in the right place, you should be able to see the WiFlyHQ library if you go to Sketch -> Import Library.

After you have the library working, you'll need to open up the [httpclient example in this repo](https://github.com/lifegraph/notificationlight/blob/master/httpclient/httpclient.ino) and open it up with the Arduino IDE. 

In `httpclient.ino`, you'll need to change the SSID (name of your network) and the password to work with your own WiFi network:

```ino
const char mySSID[] = "your_ssid";
const char myPassword[] = "your_password";
```

## The Arduino Code

Now we need to go to [http://notificationlight.herokuapp.com/](http://notificationlight.herokuapp.com/) and login via facebook. You'll see something like this

![notification light](https://raw.github.com/lifegraph/notificationlight/master/imgs/notificationlight.png)

Now copy and paste the action number into this line here

```ino
void getRequest() {
  wifly.println("GET /action/your_number HTTP/1.1"); // paste your number here
  ...
}
```

so it'll end up looking like

```ino
void getRequest() {
  wifly.println("GET /action/60ce6bdda1e131973c722d0906524b2ed24c44a6 HTTP/1.1");
  ...
}
```

Now save and load up httpclient.ino onto your Arduino. If you have 1 or more notifications, the light should turn on. The Arduino code continously checks for notifications so as soon as you don't have anymore, the light turns off.

## Running your own server

The source code for the GraphButton server is open source, so you can fork it and start your own. To clone the repository:

```
$ git clone https://github.com/lifegraph/notification-light
$ heroku create
$ heroku config:add HOST=<heroku host>
```

###Creating a Facebook app

1. Log into https://developers.facebook.com/apps. Click on `create a new application`. Name your application "Notification Light". 
2. Go to your new facebook application and add heroku's host name in the `Website with Facebook Login` field. 
3. Copy and paste the facebook app key and secret key into your Heroku configuration

```
$ heroku config:add FB_KEY=the key
$ heroku config:add FB_SECRET=the secret
```

## Want to learn more?

[Lifegraph Labs](http://www.lifegraphlabs.com) has [Tutorials](http://lifegraphlabs.com/how-to) to connect the real world with the digital, [Tools](http://lifegraphlabs.com/tools) to get you started quickly, and [Ideas](http://lifegraphlabs.com/ideas) of awesome things you could build right now. [Go there now!](http://www.lifegraphlabs.com) 
