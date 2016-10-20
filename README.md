# Angular Material Autocomplete Directive v1.0

This directive let you create an autocomplete suggestion box, if you're using angular material framework.
I hope this will save you some time.
Dont forget to copy the css.

## Dependencies
None



Load this directive with the following code:
```html
<script type="text/javascript" src="angular-material-autocomplete.js"></script>
```

Add a dependency to the module in your own module.
```js
var app = angular.module('ModuleName', ['angular-material-autocomplete']);
```

Use the directive in your HTML files with the following code:
```html
<m-auto-complete flex="80" layout="column" placeholder="Enter comment" suggestions="viewModel.autoCompleteSuggestionsArray" ng-model="viewModel.comment"></m-auto-complete>
```

### Parameters
- suggestions (array: required)
	suggestions array
- ng-model (required)


Take a look at index.html or [here](https://sonith.github.io/angular-material-autocomplete/) for a demo.


## License
You may use it however you want.
If you can, then leave the comment in js file as it is.