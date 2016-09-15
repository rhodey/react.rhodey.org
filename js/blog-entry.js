var React  = require('react');
var marked = require('marked');
var Ajax   = require('./ajax.js');
var Config = require('./config.js');


var BlogEntryBox = React.createClass({
  loadMarkdown: function() {
    Ajax.get(
      this.state.entry.filename,
      function(markdown) {
        this.setState({ __html : marked(markdown) });
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
        <div dangerouslySetInnerHTML={this.state} />
      </div>
    );
  }
});


module.exports = BlogEntryBox;
