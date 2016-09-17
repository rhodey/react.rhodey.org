var React       = require('react');
var ReactDOM    = require('react-dom');
var Router      = require('react-router').Router;
var Route       = require('react-router').Route;
var IndexRoute  = require('react-router').IndexRoute;
var hashHistory = require('react-router').hashHistory;
var Helmet      = require('react-helmet');

var BlogList  = require('./blog-list.js');
var BlogEntry = require('./blog-entry.js');


var App = React.createClass({
  render: function() {
    return (
      <div className="container">
        <Helmet title="rhodey.github.io"/>
        <div className="row">
          <div className="col-xs-2"/>
          <div className="col-xs-8">{this.props.children}</div>
          <div className="col-xs-2"/>
        </div>
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={BlogList} />
      <Route path="/blog/:entryId" component={BlogEntry} />
    </Route>
  </Router>
), document.getElementById("root"));
