# ReactJS-components [![Build Status](https://travis-ci.org/mesosphere/reactjs-components.svg?branch=master)](https://travis-ci.org/mesosphere/reactjs-components)
A library of reusable React components. For examples, take a look at our
[kitchen sink](http://mesosphere.github.io/reactjs-components/).

## Available components
* Dropdown
* List
* Modal
* Side Panel
* Table

## Using the components


1. From the command line inside of your project

        npm install --save reactjs-components

2. Import the component that you want to use

  ```js
  // es6
  import {Modal} from 'reactjs-components';

  // es5
  var Modal = require('reactjs-components').Modal;
  ```


3. Use as if it was any other component

  ```js
    // ...

    render: function () {
      return (
        // ...
        <Modal ...{props}>
          // Content
        <Modal />
      );
    }
  ```


## Contributing
See [here](https://github.com/mesosphere/reactjs-components/blob/master/CONTRIBUTING.md).
