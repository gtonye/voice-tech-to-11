# Abstract

This branch contains all the information for the lab II of the workshop.

# Introduction

In this step is described how to set up the fulfilment for an Action on Google Dialog flow agent.

The code is using node as an example, but many other languages are supported for cloud functions. More information on https://cloud.google.com/functions/docs/

# Description
```
- functions
-- handlers.js # all the intent handlers.
-- helpers.js # helpers method for the handlers.
-- index.js # entry point of the cloud function.
-- package.json
```

# Key concept in this lab

## External API

One of the external API used here is Google Maps, it needs an activated Geocoding API key.

## Function deployed variable

In `./functions/helpers.js`, `functions.config()` allow access to configuration variables.
The variables can be set with the command line `firebase functions:config:set`.
The configuration should be added in a file located in `./functions.env`. (it is used by the script `./deploy.sh`)
The format of the file is:
```
variable_name=variable_value
```

The variables will be accessed with `config.variable_name`.

More information on https://firebase.google.com/docs/functions/config-env
