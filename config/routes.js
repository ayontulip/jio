module.exports.routes = {
    /**
     * Client section
    */
  'get /client': 'AuthController.clientLoginView',
  'post /client/login': 'AuthController.clientlogin',
  'get /client/logout': 'AuthController.clientlogout',
  'get /client/signup': 'AuthController.clientSignup',
  'get /client/dashboard': 'client/DashboardController.index',


  '/': {
    view: 'homepage'
  },

  'get /login': {
       view: 'login'
  },
  'post /login': 'AuthController.login',

  '/logout': 'AuthController.logout',

  'get /signup': {
    view: 'signup'
  }


};