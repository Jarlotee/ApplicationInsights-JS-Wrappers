# ApplicationInsights-JS-Wrappers

A commonjs library that extends Azure's [Application Insights] with wrapping functionality for window.onerror, console messages and custom functions.

### Installation

`npm install ApplicationInsights-JS-Wrappers --save`

### Usage


> Setup

```javascript

var wrappers = require("ApplicationInsights-JS-Wrappers");

/* Application Insights Snippt w/ your api key */

//Create an ApplicationInsightAggregator and pass in your initialized appInsights container
var insightAggregator = new wrappers.ApplicationInsightsAggregator(window.appInsights, 5);

//Append wrappers default or custom wrappers
insight.init([new wrappers.ConsoleWrapper(true), new wrappers.OnErrorWrapper()]);

//Save for later reuse
window.insightjs = insight;

```

> Options 

* Insight Aggregator takes an optional verbosity parameter (defaults to error)
 * See [Level] for more details
* All wrappers can take an optional parameter to rebroadcast the wrapped event, (default to false)



### Version
0.1.0

### License
MIT

[Application Insights]:https://github.com/Microsoft/ApplicationInsights-JS
[Level]:

