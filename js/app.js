var React          = require('react');
var ReactDOM       = require('react-dom');
var Router         = require('react-router').Router;
var Route          = require('react-router').Route;
var IndexRoute     = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
var Helmet         = require('react-helmet');

var BlogList  = require('./blog-list.js');
var BlogEntry = require('./blog-entry.js');
var metatags  = require('./meta-tags.js');


var App = React.createClass({
  render: function() {
    return (
      <div className="container">
        <Helmet title="rhodey.org" meta={metatags} />
        {this.props.children}
      </div>
    );
  }
});

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={BlogList} />
      <Route path="/blog/:entryId" component={BlogEntry} />
    </Route>
  </Router>
), document.getElementById("root"));
