# Abstract

The present repository holds the source code for the Voice-first application that will be build during the Voice Tech TO workshop at the [FutureMaker mega meetup](https://www.eventbrite.ca/e/futuremakers-mega-meetup-tickets-47830535419)

# Introduction

This code only contains the cloud function used for the fulfilment of the intents on the Action on Google created during the event.
The language model will be shared during the meetup, for more information feel free to reach out on the [Voice Tech TO slack](https://goo.gl/vLryPE)

# Setup

In order to use this cloud function, the sectin below will be a requirement.

## Google Developer Account

Developing on Google requires to have a Google developer account.

In order to get a Google developer account, you will need either a Gmail address or a Gapps mail address (In that case, you may need to request access from the system administrators of Gapps or your company).

With that email, you should go to https://console.developers.google.com and log in. You may be asked to accept Terms of service during that step, you would need to accept it to continue, please review it carefully.

## Google project

You will need to create a project in the Developer console.

You can do it by going to https://console.developers.google.com and on the right of the Google logo (located on the top left of the page), you can open the list of projects and find “New Project”.

## Firebase

You will need to go on https://console.firebase.google.com, log in and create a project by referencing the project that you previously created on https://console.developers.google.com.

#### Firebase Command Line Interface

[firebase-tools cli](https://github.com/firebase/firebase-tools) is an API to interact with Firebase from the command line.

Install firebase cli with the following command `npm install -g firebase-tools`
> Note: Node must be present on the machine.

You can setup by typing `firebase login` in a console. After logging in you can then use `firebase init`. Choose functions and say no to all the question in the setup.


# How To
Use `npm run build` to build the functions localy
Use `npm run deploy` the function.

