var React    = require('react');
var Link     = require('react-router').Link;
var Helmet   = require('react-helmet');
var metatags = require('./meta-tags.js');


var Header = React.createClass({
  render: function() {
    return (
      <div className="header">
        <Helmet title=" " titleTemplate="%s rhodey.org" meta={metatags} />
        <h1><Link to="/">#rhodey.org</Link>
          <span className="headerLinks">
            <a href="https://github.com/rhodey"> github</a>
            <a href="mailto:rhodey@anhonesteffort.org"> email</a>
            <a href="https://radiowitness.org/"> radiowitness</a>
          </span>
        </h1>
        <div className="headerBorder"/>
      </div>
    );
  }
});


module.exports = Header;
