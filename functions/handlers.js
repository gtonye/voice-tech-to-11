/**Hold the code for all the handlers.
* A handler is a function which take as parameter the dialog flow
* request, and return an Action On Google compliant response.
*/

const _ = require('lodash');
const { Permission } = require('actions-on-google');

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
      'permissions': ['NAME']
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

  if (requestedPermissions.includes('NAME')) {
    const userName = _.get(conv, 'user.name.display');
    _.set(conv, 'user.storage.name', userName);

    return conv.ask(`Thank you so much ${userName}, would you like to check your credit score?`)
  }

  return conv.close('Unfortunately I will not be able to get your credit score without your name');
};

module.exports = {
  'welcomeIntentHandler': welcomeIntentHandler,
  'handlePermissionIntentHandler': handlePermissionIntentHandler,
  'resetIntentHandler': resetIntentHandler
};
