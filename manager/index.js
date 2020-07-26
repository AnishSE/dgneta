module.exports = function(wagner) {
   	wagner.factory('UserManager', function() {
    	var UserManager = require('./UserManager');
    	return new UserManager(wagner);
  	});

  	wagner.factory('SubadminManager', function() {
    	var SubadminManager = require('./SubadminManager');
    	return new SubadminManager(wagner);
  	});

  	wagner.factory('AdminManager', function() {
    	var AdminManager = require('./AdminManager');
    	return new AdminManager(wagner);
  	});  	
}

