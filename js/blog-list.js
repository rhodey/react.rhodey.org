var React       = require('react');
var Link        = require('react-router').Link;
var CssTransGrp = require('react-addons-css-transition-group');
var marked      = require('marked');
var blogidx     = require('./blog-index.js');
var Ajax        = require('./ajax.js');

var TRANSITION_ENTER_MS = 300;
var EMOTI_INTERVAL      = 800;
var EMOTICONS           = [
  "o_o",     "0_o",        "o_0",
  "(>_<)",   "<(>_<)",     "(>_<)>",
  "(^_^)",   "<(^_^)",     "(^_^)>",
  "(*_*)",   "(;*_*)",     "(*_*;)",
  "(＠_＠)", "(;＠_＠)",   "(＠_＠;)",
  "(T_T)",   "(T-T)",      "(Ｔ▽Ｔ)",
  "(≧∇≦)",   "\\(≧∇≦)",    "(≧∇≦)/",
  "(◕ヮ◕)",  "\\(◕ヮ◕\\)", "(/◕ヮ◕)/",
  "(◠‿◠)",   "(✿◠‿◠)",     "(◠‿◠✿)",
  "（´ー｀）", "（´ー｀）┌", "ヽ（´ー｀）┌"
];


var BlogEntryMeta = React.createClass({
  render: function() {
    return (
      <div className="blogEntryMeta"><p>
        <span className="blogEntryDate row">
          {this.props.entry.date}
        </span>
        <span className="blogEntryEmoticon row">
          {this.props.emoticon}
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
  getInitialState: function() {
    return { cached : false };
  },
  fillCache: function() {
    if (this.state.cached === false) {
      this.setState({ cached : true });
    }
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (this.state.cached !== nextState.cached) {
      Ajax.get(this.props.entry.filename, function() {});
    }
  },
  render: function() {
    return (
      <div className="blogListItem" onMouseOver={this.fillCache}>
        <div className="row">
          <div className="col-xs-3">
            <BlogEntryMeta entry={this.props.entry} emoticon={this.props.emoticon} />
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
  cycleEmoticon: function() {
    var emotiIdx = this.state.emotiIdx + 1;
    var items    = Object.keys(blogidx).map(function(key, idx) {
      var emoticon = EMOTICONS[(emotiIdx - idx) % EMOTICONS.length];
      return <BlogListItem key={key} entry={blogidx[key]} emoticon={emoticon} />;
    }.bind(this));

    this.setState({
      items     : items,
      emotiIdx  : emotiIdx,
      timeoutId : setTimeout(this.cycleEmoticon, EMOTI_INTERVAL)
    });
  },
  getInitialState: function() {
    return {
      items     : [],
      timeoutId : -1,
      emotiIdx  : Math.floor(Math.random() * 100),
    };
  },
  componentDidMount: function() {
    this.cycleEmoticon();
  },
  componentWillUnmount: function() {
    clearTimeout(this.state.timeoutId);
  },
  render: function() {
    return (
      <div className="blogListBox">
        <CssTransGrp
          transitionName="blogList"
          transitionEnterTimeout={TRANSITION_ENTER_MS}
          transitionLeaveTimeout={0}
        >
          {this.state.items}
        </CssTransGrp>
      </div>
    );
  }
});


module.exports = BlogListBox;
