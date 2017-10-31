describe('category controller tests', function(){
  var $rootScope, scope, controller, categoryServiceMock, categoryMock, findOneDeferred, queryDeferred, createDeferred;

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function(_$q_, $rootScope, $controller) {
    $q = _$q_;
    scope = $rootScope.$new();
    categoryServiceMock = {getCategories : function() {
      queryDeferred = $q.defer();
      return queryDeferred.promise;
    }};
    categoryMock = {
      findOne : function (a, b, c) {
        console.log("returning: " + b);
        return b();
      },
      create : function (a) {
        createDeferred = $q.defer();
        return {$promise: createDeferred.promise}
      }
    };
    controller = $controller('CategoryController', {
      $scope: scope,
      Categories: categoryServiceMock,
      Category: categoryMock
    });

    scope.categoryForm = {name: {$setValidity: function() {}, $setPristine: function() {}, $valid: true}};

  }));


  // beforeEach(function() {
  //   queryDeferred.resolve(['a']);
  //   scope.$apply();
  // });

  it('should pass this canary test', function() {
    expect(true).toEqual(true);
  })
  it('categories should be empty on create', function() {
    expect(scope.categories).toEqual([]);
  });
  it('getCategories should interact with the service', function(done) {
    categoryServiceMock.getCategories = function() {
      queryDeferred = $q.defer();
      done();
      return queryDeferred.promise;
    }

    scope.getCategories();
  });

  it('getCategories should create the correct categories from the service', function() {

    scope.getCategories();

    queryDeferred.resolve(['a']);
    scope.$apply();

    expect(scope.categories).toEqual(['a']);

  });

  it ('categoryExists should set the duplicate flag', function() {
    var form = scope.categoryForm;
    var name = form.name;
    spyOn(name, '$setValidity');

    scope.categoryExists();
    scope.$apply();

    debugger;
    expect (name.$setValidity).toHaveBeenCalled();

  })

  it ('createCategory should call categoryForm.name.$setPristine if successful', function() {
    var form = scope.categoryForm;
    var name = form.name;
    spyOn(name, '$setPristine');

    scope.createCategory();

    createDeferred.resolve();
    scope.$apply();

    expect (name.$setPristine).toHaveBeenCalled();
  })
});

