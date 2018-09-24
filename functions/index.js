/** Entry point for the cloud function.
* When the function is executed the request sent by Dialog flow
* I send as a parameter to the main function exported in this file.
*/

const { dialogflow, RegisterUpdate } = require('actions-on-google');
const functions = require('firebase-functions');
const {
  welcomeIntentHandler,
  handlePermissionIntentHandler,
  resetIntentHandler,
  welcomeIntentYesFollowUpHandler,
  instructionsYesFollowUpHandler,
  instructionsNoFollowUpHandler,
  finishUpdateSetupHandler,
} = require('./handlers');

const app = dialogflow({ debug: true });

app.intent('welcomeIntent', welcomeIntentHandler);
app.intent('permissionYesIntent', handlePermissionIntentHandler);
app.intent('resetIntent', resetIntentHandler);
app.intent('welcomeIntentYesFollowUp', welcomeIntentYesFollowUpHandler);
app.intent('instructionsYesFollowUp', instructionsYesFollowUpHandler);
app.intent('instructionsNoFollowUp', instructionsNoFollowUpHandler);
app.intent('finishUpdateSetup', finishUpdateSetupHandler);

exports.finSmartFunction = functions.https.onRequest(app);
