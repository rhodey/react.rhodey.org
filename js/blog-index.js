var React  = require('react');
var Link   = require('react-router').Link;
var marked = require('marked');
var Config = require('./config.js');

var BlogEntryListItem = React.createClass({
  getSummaryHtml: function() {
    return {
      __html : marked(("*" + this.props.entry.date + " -* ") + this.props.entry.summary)
    };
  },
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
            <span dangerouslySetInnerHTML={this.getSummaryHtml()}/>
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
  componentWillMount: function() {
    document.title = "rhodey.github.io";
  },
  render: function() {
    return (
      <div className="blogIndexBox">
        <BlogEntryList entries={Config.entries} />
      </div>
    );
  }
});


module.exports = BlogIndexBox;
