describe('category controller tests', function(){
  var $rootScope, scope, controller, categoryServiceMock, categoryMock, findOneDeferred;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function(_$q_, $rootScope, $controller) {
    $q = _$q_;
    scope = $rootScope.$new();
    categoryServiceMock = {getCategories : function() {
      queryDeferred = $q.defer();
      return queryDeferred.promise;
    }};
    categoryMock = {findOne : function (a, b, c) {
      return b();
    }};
    controller = $controller('CategoryController', {
      $scope: scope,
      Categories: categoryServiceMock,
      Category: categoryMock
    });
  }));

  // beforeEach(function() {
  //   queryDeferred.resolve(['a']);
  //   scope.$apply();
  // });

  it('should pass this canary test', function() {
    expect(true).to.be.true;
  })
  it('categories should be empty on create', function() {
    expect(scope.categories).to.be.eql([]);
  });
  it('getCategories should interact with the service', function(done) {
    categoryServiceMock.getCategories = function() {
      done();
    }

    scope.getCategories();
  });

  it('getCategories should create the correct categories from the service', function() {

    scope.getCategories();

    queryDeferred.resolve(['a']);
    scope.$apply();

    expect(scope.categories).to.be.eql(['a']);

  });

  it('addCategory should set the duplicate flag if category already exists', function () {



    scope.editedCategory = {name: 'abc'};
    scope.categoryForm = {name: {$setValidity: function() {}}};
    scope.$apply();

    scope.addCategory();

    scope.$apply();

    expect(scope.categoryForm.name.$setValidity).to.be.called;
  })
});

