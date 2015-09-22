# ReactJS-components
A library of reusable React components.For examples, take a look at our
[kitchen sink](http://mesosphere.github.io/reactjs-components/).

## Available components
* Dropdown
* List
* Modal
* Side Panel
* Table

## Using the components
1. From the command line inside of your project
`
  npm install --save reactjs-components
`

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

## Development Setup

1. Clone this repository
2. Install [NPM](https://npmjs.org/)
3. Install dev dependencies

  ```sh
  npm install
  npm install -g gulp
  ```
4. Run the tests

  ```sh
  npm test
  ```

5. Start the server and watch files

  ```sh
  npm run livereload
  ```

## Adding npm package dependencies to package.json

If you want to add a new npm package to `node_modules`:

1. Install the new package

        npm install [your package] --save
    will install and save to dependencies in package.json and

        npm install [your package] --save-dev
    will add it to devDependencies.

2. Create a synced npm-shrinkwrap.json with devDependencies included

        npm run shrinkwrap

3. Commit to repository

## Contributing

1. Change the version within `package.json`

2. Create a synced npm-shrinkwrap.json with devDependencies included

        npm run shrinkwrap

3. Commit to repository and make a PR

4. After PR is merged, the merger will create tags and publish the module

## Development Setup (Sublime Text)

1. Add the following to your Sublime Text User Settings:

  ```json
  {
    ...
    "rulers": [80], // lines no longer than 80 chars
    "tab_size": 2, // use two spaces for indentation
    "translate_tabs_to_spaces": true, // use spaces for indentation
    "ensure_newline_at_eof_on_save": true, // add newline on save
    "trim_trailing_white_space_on_save": true, // trim trailing white space on save
    "default_line_ending": "unix"
  }
  ```

2. Add Sublime-linter with jshint & jsxhint:

  1. Installing SublimeLinter is straightforward using Sublime Package Manager,
  see [instructions](http://sublimelinter.readthedocs.org/en/latest/installation.html#installing-via-pc)

  2. SublimeLinter-eslint needs a global eslint in your system,
  see [instructions](https://github.com/roadhump/SublimeLinter-eslint#sublimelinter-eslint)

3. Syntax Highlihgting for files containing JSX

  1. Install Babel using Sublime Package Manager,
  see [instructions](https://github.com/babel/babel-sublime)
  From here you can decide to use Babel for all .js files. See their
  docs for that. If you don't want to do that, continue reading.

  2. Installing ApplySyntax using Sublime Package Manager,
  see [instructions](https://github.com/facelessuser/ApplySyntax)

  3. Open up the user configuration file for ApplySyntax: `Sublime Text` ->
  `Preferences` -> `Package Settings` -> `ApplySyntax` -> `Settings - User`

  4. Replace the contents with this:
  ```
  {
      // Put your custom syntax rules here:
      "syntaxes": [
          {
              "name": "Babel/JavaScript (Babel)",
              "rules": [
                  {"first_line": "^\\/\\*\\*\\s@jsx\\sReact\\.DOM\\s\\*\\/"}
              ]
          }
      ]
  }
  ```
