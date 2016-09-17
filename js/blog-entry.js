var React     = require('react');
var Helmet    = require('react-helmet');
var marked    = require('marked');
var highlight = require('highlight.js');
var Ajax      = require('./ajax.js');
var blogidx   = require('./blog-index.js');


var BlogEntryBox = React.createClass({
  chopHeader: function(markdown) {
    return markdown.split('\n').slice(6).join('\n');
  },
  loadMarkdown: function() {
    Ajax.get(
      this.state.entry.filename,
      function(markdown) {
        this.setState({ __html : marked(this.chopHeader(markdown)) });
      }.bind(this)
    );
  },
  getInitialState: function() {
    return {
      entry  : blogidx[this.props.params.entryId],
      __html : ""
    };
  },
  componentWillMount: function() {
    marked.setOptions({highlight: function (code) { return highlight.highlightAuto(code).value; }});
    this.loadMarkdown();
  },
  render: function() {
    return (
      <div className="blogEntryBox">
        <Helmet title={this.state.entry.title} />
        <h1>{this.state.entry.title}</h1>
        <div dangerouslySetInnerHTML={this.state} />
      </div>
    );
  }
});


module.exports = BlogEntryBox;
