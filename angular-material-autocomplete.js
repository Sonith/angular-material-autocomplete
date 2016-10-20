angular.module('angular-material-autocomplete', []).directive('mAutoComplete', mAutoComplete);

function mAutoComplete() {

  return {
	//only as an element
    restrict: 'E',

    require: 'ngModel',
    scope: {
      suggestions	:	'=',
      placeholder	:	'@',
      value			:	'=ngModel'
    },
    template: 	"<md-input-container class='remove-padding-margin' flex>" +
        		"	<label>{{placeholder}}</label>" +
        		"	<input class='text-input' ng-model='value'>"+
        		"</md-input-container>" +
        		"<div class='suggestions-overlay' ng-show='showSuggestions' layout-margin>" +
	        	"	<div ng-click='handleSelection(item)' ng-repeat='item in matchingSuggestions' ng-class=\"{'selected-border' : $index === selectedIndex}\" class='repeated-item' flex>" +
	        	"			{{item}}" +
	        	"		<md-divider ng-if='!$last'></md-divider>" +
	        	"	</div>" +
        		"</div>",
        		       		
    compile: function(tElement, attrs) {
		return {
			pre: function(scope, element, attrs){
				scope.matchingSuggestions = [];
				var sOverlay =  angular.element(element[0].querySelector('.suggestions-overlay'));
				
				sOverlay.css({'position' : 'absolute', 'z-index' : '99', 'margin' : '0px', 'background-color' : '#fafafa', 'overflow' : 'hidden', 'box-shadow' : '0 2px 5px rgba(0, 0, 0, 0.25)' });
				
			},
			post: function(scope, element, attrs){

				var textInput = angular.element(element[0].querySelector('.text-input'));
				var sOverlay = angular.element(element[0].querySelector('.suggestions-overlay'));
				var suggestionElements = sOverlay[0].querySelectorAll('.repeated-item');
				
				scope.selectedIndex = 0;
				
				textInput.bind('blur', function() {
			        setTimeout(function(){
			        	scope.showSuggestions = false;
			        }, 50);
				});

				textInput.bind('focus', function() {
			        setTimeout(function(){
			        	updateSuggestions();
			        }, 10);
				});
				
				textInput.bind('keyup', function(event) {
	                if (event.keyCode === 38) {
	                    event.preventDefault();
	                    if (scope.selectedIndex <= 0) return;
	                    scope.selectedIndex--;
	                    updateSuggestions(true);
	                } else {
	                	
	                	updateSuggestions(false);
	                }

	                return false;
	            });
				
				[textInput, sOverlay].forEach(function(element) {
					element.bind('mousewheel', function(e){
						suggestionElements = sOverlay[0].querySelectorAll('.repeated-item');

						e.preventDefault();
				        if (e.wheelDelta/120 > 0) {
		                    if (scope.selectedIndex <= 0) return;
		                    scope.selectedIndex--;
				        } else {
		                    if (scope.selectedIndex >= suggestionElements.length - 1) return;
		                    scope.selectedIndex++;
				        }
				        scope.$apply();
				        return;
				    });
				});

				textInput.bind('keydown', function(event) {
					if (event.keyCode === 38) {
						event.preventDefault();
					}
					suggestionElements = sOverlay[0].querySelectorAll('.repeated-item');
	                if (event.keyCode === 40) {
	                    event.preventDefault();
	                    if (scope.selectedIndex >= suggestionElements.length - 1) return;
	                    scope.selectedIndex++;
	                	updateSuggestions(true);
	                } else {
	                	
	                	updateSuggestions(false);
	                }
	                
	                return false;
	            });
				
				textInput.bind('keypress', function(event) {

					if (event.keyCode === 13) {
						event.preventDefault();
						event.stopPropagation();
						scope.handleSelection();
						return true;
					} else {
						updateSuggestions(false);
					}
	            });
			
				scope.handleSelection = function(item) {
					if (item === undefined) {
						// user hit enter
						if (scope.matchingSuggestions.length === 0) return;
						if (scope.selectedIndex >= 0) item = scope.matchingSuggestions[scope.selectedIndex];
					}
					// no match found!!??
					if (item === undefined) return;
					// we have a value for item, it is the item he clicked on or the item that was highlighted.
					var lastAt = scope.value.lastIndexOf('@');
					
					scope.value = scope.value.slice(0, lastAt + 1) + item + ' ';
					var len = scope.value.length;
					
					scope.selectedIndex = 0;
			        setTimeout(function(){
			        	textInput.focus();
			        	scope.showSuggestions = false;
			        	scope.$apply();
			        }, 20);
					
				};
								
				function updateSuggestions(focus) {
					
					var oldCount;
					var newCount = 0;
					var lastAtIndex = -1;
					
					var text = scope.value;
					if (text === undefined || text === ''	|| text.length === 0) {
						scope.matchingSuggestions = [];
						return;
					}
					
					var autoSearchText = '';
					lastAtIndex = text.lastIndexOf('@');
					if (lastAtIndex === -1) { scope.showSuggestions = false; return; }
					
					autoSearchText = text.substring(lastAtIndex + 1);
					
					if (autoSearchText.slice(-1) === ' ') { scope.showSuggestions = false; return; }
				
					scope.matchingSuggestions = scope.suggestions.filter(function(item) {
						return item.startsWith(autoSearchText);
					});
									
					newCount = scope.matchingSuggestions.length;
					if (newCount !== oldCount && oldCount !== undefined) {
						scope.selectedIndex = 0;
					}
					
					oldCount = newCount;
					if (scope.matchingSuggestions.length > 0 && lastAtIndex >=0 ) {
						scope.showSuggestions = true;
					} else {
						scope.showSuggestions = false;
					}
					sOverlay.css({'width' : textInput[0].clientWidth + 'px'});
					
					if (focus)
				        setTimeout(function(){
				        	textInput.focus();
							textInput[0].setSelectionRange(textInput[0].value.length, textInput[0].value.length);
				        }, 0);
					
					setTimeout(function() {
						scope.$apply();
					}, 0);
				}
		      	
				scope.$watch('value',  function(newVal, oldVal) {
					updateSuggestions();
				});
			}
		};
	}
    
  };
}