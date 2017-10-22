
angular.module('user')
.service('userdata',['$http','$q', function($http, $q) {
    var users = null;
    var getUsersAsync = function() { 
    return	$http.get('http://localhost:3000/data/users.json').then(function(res) {
            users = res.data;
        });
    };
    var getUser = function(id) {
        return _.find(users,function(o) {
            return o.id == id;
        })
    };

    this.getUsers = function() {
        var def = $q.defer();

        if(users != null) 
            def.resolve(users);				
        else 
            getUsersAsync().then(function(){
                def.resolve(users);
            });

        return def.promise;
    };
    this.getUserWithId = function(id, callback) {
        var def = $q.defer();

        if(users != null)
            def.resolve(getUser(id));
        else
            getUsersAsync().then(function(){
                def.resolve(getUser(id));
            });

        return def.promise;
    };
}]);