var module = angular.module('myApp', []);
module.controller('userCtrl', function($scope) {
    $scope.fName = '';
    $scope.lName = '';
    $scope.passw1 = '';
    $scope.passw2 = '';
    $scope.users = [
        {id:1, fName:'Hege',  lName:"Pege" },
        {id:2, fName:'Kim',   lName:"Pim" },
        {id:3, fName:'Sal',   lName:"Smith" },
        {id:4, fName:'Jack',  lName:"Jones" },
        {id:5, fName:'John',  lName:"Doe" },
        {id:6, fName:'Peter', lName:"Pan" }
    ];
    $scope.edit = false;
    $scope.editId = undefined;
    $scope.error = false;
    $scope.incomplete = false; 
    
    
    
    $scope.editUser = function(id) {
        
      if (id == 'new') {
            $scope.edit = false;
            $scope.incomplete = true;
            $scope.fName = '';
            $scope.lName = '';
        } else {
            $scope.edit = true;
            $scope.editId = id;
            $scope.fName = $scope.users[id-1].fName;
            $scope.lName = $scope.users[id-1].lName; 
      }
    };
    
    $scope.$watch('passw1',function() {$scope.test();});
    $scope.$watch('passw2',function() {$scope.test();});
    $scope.$watch('fName', function() {$scope.test();});
    $scope.$watch('lName', function() {$scope.test();});
    
    $scope.test = function() {
      if ($scope.passw1 !== $scope.passw2) {
        $scope.error = true;
        } else {
        $scope.error = false;
      }
      $scope.incomplete = false;
      if ((!$scope.fName.length ||
      !$scope.lName.length ||
      !$scope.passw1.length || !$scope.passw2.length)) {
           $scope.incomplete = true;
      }
    };
    
    $scope.create = function(){
        if ($scope.edit)
        {
            var curUsr = $scope.users[$scope.editId-1];
            curUsr.fName = $scope.fName;
            curUsr.lName = $scope.lName;
        }else{
            $scope.users.push({
               id:$scope.users.length,
               fName:$scope.fName,
               lName:$scope.lName,
            });
        }
        
        $scope.debug = $scope.users.map(function(e){ return e.fName; }).join(',');
        
    };
    
    $scope.deleteUser = function(id){
      $scope.users.splice(id-1, 1);
      $scope.debug = $scope.users.length;
      //$scope.users[id-1].fName = '';
    };

});

module.directive('trR', function() {
  return {
      //restrict: 'AE',
      replace: 'true',
      templateUrl: 'templates/tr-user.html',
      link: function(scope, elem, attrs) {
          /*elem.find('button').bind('onclick', function(){ 
            //   scope.toggleClass('btn');
              alert(1);
          });
          */
          /*
          elem.bind('click', function() {
              
                elem.css('background-color', 'yellow');
                
                scope.$apply(function() {
                
                console.log(scope.users);
                //scope.color = "white";
            });
          });
          */
          elem.bind('mouseover', function() {
            //elem.css('cursor', 'pointer');
          });
        }
  };
});

module.directive('helloWorld', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      scope: { user: '@user'},
      template: '<h3>Hello {{user}}!!</h3>'
  };
});