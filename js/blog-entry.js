var React  = require('react');
var marked = require('marked');
var Ajax   = require('./ajax.js');
var Config = require('./config.js');


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
      entry  : Config.entries[this.props.params.entryId],
      __html : ""
    };
  },
  componentWillMount: function() {
    document.title = this.state.entry.title;
    this.loadMarkdown();
  },
  render: function() {
    return (
      <div className="blogEntryBox">
        <h1>{this.state.entry.title}</h1>
        <div dangerouslySetInnerHTML={this.state} />
      </div>
    );
  }
});


module.exports = BlogEntryBox;
