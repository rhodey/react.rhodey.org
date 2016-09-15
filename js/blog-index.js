var React  = require('react');
var Link   = require('react-router').Link;
var marked = require('marked');
var Config = require('./config.js');

var BlogEntryListItem = React.createClass({
  render: function() {
    return (
      <div className="blogEntryListItem">
        title: {this.props.entry.title}, date: {this.props.entry.date}, summary: {this.props.entry.summary}
        <Link to={"/entry/" + this.props.entry.id}>check it</Link>
      </div>
    );
  }
});

var BlogEntryList = React.createClass({
  render: function() {
    var items = Object.keys(this.props.entries).map(function(key) {
      var entry = this.props.entries[key];
      entry.id  = key;
      return <BlogEntryListItem key={key} entry={entry} />;
    }.bind(this));

    return (
      <div className="blogEntryList">
        {items}
      </div>
    );
  }
});

var BlogIndexBox = React.createClass({
  render: function() {
    return (
      <div className="blogIndexBox">
        <BlogEntryList entries={Config.entries} />
      </div>
    );
  }
});


module.exports = BlogIndexBox;
