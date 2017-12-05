describe('login controller tests', function () {
  var $rootScope, controller, scope, state, deferred, authServiceMock, messagingMock, eventsMock;

  beforeEach(angular.mock.module('app'));

  beforeEach(module('uiRouterNoop'));

  beforeEach(angular.mock.inject(function (_$q_, _$rootScope_, $controller) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();

    authServiceMock = {
      login: function () {
        deferred = $q.defer();
        return deferred.promise;
      },
      logout: function () {
        deferred = $q.defer();
        return deferred.promise;
      },
      register: function () {
        deferred = $q.defer();
        return deferred.promise;
      }
    };

    state = {
      current: {name: 'abc'},
      go: function(to) {}
    };

    messagingMock = {
      publish: function() {}
    };

    eventsMock = {
      message: {_CLEAR_NOTIFICATIONS_: null}
    }

    controller = $controller('AuthLoginController', {
      $scope: scope,
      AuthService: authServiceMock,
      $state: state,
      messaging: messagingMock,
      events: eventsMock
    });

  }));

  it('should pass this canary test', function () {
    expect(true).toEqual(true);
  });

  it('should interact with the login service', function () {

    spyOn(authServiceMock, 'login').and.callThrough();

    scope.login();

    expect(authServiceMock.login).toHaveBeenCalled();
  });

  it('should set state to todo when login succeeds', function() {

    spyOn(state, 'go').and.callThrough();

    scope.login();

    deferred.resolve();

    scope.$apply();

    expect(state.go).toHaveBeenCalledWith('todo');
  });

  it('should not alter state when login fails', function() {
    spyOn(state, 'go').and.callThrough();

    scope.login();

    deferred.reject();

    scope.$apply();

    expect(state.go).not.toHaveBeenCalled();
  });

  // $scope.register = function() {
  //   AuthService.register($scope.user.email, $scope.user.password)
  //     .then(function() {
  //       $state.go('login');
  //     }, function(err) {
  //       console.log('Error: ' + err);
  //     })
  // }

  it('should set state to login when register succeeds', function() {
    spyOn(state, 'go').and.callThrough();

    scope.register();

    deferred.resolve();

    scope.$apply();

    expect(state.go).toHaveBeenCalledWith('login');
  })

  it('should not set state to login when register fails', function() {
    spyOn(state, 'go').and.callThrough();

    scope.register();

    deferred.reject();

    scope.$apply();

    expect(state.go).not.toHaveBeenCalled();
  })

  // $scope.init = function() {
  //   if ($state.current.name == 'login' || $state.current.name == 'register') {
  //     messaging.publish(events.message._CLEAR_NOTIFICATIONS_);
  //   }
  // }

  it('init should publish CLEAR_NOTIFICATIONS message', function() {
    spyOn(messagingMock, 'publish');
    state.current.name = 'login';
    scope.init();
    expect(messagingMock.publish).toHaveBeenCalledWith(eventsMock.message._CLEAR_NOTIFICATIONS_);
  })

});

