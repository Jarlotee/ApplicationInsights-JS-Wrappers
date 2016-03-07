# ApplicationInsights-JS-Wrappers

A commonjs library that extends Azure's [Application Insights] with wrapping functionality for window.onerror, console messages and custom functions.

### Installation

`npm install ApplicationInsights-JS-Wrappers --save`

### Usage


> Setup

```javascript

var wrappers = require("ApplicationInsights-JS-Wrappers");

/* Application Insights Snippet with your api key */

//Create an ApplicationInsightAggregator and pass in your initialized appInsights container
var aggregator = new wrappers.ApplicationInsightsAggregator(window.appInsights, 5);

//Append wrappers default or custom wrappers
aggregator.init([new wrappers.ConsoleWrapper(true), new wrappers.OnErrorWrapper()]);

//Save for later reuse
window.appInsightsAggregator = aggregator;

```

> Options 

* The aggregator takes an optional verbosity parameter (defaults to error)
 * See [Level] for more details
* All wrappers can take an optional parameter to rebroadcast the wrapped event, (default to false)

### Change Log
0.1.0 - Initial release
0.1.1 - Fixes a IE9 console binding error
0.1.2 - Fixes an infinite loop related to application insights generated console messages

### Version
0.1.2

### License
MIT

[Application Insights]:https://github.com/Microsoft/ApplicationInsights-JS
[Level]:https://github.com/Jarlotee/ApplicationInsights-JS-Wrappers/blob/master/src/ts/wrappers/Level.ts

