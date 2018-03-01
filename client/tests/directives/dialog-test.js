describe('dialog directive test', function() {

    var scope, compile, directiveElem;

  beforeEach(module('js/directives/dialog/dialog.html'));

    beforeEach(function () {
      angular.mock.module('app');
      angular.mock.inject(function ($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
      });
      directiveElem = getCompiledElement();
    });

    function getCompiledElement() {
      var element = jQuery('<dialog></dialog>');
      var compiledElement = compile(element)(scope);
      scope.$digest();
      return compiledElement;
    }

    it('should have a template', function() {
      scope.answeredOk();
      scope.answeredNo();
      scope.answeredYes();
      expect (directiveElem.html()).not.toEqual('');
    })
  }
  )

