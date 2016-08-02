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

2. Create the tag ([here's a guide](https://git-scm.com/book/en/v2/Git-Basics-Tagging#Annotated-Tags)).

3. Push the new tag to github:

        git push --tags

4. Now do the release (there is an npm command for this):

        npm run release

After this you can pull down the latest module version from npm.

### Publishing a Beta Release

1. Make sure you are on `master` branch and have pulled the latest changes.

2. Run the `release-beta` NPM script:

        npm run release-beta

## Making a PR

Before you submit your pull request consider the following guidelines:

* Search [GitHub](https://github.com/mesosphere/reactjs-components/pulls) for an open or closed Pull Request
  that relates to your submission. You don't want to duplicate effort.
* Make your changes in a new git branch:

     ```shell
     git checkout -b my-fix-branch master
     ```

* [Setup your editor](http://editorconfig.org/#download)

* Create your patch, including appropriate unit test cases

* Commit your changes using a [descriptive commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html)

* Build your changes locally to ensure all the tests pass:

    ```shell
    npm run dist
    npm run test
    ```

* Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

* In GitHub, send a pull request to `reactjs-components:master`.

* If we suggest changes then:
  * Make the required updates.
  * Re-run the test suite to ensure tests are still passing.
  * If necessary, rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push origin my-fix-branch -f
    ```

That's it! Thank you for your contribution!
