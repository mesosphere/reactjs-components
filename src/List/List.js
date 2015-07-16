var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var ListItem = require('./ListItem');
var ListItemGroup = require('./ListItemGroup');

var List = React.createClass({
  displayName: 'List',

  getDefaultProps: function() {
    return {
      className: ''
    }
  },

  getListItems: function(list) {
    var that = this;

    var items = _.map(list, function(item) {

      if (item.items) {
        return (
          <ListItemGroup tag={item.tag} attributes={item.attributes}>
            {that.getListItems(item.items)}
          </ListItemGroup>
        );
      } else {
        return (
          <ListItem tag={item.tag} attributes={item.attributes}>
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
