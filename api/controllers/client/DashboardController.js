/**
 * client/DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    index: function (req, res) {
        return res.view('client/dashboard');
    },
};

