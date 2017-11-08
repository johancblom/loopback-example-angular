describe('category controller tests', function(){
  var $rootScope, scope, state, controller, categoryServiceMock, categoryMock, todoMock, findOneDeferred, queryDeferred, createDeferred, upsertDeferred, todoDeferred, deleteDeferred

  beforeEach(angular.mock.module('app'));

  beforeEach(angular.mock.inject(function(_$q_, $rootScope, $controller) {
    $q = _$q_;
    scope = $rootScope.$new();
    categoryServiceMock = {getCategories : function() {
      queryDeferred = $q.defer();
      return queryDeferred.promise;
    }};
    categoryMock = {
      find : function() {
        findOneDeferred = $q.defer();
        return {$promise: findOneDeferred.promise}
      },
      findOne : function (a, b, c) {
        findOneDeferred = $q.defer();
        if(b) {
          b();
        }
        return {$promise: findOneDeferred.promise};
      },
      create : function (a) {
        createDeferred = $q.defer();
        return {$promise: createDeferred.promise}
      },
      upsert : function (a) {
        upsertDeferred = $q.defer();
        console.log('in mock upsert');
        return {$promise: upsertDeferred.promise}
      },
      deleteById : function (a) {
        console.log('in deletebyId');
        deleteDeferred = $q.defer();
        return {$promise: deleteDeferred.promise}
      }
    };
    todoMock = {
      findOne : function (a) {
        console.log('in todo findOne');
        todoDeferred = $q.defer();
        return {$promise: todoDeferred.promise};
      }
    }

    controller = $controller('CategoryController', {
      $scope: scope,
      $state: state,
      Categories: categoryServiceMock,
      Category: categoryMock,
      Todo: todoMock
    });

    scope.categoryForm = {name: {$setValidity: function() {}, $setPristine: function() {}, $valid: true, $pristine: true}};

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


  it('getCategories should create the correct categories from the service', function() {

    scope.getCategories();

    findOneDeferred.resolve(['a']);
    scope.$apply();

    expect(scope.categories).toEqual(['a']);

  });

  it ('categoryExists should set the duplicate flag', function() {
    var form = scope.categoryForm;
    var name = form.name;
    spyOn(name, '$setValidity');

    scope.categoryExists();
    scope.$apply();

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

  it ('addCategory should interact with Category.findOne', function() {

    spyOn(categoryMock, 'findOne');

    scope.editedCategory = {name: 'abc'};

    scope.addCategory();

    expect (categoryMock.findOne).toHaveBeenCalled();
  })

  it ('addCategory should call categoryExists if category already exists', function() {
    spyOn(scope, 'categoryExists');
    var a, b;
    categoryMock.findOne(a, scope.categoryExists, b);
    scope.editedCategory = {name: 'abc'};

    scope.addCategory();
    expect (scope.categoryExists).toHaveBeenCalled();
  })

  it ('addCategory should call createCategory if category does not already exist', function() {
    spyOn(scope, 'createCategory');
    var a, b;
    categoryMock = {findOne : function (a, b, c) {
      console.log("returning: " + c);
      return c(); }
    }

    categoryMock.findOne(a, b, scope.createCategory);
    scope.editedCategory = {name: 'abc'};
    scope.addCategory();
    expect (scope.createCategory).toHaveBeenCalledWith();

  })

  it ('updateCategory should interact with Category.upsert', function(done) {
    var a = '';
    categoryMock.upsert = function(b) {
      expect(b).toEqual(a);
      upsertDeferred = $q.defer();
      done();
      return {$promise: upsertDeferred.promise};
    };

    scope.updateCategory(a);

  })

  it ('updateCategory should set form to pristine if successful', function() {

    var name = scope.categoryForm.name;
    spyOn(name, '$setPristine');

    scope.updateCategory();
    upsertDeferred.resolve('a');

    scope.$apply();
    expect (name.$setPristine).toHaveBeenCalled();


  })



  it('removeCategory should interact with findOne', function(done) {
    todoMock.findOne = function (b) {
        done();
        return {$promise: $q.defer().promise};
    };

    // scope.editedCategory = {name: 'abc'};

    scope.removeCategory('a');
  })

  it('removeCategory should raise an alert if a todo with that category exists', function() {
    spyOn(window, 'alert');
    scope.removeCategory('a');
    todoDeferred.resolve();

    scope.$apply();
    expect(window.alert).toHaveBeenCalled();
  })

  it('removeCategory should call Category.deleteById if a todo with that category does not exist', function(done) {
    categoryMock.deleteById  = function (a) {
      done();
      return {$promise: $q.defer().promise}
    };

    scope.removeCategory('a');
    todoDeferred.reject();

    scope.$apply();

  })

  it('removeCategory should update categories after deletion', function() {
    spyOn(scope, 'getCategories');
    scope.removeCategory('a');

    todoDeferred.reject();

    scope.$apply();
    deleteDeferred.resolve();
    scope.$apply();

    expect(scope.getCategories).toHaveBeenCalled();

  })

  it('startEdit should set editedCategory to the category', function() {
    scope.startEdit('a');
    expect(scope.editedCategory).toEqual('a');
  })

  it('cancelEdit should set the editedCategory to null', function() {
    scope.cancelEdit();
    expect(scope.editedCategory).toEqual(null);
  })

  it('cancelEdit should set the form name to pristine', function() {
    var name = scope.categoryForm.name;
    spyOn(name, '$setPristine');

    scope.cancelEdit();
    scope.$apply();

    expect (name.$setPristine).toHaveBeenCalled();

  })

  // $scope.inputChanged = function() {
  //   console.log('detected input change');
  //   Category.findOne(({filter: {'where': {'name': $scope.editedCategory.name}}}))
  //     .$promise
  //     .then(function() {
  //         $scope.categoryForm.name.$setValidity('duplicate', false);
  //       },
  //       function() {
  //         $scope.categoryForm.name.$setValidity('duplicate', true);
  //       });
  // }
  it('inputChanged should call findOne', function(done) {
    var b = function() {};
    categoryMock.findOne = function (a, b, c) {
        done();
        return {$promise: $q.defer().promise}
      }

    scope.editedCategory = {name: 'abc'};

    scope.inputChanged();

  })

  it('inputChanged should set validity of form.name to false when duplicate', function() {
    var name = scope.categoryForm.name;

    scope.editedCategory = {name: 'abc'};

    spyOn(name, '$setValidity');
    scope.inputChanged();

    findOneDeferred.resolve();

    scope.$apply();

    expect (name.$setValidity).toHaveBeenCalledWith(jasmine.anything(), false);

  })

  it('inputChanged should set validity of form.name to true when not duplicate', function() {
    var name = scope.categoryForm.name;

    scope.editedCategory = {name: 'abc'};

    spyOn(name, '$setValidity');
    scope.inputChanged();

    findOneDeferred.reject();

    scope.$apply();

    expect (name.$setValidity).toHaveBeenCalledWith(jasmine.anything(), true);

  })

});

