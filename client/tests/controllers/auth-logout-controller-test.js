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
      go: function(to) {}
    };

    controller = $controller('AuthLogoutController', {
      $scope: scope,
      AuthService: authServiceMock,
      $state: state
    });

  }));


  it('should set state to login when logout called', function() {
    spyOn(state, 'go').and.callThrough();

    deferred.resolve();


    scope.$apply();

    expect(state.go).toHaveBeenCalledWith('login');
  });
});

