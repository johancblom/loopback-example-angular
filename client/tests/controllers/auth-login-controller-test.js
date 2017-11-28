describe('login controller tests', function () {
  var $rootScope, controller, scope, state, deferred, authServiceMock;

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

    controller = $controller('AuthLoginController', {
      $scope: scope,
      AuthService: authServiceMock,
      $state: state
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

});

