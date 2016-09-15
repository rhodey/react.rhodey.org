var React  = require('react');
var marked = require('marked');
var Ajax   = require('./ajax.js');


var BlogBox = React.createClass({
  loadMarkdown: function(filename) {
    Ajax.get(
      ("/md/" + filename),
      function(markdown) {
        this.setState({ __html : marked(markdown) });
      }.bind(this)
    );
  },
  getInitialState: function() {
    return { __html : "" };
  },
  componentWillMount: function() {
    this.loadMarkdown("radiowitness-1.md");
  },
  render: function() {
    return (
      <div className="blogBox">
        <div dangerouslySetInnerHTML={this.state} />
      </div>
    );
  }
});


module.exports = BlogBox;
