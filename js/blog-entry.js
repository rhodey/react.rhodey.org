var React       = require('react');
var CssTransGrp = require('react-addons-css-transition-group');
var Helmet      = require('react-helmet');
var marked      = require('marked');
var highlight   = require('highlight.js');
var Ajax        = require('./ajax.js');
var blogidx     = require('./blog-index.js');

var TRANSITION_ENTER_MS = 300;


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
    var items = [];
    if (this.state.__html.length > 0) {
      items.push((
        <div>
          <h1>{this.state.entry.title}</h1>
          <div className="blogEntryMarkdown" key="hack" dangerouslySetInnerHTML={this.state} />
        </div>
      ));
    }

    return (
      <div className="blogEntryBox">
        <Helmet title={this.state.entry.title} />
        <CssTransGrp
          transitionName="blogEntry"
          transitionEnterTimeout={TRANSITION_ENTER_MS}
          transitionLeaveTimeout={0}
        >
          {items}
        </CssTransGrp>
      </div>
    );
  }
});


module.exports = BlogEntryBox;
