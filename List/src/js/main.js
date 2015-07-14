/** @jsx React.DOM */

var React = require("react");

var List = require("./components/List.js");

var ListExample = React.createClass({

  displayName: "ListExample",

  getList: function() {
    var list = [
      {
        "attributes": {
          "className": "first-row"
        },
        "items": [
          {
            "attributes": {
              "data-tooltip": "nope",
              "height": "300",
              "className": "some-class some-class-b",
              "style": {
                "display": "inline-block"
              }
            },
            "value": "Row A, Column A"
          },
          {
            "attributes": {
              "data-tooltip": "yep",
              "height": "300",
              "className": "some-class some-class-b",
              "style": {
                "display": "inline-block"
              }
            },
            "items": [
              {
                "attributes": {
                  "data-tooltip": "nope",
                  "height": "300",
                  "className": "some-class some-class-b",
                  "style": {
                    "display": "inline-block"
                  }
                },
                "value": "Row B, Column A"
              },
              {
                "attributes": {
                  "data-tooltip": "yep",
                  "height": "300",
                  "className": "some-class some-class-b",
                  "style": {
                    "display": "inline-block"
                  }
                },
                "value": "Row B, Column B"
              }
            ]
          }
        ]
      },
      {
        "attributes": {
          "className": "second-row"
        },
        "value": "Just an item!"
      }
    ];

    return list;
  },

  render: function() {

    return (
      <List data-example-property="some example" className="one-class two-class" items={this.getList()} />
    );
  }

});

module.exports = ListExample;

React.render(<ListExample />, document.getElementById("application"));
