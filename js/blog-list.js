var React   = require('react');
var Link    = require('react-router').Link;
var marked  = require('marked');
var blogidx = require('./blog-index.js');

var BlogEntryMeta = React.createClass({
  render: function() {
    return (
      <div className="blogEntryMeta"><p>
        <span className="blogEntryDate">
          {this.props.entry.date}
        </span>
      </p></div>
    );
  }
});

var BlogEntryGist = React.createClass({
  getSummaryHtml: function() {
    return {
      __html : marked(this.props.entry.summary)
    };
  },
  render: function() {
    return (
      <div className="blogEntryGist">
        <h2 className="row">
          <Link to={"/blog/" + this.props.entry.path}>{this.props.entry.title}</Link>
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

var BlogListItem = React.createClass({
  render: function() {
    return (
      <div className="blogListItem">
        <div className="row">
          <div className="col-xs-3">
            <BlogEntryMeta entry={this.props.entry} />
          </div>
          <div className="col-xs-9">
            <BlogEntryGist entry={this.props.entry} />
          </div>
        </div>
      </div>
    );
  }
});

var BlogListBox = React.createClass({
  render: function() {
    var items = Object.keys(blogidx).map(function(key) {
      return <BlogListItem key={key} entry={blogidx[key]} />;
    });

    return (
      <div className="blogListBox">
        {items}
      </div>
    );
  }
});


module.exports = BlogListBox;
