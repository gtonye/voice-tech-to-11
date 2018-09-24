/** Hold the code for all the handlers.
* A handler is a function which take as parameter the dialog flow
* request, and return an Action On Google compliant response.
*/

const _ = require('lodash');
const {
  BasicCard,
  Button,
  Image,
  Permission,
  SimpleResponse,
  RegisterUpdate
} = require('actions-on-google');
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
      context: 'To retrieve your credit score',
      permissions: ['NAME', 'DEVICE_PRECISE_LOCATION'],
    }));
  }

  if (isFirstTimeUser) {
    _.set(conv, 'user.storage.isFirstTimeUser', false);
  } else {
    welcomeBackMessage = 'welcome back, ';
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
 * * */
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
    { score: 600, comment: 'I can help you increase it.' },
    { score: 800, comment: 'I can help you maintain that high score.' },
  ];

  const userCreditScore = CREDIT_SCORE_COMMENT[
    Math.floor(Math.random() * CREDIT_SCORE_COMMENT.length)
  ];
  return conv.ask(`Your score is ${userCreditScore.score}, ${userCreditScore.comment}. Would you like me to send instruction to your phone?`);
};

const instructionsYesFollowUpHandler = (conv) => {
  const card = {
    text: `Stay the course, because your excellent credit means you are headed in the right direction.  \n
    **Continue paying all your bills on time**. Setting up automated payments can help ensure you never miss a payment.  \n
    Stay on top of your credit utilization ratio by paying off credit card balances and keeping credit card accounts open,  \n
    even if you dont use them`,
    title: 'Keep your score high',
    buttons: new Button({
      title: 'Apply for a new credit card',
      url: 'http://voicetechglobal.com/',
    }),
    image: new Image({
      url: 'https://static.wixstatic.com/media/a2c2a1_7157b6ea1c024eb28ebc6e5b421192b1~mv2.png/v1/fill/w_830,h_252,al_c,usm_0.66_1.00_0.01/a2c2a1_7157b6ea1c024eb28ebc6e5b421192b1~mv2.png',
      alt: 'Logo Voice tech global',
    }),
    display: 'CROPPED',
  };
  conv.close(new SimpleResponse({
    speech: 'I have sent the instructions. Check your score again to see the impact.',
    text: '. Check your score again to see the impact',
  }));
  return conv.close(new BasicCard(card));
};


const instructionsNoFollowUpHandler = (conv) => {
  return   conv.ask(new RegisterUpdate({
    intent: 'scoreUpdate',
    frequency: 'ROUTINES'
  }));
};

const finishUpdateSetupHandler = (conv, params, registered) => {
  if (registered && registered.status === 'OK') {
    console.log('registered:', registered)
    return conv.close("Ok, I'm now part of your routine and will give you update if anything happens!");
   } else {
    return conv.close("Ok, I'm not part of your routine.");
   }

}

module.exports = {
  welcomeIntentHandler,
  handlePermissionIntentHandler,
  resetIntentHandler,
  welcomeIntentYesFollowUpHandler,
  instructionsYesFollowUpHandler,
  instructionsNoFollowUpHandler,
  finishUpdateSetupHandler
};
