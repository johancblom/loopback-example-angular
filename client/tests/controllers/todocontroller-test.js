describe('todo controller tests', function(){
  var scope, state, controller, categoryMock, todoMock, findDeferred, findCategoryDeferred, createDeferred, findOneDeferred, deleteDeferred, updateDeferred, createDeferred, pdfServiceMock;

  beforeEach(angular.mock.module('app'));

  beforeEach(module('uiRouterNoop'));

  beforeEach(angular.mock.inject(function(_$q_, $rootScope, $controller) {
    $q = _$q_;
    scope = $rootScope.$new();
    todoMock = {
      create : function() {
        createDeferred = $q.defer();
        return {$promise: createDeferred.promise};
      },
      findOne : function (a) {
        findOneDeferred = $q.defer();
        return {$promise: findOneDeferred.promise};
      },
      find : function() {
        findDeferred = $q.defer();
        return {$promise: findDeferred.promise};
      },
      deleteById : function(id) {
        //just remove the only item that we inserted:
        scope.todos.pop();
        deleteDeferred = $q.defer();
        return {$promise: deleteDeferred.promise};
      },
      upsert: function(data) {
        updateDeferred = $q.defer();
        if (data.content != 'failure') {
          scope.todos = [{content: ''}];
          scope.todos[0].content = data.content;
        }
        return {$promise: updateDeferred.promise};
      }
    };
    pdfServiceMock = {
      generate: function(todo) {}
    }

    categoryMock = {
      find : function(a) {
        findCategoryDeferred = $q.defer();
        return {$promise: findCategoryDeferred.promise};
      }
    }

    scope.todoForm = {name: {$setValidity: function() {}, $setPristine: function() {}, $valid: true, $pristine: true}, content: {$setPristine: function() {}}};


    controller = $controller('TodoController', {
      $scope: scope,
      $state: state,
      Todo: todoMock,
      Category: categoryMock,
      PDFService: pdfServiceMock
    });

  }));

  it('should pass this canary test', function() {
    expect(true).toEqual(true);
  });

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
  });

  it('createTodo should set the new todo in scope', function() {
    scope.category = {id: 1, todos: []};
    scope.editedTodo = {content: 'abc'};

    scope.createTodo();
    createDeferred.resolve([{id: 1, content: 'def'}]);
    findDeferred.resolve([{id: 1, content: 'abc'}]);

    scope.$apply();
    expect(scope.todos.length).toBe(1);
    expect(scope.todos[0].id).toBe(1);
    expect(scope.todos[0].content).toBe('abc');
  });

  it('removeTodo should remove the todo from scope', function() {
    scope.todos = [{id: 1, content: 'blah'}];
    scope.removeTodo(1);
    deleteDeferred.resolve();
    scope.$root.$digest();
    expect(scope.todos.length).toBe(0);
  });

  it('updateTodo should set a todo to a new value', function() {
    scope.editedTodo = {id: 1};
    scope.category = {id: 1};
    scope.todos = [{id: 1, content: 'blah'}];
    item = {content: 'bleh'};
    scope.updateTodo(item);
    updateDeferred.resolve();
    scope.$root.$digest();
    expect(scope.todos[0].content).toBe('bleh');
  });

  it('updateTodo should not set a todo to a new value when upsert fails', function() {
    scope.editedTodo = {id: 1};
    scope.category = {id: 1};
    scope.todos = [{id: 1, content: 'blah'}];
    item = {content: 'failure'};
    scope.updateTodo(item);
    updateDeferred.reject();
    scope.$root.$digest();
    expect(scope.todos[0].content).toBe('blah');
  });

  it('startEdit should set editedCategory to the category', function() {
    scope.startEdit({category: {name: 'a'}});
    expect(scope.editedTodo).toEqual({category: {name: 'a'}});
  });

  it('cancelEdit should set the editedCategory to null', function() {
    scope.cancelEdit();
    expect(scope.editedTodo).toEqual(null);
  });

  it('cancelEdit should set the category to null', function() {
    scope.category = {a: 'a'};
    scope.editedTodo = {b: 'b'};
    scope.cancelEdit();

    expect (scope.category).toBeNull();
    expect (scope.editedTodo).toBeNull();

  });


  it('canEdit should return true if item owner is current user', function() {
    var item = {ownerId: 1};
    scope.currentUser = {id: 1};
    expect (scope.canEdit(item)).toEqual(true);
  })

  it('canEdit should return false if item owner is not current user', function() {
    var item = {ownerId: 1};
    scope.currentUser = {id: 2};
    expect (scope.canEdit(item)).toEqual(false);
  });

  it('generatePDF should interact with the PDFService', function() {
    spyOn(pdfServiceMock, 'generate');
    var todo = {};
    scope.generatePDF(todo);
    expect (pdfServiceMock.generate).toHaveBeenCalled();
  });

  it('findAvailableCategories should set available categories in the scope', function() {
    scope.findAvailableCategories();
    findCategoryDeferred.resolve([{todos: {length: 0}}, {todos: {length: 0}}]);
    scope.$root.$digest();
    expect(scope.availableCategories.length).toBe(2);
  });

  it('findAvailableCategories should set no available categories in the scope if there arent any', function() {
    scope.findAvailableCategories();
    findCategoryDeferred.resolve([{todos: {length: 1}}]);
    scope.$root.$digest();
    expect(scope.availableCategories.length).toBe(0);
  })
});

