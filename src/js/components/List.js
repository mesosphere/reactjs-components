/** @jsx React.DOM */

var React = require('react');
var _ = require('underscore');
var classNames = require('classnames');

var ListItem = require('./ListItem');
var ListItemGroup = require('./ListItemGroup');

var List = React.createClass({

  displayName: 'List',

  getListItems: function(list) {

    var that = this;

    var items = _.map(list, function(item) {

      if (item.items) {
        return (
          <ListItemGroup attributes={item.attributes}>
            {that.getListItems(item.items)}
          </ListItemGroup>
        );
      } else {
        return (
          <ListItem attributes={item.attributes}>
            {item.value}
          </ListItem>
        );
      }

    });

    return items;
  },

  render: function() {

    var defaultClasses = [
      'list',
      'list-unstyled'
    ];

    var passedClasses = this.props.className.split(' ');

    var classes = classNames(_.union(defaultClasses, passedClasses));

    return (
      <div {...this.props} className={classes}>
        {this.getListItems(this.props.items)}
      </div>
    );
  }

});

module.exports = List;
