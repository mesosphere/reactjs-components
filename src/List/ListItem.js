var _ = require('underscore');
var React = require('react/addons');

var ListItem = React.createClass({

  displayName: 'ListItem',

  propTypes: {
    data: React.PropTypes.object.isRequired,
    order: React.PropTypes.array.isRequired
  },

  getObjectItems: function (object, order) {
    return _.map(order, function (property, key) {
      var propertyData = object[property];
      var styles = _.omit(propertyData, 'value', 'classes', 'attributes');

      var classes = {'h3 flush-top flush-bottom': true};
      if (propertyData.classes) {
        _.extend(classes, propertyData.classes);
      }
      var classSet = React.addons.classSet(classes);

      var attributes = propertyData.attributes || {};
      return React.createElement(
        'div',
        _.extend({className: classSet, key: key, style: styles}, attributes),
        propertyData.value
      );
    });
  },

  render: function () {
    return (
      <li className="list-item">
        {this.getObjectItems(this.props.data, this.props.order)}
      </li>
    );
  }
});

module.exports = ListItem;
