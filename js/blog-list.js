var React   = require('react');
var Link    = require('react-router').Link;
var marked  = require('marked');
var blogidx = require('./blog-index.js');


var BlogListItem = React.createClass({
  getSummaryHtml: function() {
    return {
      __html : marked(("*" + this.props.entry.date + " -* ") + this.props.entry.summary)
    };
  },
  render: function() {
    return (
      <div className="blogListItem">
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

var BlogListBox = React.createClass({
  render: function() {
    var items = Object.keys(blogidx).map(function(key) {
      return <BlogListItem key={key} entry={blogidx[key]} />;
    });

    return (
      <div className="blogListBox">
        <div className="row">
          <div className="col-xs-2"/>
          <div className="col-xs-8">
            {items}
          </div>
          <div className="col-xs-2"/>
        </div>
      </div>
    );
  }
});


module.exports = BlogListBox;
