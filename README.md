<h1 align="left">
  <br>
  <img width="300" src="https://raw.githubusercontent.com/microplan-xyz/microplan/master/images/logo_black.png" alt="microplan">
  <br>
</h1>

Plan your projects from the command line

[![Build Status](https://semaphoreci.com/api/v1/scriptnull/microplan/branches/master/badge.svg)](https://semaphoreci.com/scriptnull/microplan)
[![npm version](https://badge.fury.io/js/microplan.svg)](https://badge.fury.io/js/microplan)
[![npm](https://img.shields.io/npm/dm/microplan.svg)](https://www.npmjs.com/package/microplan)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/microplan-xyz/microplan/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/microplan-xyz/Lobby)

### Inspiration

> "I am a strong believer that great software comes from great people. If you worry only about the technology side of the equation, you're missing way more than half of the picture"
>
> -- Sam Newman (  "Evolutionary Architect", Building Microservices)

We want to solve the "Planning" side of the equation. And we want our tool to be handy. Talking of handy tools, the terminal comes to mind. So why not use that as our playground?

### Installation

Microplan requires Node.js 0.12 or greater along with npm

```bash
$ npm install -g microplan
```

### Planning Tools

We'll be using the following tools to illustrate how you can use microplan to plan and develop your software:

| Tool | Status |
|------|--------|
| [Github](https://github.com/) | AVAILABLE   |
| [Gitlab](https://gitlab.com/) | AVAILABLE   |
| [Gitter](https://gitter.im)   | AVAILABLE   |
| [Slack](https://slack.com/)   | PLANNED     |

### Getting Started

Let's say you want to create a user registration form in your app. Your workflow might look something like this:

- Ping the UX team on Slack/Gitter to ask how the UI should look like
- Open an issue in the front-end repo (on GitHub) to add a page and notify about it (on Gitter)
- Open another issue in the back-end repo (on GitLab ) to add an API endpoint

Wait. This seems all over the place! :O

What if you had a consolidated solution baked right into your terminal?

This is where microplan comes into the picture! Let's get started and publish this plan to the specified tools from the cozy comfort of your command line.

### Login

Use the `login` command to store your credentials in the `.microplan` file in your HOME folder

- Generate your GitHub `token` [here](https://github.com/settings/tokens)
- Generate your GitLab `token` [here](https://gitlab.com/profile/personal_access_tokens)
- Gitter uses a custom integration URL specified in the planning file (details to follow below)

```bash
$ microplan login
```

![anim](https://cloud.githubusercontent.com/assets/4211715/20641564/9cca34f2-b420-11e6-8155-8080fc33faa8.gif)


### Initialize

`init` creates a file to help you get started with the planning flow


```bash
$ microplan init [filename].yml
```

Yep, that's it! Open filename.yml to configure.

![anim](https://cloud.githubusercontent.com/assets/4211715/20641521/e8e06b5a-b41f-11e6-8dc3-9674c4fa4ca6.gif)

### Configuration

Configurations lie at the heart of microplan and help you specify the platforms you want to publish to (eg. which repository to create an issue in or which room to plan the discussion in)

```yml
feature: Create user registration form
description: "To persist user preferences ..."

configuration:
  uxGitterChat:
    type: gitter
    url: "https://webhooks.gitter.im/e/xxxxxxxxxxxxxxxxxxx"

  frontendRepo:
    type: github
    slug: "microplan-xyz/www"

  backendRepo:
    type: gitlab
    slug: "microplan-xyz/api"
```

### Plans

The `plans` object is part of the same yml file and helps you express each step of your plan.

```yml
plans:
  # Send a message to the UX team asking about the feature
  - title: "How should the User Registration Page look like?"
    description: "Should it have a dark or light theme? And would you suggest a specific font we should use?"
    in: uxGitterChat

  # Create an issue in the front-end GitHub repository
  # And notify the UX team on Gitter
  - title: "Choose frontend css framework for user registration page"
    description: "Should we go with Bootstrap or Spectre? Please let us know about the benchmark. Prototype PRs can be sent here."
    assignee: scriptnull
    in:
      - frontendRepo
      - uxGitterChat

  # Create an issue with a lengthy description in the GitLab repository
  - title: "Support new user registration"
    in: backendRepo
    assignee: scriptnull
    description: >
      Add the `user-routes.js` file and use the Express router

      ```javascript
      var express = require('express')
      var router = express.Router()

      // GET /user
      router.get('/user', function (req, res) {
        // fetch from DB
      })

      router.post('/user', function (req, res) {
        // save in DB
      })

      module.exports = router
      ```
```

## Publishing

Once you have written the plan, use the `publish` command to create the issues and send messages to specified rooms

```bash
$ microplan publish [filename]

$ microplan publish -h
  Usage: microplan publish [options]

  Options:

    -h, --help      output usage information
    -s, --serial    Publish plans serially
    -p, --parallel  Publish plans parallely
```
![publish](https://cloud.githubusercontent.com/assets/4211715/20642219/225420f2-b42f-11e6-8966-153252c8c68a.gif)

¡Eso es todo!

* Your UX team will receive a Gitter notification

![image](https://cloud.githubusercontent.com/assets/4211715/20642190/619ccb16-b42e-11e6-910e-976d54d0ec62.png)

* the front-end issue will be created on GitHub

![image](https://cloud.githubusercontent.com/assets/4211715/20642304/e58924a8-b431-11e6-97c4-cbff3d21a89d.png)

* the back-end issue will be created on GitLab

![image](https://cloud.githubusercontent.com/assets/4211715/20642197/7b463f84-b42e-11e6-88b6-06959a59d8f0.png)

### Input Formats

The configuration file can be written in various formats. We plan to add TOML soon.

| Format | Status |
|--------|--------|
| YAML   | AVAILABLE |
| JSON   | AVAILABLE |
| TOML   | PLANNED   |


## Contributing
Check the [issue tracker](https://github.com/microplan-xyz/microplan/issues) for all work in progress. Before sending a PR or adding a new feature, please take time to open an issue and begin a discussion about it.

If you are sending a PR, make sure to change the version in package.json according to your changes. You can use the `npm version` command to achieve this

```bash
$ npm version patch # for bug fixes
$ npm version minor # for new features
$ npm version major # for deprecation
```

**Important:** `microplan` uses an automated publishing system. That means whenever your PR is merged, `microplan` will be published automatically to npm (based on the version specified in the package.json)

## Thanks a lot!
Thanks for checking out the project. We appreciate it! •ᴗ•

### Security
Please report any security vulnerabilities of this project to [keybase.io/scriptnull](https://keybase.io/scriptnull)

```bash
curl https://keybase.io/scriptnull/pgp_keys.asc | gpg --import
```
