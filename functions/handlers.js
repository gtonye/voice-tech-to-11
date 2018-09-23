/**Hold the code for all the handlers.
* A handler is a function which take as parameter the dialog flow
* request, and return an Action On Google compliant response.
*/

const _ = require('lodash');
const { Permission } = require('actions-on-google');
const { getAddressFromLatLon } = require('./helpers');

/**
* @param {object} conv an Action on Google conversation request.
* @return {object} an Action on Google conversation response.
*
* The handler will check if a user name is available in the storage
* and request for permission if not. Otherwise it will greet the user
* with the user name.
*/
const welcomeIntentHandler = (conv) => {
  const userName = _.get(conv, 'user.storage.name');
  const isFirstTimeUser = _.get(conv, 'user.storage.isFirstTimeUser');
  let welcomeBackMessage = '';

  if (_.isEmpty(userName)) {
    return conv.ask(new Permission({
      'context': 'To retrieve your credit score',
      'permissions': ['NAME', 'DEVICE_PRECISE_LOCATION']
    }));
  }

  if (isFirstTimeUser) {
  	_.set(conv, 'user.storage.isFirstTimeUser', false);
  } else {
  	welcomeBackMessage = 'welcome back, '
  }

  return conv.ask(`Hi ${userName}, ${welcomeBackMessage}would you like to check your credit score?`);
};

/**
* @param {object} conv an Action on Google conversation request.
* @return {object} an Action on Google conversation response.
*
* Handle the voice command to reset the user data.
*/
const resetIntentHandler = (conv) => {
  _.set(conv, 'user.storage', {});

  return conv.close('Ok, done.');
};

/**
 * Handle all the action requests for permission.
 * @param {object} conv the Google conversation object.
 * @param {object} params.
 * @param {boolean} permissionGranted.
 * **/
const handlePermissionIntentHandler = (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    throw new Error('Permission not granted');
  }

  const requestedPermissions = _.get(conv, 'request.user.permissions');
  console.log('requested permissions', _.get(conv, 'request.user'));

  if (requestedPermissions.includes('NAME') && requestedPermissions.includes('DEVICE_PRECISE_LOCATION')) {
    const userName = _.get(conv, 'user.name.display');
    const coordinates = _.get(conv, 'device.location.coordinates', {});

    return getAddressFromLatLon(coordinates.latitude, coordinates.longitude)
      .then((userAddress) => {
        _.set(conv, 'user.storage.name', userName);
        _.set(conv, 'user.storage.address', userAddress);
        _.set(conv, 'user.storage.isFirst', true);
        return conv.ask(`Thank ${userName} at ${userAddress}, would you like to check your credit score?`);
      })
      .catch(() => {
        conv.close('Unfortunately I will not be able to get your credit score with the name and address specified');
      });
  }

  return conv.close('Unfortunately I will not be able to get your credit score without your name');
};

/**
* @param {object} conv an Action on Google conversation request.
* @return {object} an Action on Google conversation response.
*
* Handle when the user says yes after being asked 'do you want to check your credit score'.
*/
const welcomeIntentYesFollowUpHandler = (conv) => {
  // The line below could be replaced with a call to an API
  // passing conv.user.storage.name and conv.user.storage.address
  // to retrieve a person credit score.
  const CREDIT_SCORE_COMMENT = [
    {'score': 600, 'comment': 'I can help you increase it.'},
    {'score': 800, 'comment': 'I can help you maintain that high score.'}
  ];

  const userCreditScore = CREDIT_SCORE_COMMENT[Math.floor(Math.random() * CREDIT_SCORE_COMMENT.length)];
  return conv.ask(`Your score is ${userCreditScore.score}, ${userCreditScore.comment}. Would you like me to send instruction to your phone?`);
};

module.exports = {
  'welcomeIntentHandler': welcomeIntentHandler,
  'handlePermissionIntentHandler': handlePermissionIntentHandler,
  'resetIntentHandler': resetIntentHandler,
  'welcomeIntentYesFollowUpHandler': welcomeIntentYesFollowUpHandler
};
