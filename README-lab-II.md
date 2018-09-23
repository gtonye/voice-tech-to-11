# Abstract

This branch contains all the information for the lab II of the workshop.

# Introduction

In this step is described how to set up the fulfilment for an Action on Google Dialog flow agent.

The code is using node as an example, but many other languages are supported for cloud functions. More information on https://cloud.google.com/functions/docs/

# Description
```
- functions
-- handlers.js # all the intent handlers
-- index.js # entry point of the cloud function
-- package.json
```

# Libraries

## Action On Google NPM

The npm package library [actions-on-google](https://www.npmjs.com/package/actions-on-google) provides APIs to build the fulfilment.

In this codebase we build a application using dialogflow , `const { dialogflow } = require('actions-on-google');`, but many other things are available.

Feel free to check the [documentation](https://actions-on-google.github.io/actions-on-google-nodejs/) for more information.

## Firebase Functions NPM

The npm package [firebase-functions](https://firebase.google.com/docs/functions/) provides the integration in Node with the cloud function.

## Lodash

the npm package [lodash](https://www.npmjs.com/package/lodash) provides a library to manipulate objects.

# Key concept in this lab

## Fulfilment

Once you deploy the function, it is available for usage in dialogflow. The url returned upon deployment can be set in the fulfilment tab of dialogflow.

Every intent saying with the response set on fulfilment will send the request to the cloud function

## Storage

Dialogflow conversation object encapsulate a storage engine that can be used in `conv.user.storage`. All the values stored there can be retrieved between requests.

#### Clear the storage

The storage can be cleared by [the user] or within the app (see resetHandler in ./functions/handler.js)

More documentation on the topic https://developers.google.com/actions/assistant/save-data#clear_content_of_the_userstorage_field

#### Logging

`console.log` and `console.error` are printing things in the log visible on firebase in the log section of the cloud function.
