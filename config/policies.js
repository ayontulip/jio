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

  /**
   * viewer policies
   */

  ['DashboardController'] : {
    '*': ['isViewer']
  },

};
