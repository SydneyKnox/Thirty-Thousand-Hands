/** Directive for rendering html into plain text */

angular.module('ng-htmlCompiler', [], function($compileProvider) {
      $compileProvider.directive('compile', function($compile) {
            // directive factory creates a link function
            return function(scope, element, attrs) {
                  scope.$watch(
                        function(scope) {
                              // watch the 'compile' expression for changes
                              return scope.$eval(attrs.compile);
                        },
                        function(value) {
                              // when the 'compile' expression changes
                              // assign it into the current DOM
                              element.html(value);

                              // compile the new DOM and link it to the current
                              // scope.
                              $compile(element.contents())(scope);
                        }
                  );
            };
      });
});
