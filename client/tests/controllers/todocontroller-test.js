describe('todo controller tests', function(){
  var scope, state, controller, categoryMock, todoMock, findDeferred, findCategoryDeferred, createDeferred, findOneDeferred;

  beforeEach(angular.mock.module('app'));

  beforeEach(module('uiRouterNoop'));

  beforeEach(angular.mock.inject(function(_$q_, $rootScope, $controller) {
    $q = _$q_;
    scope = $rootScope.$new();
    todoMock = {
      findOne : function (a) {
        findOneDeferred = $q.defer();
        return {$promise: findOneDeferred.promise};
      },
      find : function() {
        findDeferred = $q.defer();
        return {$promise: findDeferred.promise};
      }
    }

    categoryMock = {
      find : function() {
        findCategoryDeferred = $q.defer();
        return {$promise: findDeferred.promise};
      },
      todos: {create: function() {
        console.log('in categoryMock.todos');
        createDeferred=$q.defer();
        return {$promise: createDeferred.promise};
       }}
    }

    scope.todoForm = {name: {$setValidity: function() {}, $setPristine: function() {}, $valid: true, $pristine: true}, content: {$setPristine: function() {}}};


    controller = $controller('TodoController', {
      $scope: scope,
      $state: state,
      Todo: todoMock,
      Category: categoryMock
    });

  }));

  it('should pass this canary test', function() {
    expect(true).toEqual(true);
  })
  it('categories should be empty on create', function() {
    expect(scope.todos).toEqual([]);
  });


  it('getTodos should interract with the Todo service', function() {

    spyOn(todoMock, 'find').and.callThrough();

    scope.getTodos();

    expect(todoMock.find).toHaveBeenCalled();

  });

  it('getTodos should set the todos in scope to the result of calling Todo service', function() {
    scope.getTodos();
    findDeferred.resolve([{id: 1, content: 'blah'}]);
    scope.$apply();
    expect(scope.todos.length).toBe(1);
    expect(scope.todos[0].id).toBe(1);
    expect(scope.todos[0].content).toBe('blah');
  })

  it('addTodo should set the new todo in scope', function() {
    scope.category = {id: 1};
    scope.newTodo = {content: 'abc'};

    scope.addTodo();
    createDeferred.resolve([{id: 1, content: 'abc'}]);
    findDeferred.resolve([{id: 1, content: 'abc'}]);

    scope.$apply();
    expect(scope.todos.length).toBe(1);
    expect(scope.todos[0].id).toBe(1);
    expect(scope.todos[0].content).toBe('abc');
  })


});

