# Notification Light

a light that gets FB notifications

**What you’ll learn:** How to create a device that lights up when you get a new notification on Facebook

**What you'll need:**
* [A WiFly Module](https://www.sparkfun.com/products/10822) ($35)
* [An Arduino](https://www.sparkfun.com/products/11021) ($30)
* An LED
* A resistor (~500 ohms)

## Prerequisites

Completed the [hardware tutorial](https://github.com/lifegraph/hw-tutorial) and have a set up Arduino that can talk to the internet. 

## Making HTTP Requests

We'll be using [WiFlyHQ](https://github.com/harlequin-tech/WiFlyHQ) as our library for interfacing with the WiFly module. The setup of the library is covered in the [hardware tutorial](https://github.com/lifegraph/hw-tutorial).

We'll also be using the [Lifegraph Arduino library](https://github.com/lifegraph/arduino-lifegraph) along with the WiFlyHQ library. The Lifegraph library allows us to easily use Facebook's API without having to worry about properly formatting HTTP requests ourselves. The library also gives us a way to process the data that Facebook sends back to us.

In order to install the library, you'll need to:

1. [download the zip file here](https://github.com/lifegraph/arduino-lifegraph/archive/master.zip)
2. Unzip the file
3. Rename the folder from arduino-lifegraph-master to Lifegraph
4. Put the folder where the rest of your Arduino libraries are. This is probably underneath `~/Documents/Arduino/libraries`
5. Restart the Arduino IDE

Now open the Arduino IDE and you should see the Lifegraph library as an option when you go to Sketch -> Import Library

## The Arduino

Wire up the LED in series with the resistor betweein Pin 13 and the ground pin of the Arduino.

Then open up `notificationlight.ino` from the [notificationlight example in this repo](https://github.com/lifegraph/notificationlight/blob/master/notificationlight/notificationlight.ino). You'll need to change the network name and the password 

```ino
const char mySSID[] = "your_ssid";
const char myPassword[] = "your_password";
```

We'll also need an authentication token from Facebook in order to get the right notification information. For a temporary access token, follow these steps:

1. Go to the Graph API Explorer: [https://developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. request a token with "manage_notifications" and "publish_stream" permissions.

After you get your access token, you'll need to stick it in the `notificationlight.ino` as well:

```ino
const char access_token[] = "...";
```

However, these tokens expire every hour. In order to get a longer lasting token you'll need to make your own Facebook application and get an auth token from there.

## Further examples

* [GraphButton](https://github.com/lifegraph/graphbutton-wifly) - press the button and have it post a message to your Facebook
