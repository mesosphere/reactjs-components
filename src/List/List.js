var React = require('react');
var classNames = require('classnames');
var _ = require('underscore');

var ListItem = require('./ListItem');
var ListItemGroup = require('./ListItemGroup');

var List = React.createClass({
  displayName: 'List',

  propTypes: {
    className: React.PropTypes.string,
    items: React.PropTypes.array.isRequired,
    tag: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      className: ''
    }
  },

  getListItems: function(list, childIndex) {
    var that = this;
    var childIndex = childIndex || 0;

    var items = list.map(function(item, parentIndex) {
      var key = parentIndex + '.' + childIndex;
      childIndex++;

      if (item.items) {
        return (
          <ListItemGroup key={key} tag={item.tag} attributes={item.attributes}>
            {that.getListItems(item.items, childIndex)}
          </ListItemGroup>
        );
      } else {
        return (
          <ListItem key={key} tag={item.tag} attributes={item.attributes}>
            {item.value}
          </ListItem>
        );
      }

    });

    return items;
  },

  render: function() {
    var Tag = this.props.tag || 'div';

    var defaultClasses = [
      'list',
      'list-unstyled'
    ];

    var passedClasses = this.props.className.split(' ');

    var classes = classNames(_.union(defaultClasses, passedClasses));

    return (
      <Tag {...this.props} className={classes}>
        {this.getListItems(this.props.items)}
      </Tag>
    );
  }

});

module.exports = List;
