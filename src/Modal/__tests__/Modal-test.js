var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

jest.dontMock('../Modal');
jest.dontMock('../../Util/Util');

var Modal = require('../Modal');
var DEFAULT_CLASSES = require('../DefaultModalClasses');

describe('Modal', function () {

  describe('#addDefaultClasses', function () {
    beforeEach(function () {
      this.classProps = Object.keys(DEFAULT_CLASSES);
    });

    describe('no user added classes', function () {
      it('should add default classes if user does not add any', function () {
        var instance = TestUtils.renderIntoDocument(
          <Modal open={true} />
        );
        var mergedClasses = instance.addDefaultClasses(instance.props);

        this.classProps.forEach(function (classProp) {
          expect(mergedClasses[classProp]).toEqual(DEFAULT_CLASSES[classProp]);
        });
      });
    })

    describe('user adds classes', function () {
      it('should combine user added classes with the default', function () {
        var props = {
          open: true
        };

        // Simulate a user adding their own personal class onto the props.
        this.classProps.forEach(function (classProp) {
          props[classProp] = 'user-added-class';
        });

        var instance = TestUtils.renderIntoDocument(
          <Modal {...props} />
        );

        var mergedClasses = instance.addDefaultClasses(instance.props);

        // Test if default and user added classes combined.
        this.classProps.forEach(function (classProp) {
          var defaultClass = DEFAULT_CLASSES[classProp];
          var userAdded = props[classProp];

          expect(mergedClasses[classProp]).toEqual(defaultClass + ' ' + userAdded);
        });
      });
    });
  });
});
