## Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can
help by submitting an issue [here](https://github.com/mesosphere/reactjs-components/issues).

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

## Creating a new version

1. Change the version within `package.json`

2. Create a synced npm-shrinkwrap.json with devDependencies included

        npm run shrinkwrap

3. Commit to repository and make a PR

4. After PR is merged, the merger will create tags and publish the module

### Creating a tag and publishing

1. Make sure you are on `master` branch and have pulled the latest changes.

2. Create the tag ([here's a guide](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Annotated-Tags)). You can use this shorthand which will create a tag from current package.json version:

        VERSION=$(npm info reactjs-components version) && git tag -a v$VERSION -m 'Version $VERSION'

3. Push the new tag to github:

        git push —tags

4. Now do the release (there is an npm command for this):

        npm run release

After this you can pull down the latest module version from npm.

## Making a PR

Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/mesosphere/reactjs-components/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* Create your patch, including appropriate unit test cases

* Commit your changes using a descriptive commit message

* Build your changes locally to ensure all the tests pass:

    ```shell
    npm run dist
    npm run test
    ```

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `marathon-ui:master`.

* If we suggest changes then:
  * Make the required updates.
  * Re-run the test suite to ensure tests are still passing.
  * If necessary, rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push origin my-fix-branch -f
    ```

That's it! Thank you for your contribution!

## Development Setup (Sublime Text)
There is an .editorconfig-file to apply editor settings on various editors.

1. Add the following to your Sublime Text User Settings:

  ```js
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
  ```js
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
