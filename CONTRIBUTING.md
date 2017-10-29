Check the [issue tracker](https://github.com/microplan-xyz/microplan/issues) for all work in progress. Before sending a PR or adding a new feature, please take time to open an issue and begin a discussion about it.

If you are sending a PR, make sure to change the version in package.json according to your changes. You can use the `npm version` command to achieve this

```bash
$ npm version patch # for bug fixes
$ npm version minor # for new features
$ npm version major # for deprecation
```

**Important:** `microplan` uses an automated publishing system. That means whenever your PR is merged, `microplan` will be published automatically to npm (based on the version specified in the package.json)
