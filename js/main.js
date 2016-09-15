var React           = require('react');
var ReactDOM        = require('react-dom');
var Router          = require('react-router').Router;
var Route           = require('react-router').Route;
var IndexRoute      = require('react-router').IndexRoute;
var browserHistory  = require('react-router').browserHistory;

var BlogBox = require('./blog.js');


var App = React.createClass({
  render: function() {
    return (
      <div className="container row">
        <div className="col-xs-12">{this.props.children}</div>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={BlogBox} />
    </Route>
  </Router>
), document.getElementById("content"));
