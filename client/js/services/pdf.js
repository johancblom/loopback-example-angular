angular.module('app').factory('PDFService', function() {
  function generate(todo) {
    if (todo == undefined) {
      var doc = new jsPDF();

      doc.text('Hello world!', 10, 10)
      doc.save('a4.pdf')
    } else {
      var doc = new jsPDF();
      doc.text(todo.content, 10, 10);
      doc.text(todo.category.name, 10, 20);
      doc.setFont('courier','italic');
      doc.text('blah', 30, 10);
      doc.rect(10, 50, 190, 200);
      doc.save('todo.pdf');
    }
  }
  return {
    generate: generate
  };
});
