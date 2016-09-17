var React    = require('react');
var Helmet   = require('react-helmet');
var metatags = require('./meta-tags.js');


var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <Helmet title="# rhodey.org" meta={metatags} />
        <h1># rhodey.org</h1>
        <div className="headerBorder"/>
      </div>
    );
  }
});


module.exports = Header;
