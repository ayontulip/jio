module.exports.routes = {
    /**
     * Client section
    */
  'get /client': 'AuthController.clientLoginView',
  'post /client/login': 'AuthController.clientlogin',
  'get /client/logout': 'AuthController.clientlogout',
  'get /client/signup': 'AuthController.clientSignup',
  'post /client-save': 'UserController.clientsave',

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