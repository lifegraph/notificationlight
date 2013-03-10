# Notification Light, a light that gets FB notifications

**What you’ll learn:** How to create a device that lights up when you get a new notification on Facebook

**What you'll need:**
* [A WiFly Module](https://www.sparkfun.com/products/10822) ($35)
* [An Arduino](https://www.sparkfun.com/products/11021) ($30)
* An LED
* A resistor (~500 ohms)

## Setting up the circuit
Wire up the LED in series with the resistor betweein Pin 12 and the ground pin of the Arduino. The [WiFly module can be attached to your Arduino by soldering to the TX/RX/VCC/GND pins](https://github.com/lifegraph/graphbutton-wifly#soldering-the-wifly-xbee-form-factor)

## The Arduino Code
Open up the httpclient.ino file. You need to put in your own network id and password in here

```ino
/* Change these to match your WiFi network */
const char mySSID[] = "your_ssid";
const char myPassword[] = "your_password";
```

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
