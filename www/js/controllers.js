angular.module('freeCoderApp')

  .controller('DashCtrl', function ($scope) {
  })

  .controller('TodoCtrl', ['$scope', '$rootScope', '$state', 'Member', function ($scope, $rootScope, $state, Member) {

    $scope.uiFlag = {isShowDelete: false, isShowReorder: false, isCanSwipe: true};

    $scope.getTasks = function () {
      Member.tasks({
        id: Member.getCurrentId(),
        filter: {order: 'order DESC'}
      }).$promise.then(function (data, respHeaders) {
          $scope.tasks = data;
          //checkTasksCount();
        }, function (errResp) {
          //alertRequestError(errResp);
        });
    };

    $scope.reorderItem = function (item, fromIndex, toIndex) {
      //Move the item in the array
      $scope.tasks.splice(fromIndex, 1);
      $scope.tasks.splice(toIndex, 0, item);
    };

    $scope.deleteTask = function (idx) {
      $scope.tasks.splice(idx, 1);
    };

    $scope.editTask = function(idx) {
      console.log('editTask()');
    };

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function (e) {
      console.log('todoCtrl, sessionInfo: %o', $rootScope.sessionInfo);
      if (!$rootScope.sessionInfo) {
        $state.go('^.account');
      } else {
        $scope.getTasks();
      }
    });
  }])

  .controller('PomodoroCtrl', ['$scope', '$rootScope', '$state', 'Member', function ($scope, $rootScope, $state, Member) {

  }])

  .controller('AccountCtrl', ['$scope', '$rootScope', 'Member', 'messagesContext', function ($scope, $rootScope, Member, messagesContext) {
    $scope.uiText = {};
    $scope.member = {email: 'jiting@outlook.com', password: 'P@ss123'};

    $scope.login = function () {
      if (!$scope.member || !$scope.member.email || !$scope.member.password) {
        return;
      }

      Member.login({rememberMe: $scope.rememberMe}, $scope.member).$promise.then(function (data) {
        if (!data.user.emailVerified) {
          Member.logout();
          $scope.uiText.error = {message: messagesContext.get('user.login.email.not.verified')};
        } else {
          $scope.uiText.error = undefined;
          $scope.uiText.success = {message: 'Login Success.'};
          $rootScope.sessionInfo = data.user;
          //$state.go('tab.todo');
        }
      }, function (error) {
        $scope.uiText.error = {message: error && error.status == '401' ? error.data.error.message : messagesContext.get('common.error.unknown')};
      });
    }
  }]);
