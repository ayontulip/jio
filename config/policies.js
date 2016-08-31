module.exports.policies = {

  '*':  ['passport'],

  /**
   * client policies
   */

  ['client/DashboardController'] : {
    '*': ['isClient']
  },

  'PostController' : {
    '*': ['isClient']
  },

  'UserController' : {
    clientPasswordUpdate: ['isClient'],
    updatePassword: ['isClient'],
  },

  /**
   * viewer policies
   */

  ['DashboardController'] : {
    '*': ['isViewer']
  },

};
