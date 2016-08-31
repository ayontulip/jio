module.exports.routes = {
    /**
     * Client section
    */
  'get /client': 'AuthController.clientLoginView',
  'post /client/login': 'AuthController.clientlogin',
  'get /client/logout': 'AuthController.clientlogout',
  'get /client/signup': 'AuthController.clientSignup',
  'post /client-save': 'UserController.clientsave',
  'get /client/update-password': 'UserController.clientPasswordUpdate',
  'post /client/updatePassword': 'UserController.updatePassword',
  'get /client/forgot-password': 'UserController.clientForgotPassword',


  'get /forgot-password': 'UserController.forgotPassword',
  'post /forgot-password': 'UserController.forgotPasswordsubmit',
  'get /reset-password/:id/:tokon': 'UserController.resetPassword',
  'post /reset-password': 'UserController.resetPasswordsubmit',

  /**
   * Viewer section
   */

  'get /': 'HomeController.index',
  'get /signup': 'HomeController.signup',

  'get /auth/facebook': 'AuthController.facebook',
  'get /auth/facebook/callback': 'AuthController.facebook_callback',
  'post /login': 'AuthController.login',
  'post /viewer-save': 'UserController.viewerSave',

  '/logout': 'AuthController.logout',


};