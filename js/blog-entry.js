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
    return markdown.split('\n').slice(9).join('\n');
  },
  prependDate: function(markdown) {
    return "*" + this.state.entry.date + "* - " + markdown;
  },
  loadMarkdown: function() {
    Ajax.get(
      this.state.entry.filename,
      function(markdown) {
        this.setState({ entryHtml : marked(this.prependDate(this.chopHeader(markdown))) });
      }.bind(this)
    );
  },
  getInitialState: function() {
    return {
      entry      : blogidx[this.props.params.entryId],
      bannerHtml : marked(blogidx[this.props.params.entryId].banner),
      entryHtml  : ""
    };
  },
  componentWillMount: function() {
    marked.setOptions({highlight: function (code) { return highlight.highlightAuto(code).value; }});
    this.loadMarkdown();
  },
  render: function() {
    var items = [];
    if (this.state.entryHtml.length > 0) {
      items.push((
        <div key="hack">
          <h1>{this.state.entry.title}</h1>
          <div className="blogEntryBanner" dangerouslySetInnerHTML={{__html : this.state.bannerHtml}} />
          <div className="blogEntryMarkdown" dangerouslySetInnerHTML={{__html : this.state.entryHtml}} />
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
