var React       = require('react');
var ReactDOM    = require('react-dom');
var Router      = require('react-router').Router;
var Route       = require('react-router').Route;
var IndexRoute  = require('react-router').IndexRoute;
var hashHistory = require('react-router').hashHistory;

var BlogIndex = require('./blog-index.js');
var BlogEntry = require('./blog-entry.js');


var App = React.createClass({
  render: function() {
    return (
      <div className="container row">
        <div className="col-xs-2"/>
        <div className="col-xs-8">{this.props.children}</div>
        <div className="col-xs-2"/>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={BlogIndex} />
      <Route path="/entry/:entryId" component={BlogEntry} />
    </Route>
  </Router>
), document.getElementById("content"));
