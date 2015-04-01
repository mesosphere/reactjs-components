/** @jsx React.DOM */

var React = require("react/addons");

var DropdownItem = React.createClass({

  displayName: "DropdownItem",

  propTypes: {
    type: React.PropTypes.string,
    className: React.PropTypes.string,
    value: React.PropTypes.string,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string
  },

  getDefaultProps: function () {
    return {
      value: "",
      selected: false,
      title: ""
    };
  },

  getButtonElement: function (classSet) {
    var props = this.props;

    /* jshint trailing:false, quotmark:false, newcap:false */
    /* jscs:disable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
    return (
      <button className={classSet}
          title={props.title}
          onClick={props.onClick}
          onBlur={props.onBlur}>
        <div>
          {this.props.children}
        </div>
      </button>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  getAnchorElement: function (classSet) {
    var props = this.props;

    return (
      <a className={classSet}
          title={props.title}
          onClick={props.onClick}
          onBlur={props.onBlur}>
        {this.props.children}
      </a>
    );
    /* jshint trailing:true, quotmark:true, newcap:true */
    /* jscs:enable disallowTrailingWhitespace, validateQuoteMarks, maximumLineLength */
  },

  render: function () {
    var props = this.props;
    var classes = {
      "selected": props.selected
    };

    if (props.className) {
      classes[props.className] = true;
    }

    var classSet = React.addons.classSet(classes);

    if (props.type === "button") {
      return this.getButtonElement(classSet);
    }

    return this.getAnchorElement(classSet);
  }
});

module.exports = DropdownItem;
