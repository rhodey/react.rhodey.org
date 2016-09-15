var React  = require('react');
var Link   = require('react-router').Link;
var marked = require('marked');
var Config = require('./config.js');

var BlogEntryListItem = React.createClass({
  render: function() {
    return (
      <div className="blogEntryListItem">
        <h2 className="row">
          <Link to={"/entry/" + this.props.entry.id}>
            {this.props.entry.title}
          </Link>
        </h2>
        <div className="row">
          <p className="col-xs-12">
            <span className="entryDate">{this.props.entry.date} -</span> {this.props.entry.summary}
          </p>
        </div>
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
