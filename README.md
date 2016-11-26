<h1 align="center">
	<br>
	<img width="400" src="https://raw.githubusercontent.com/microplan-xyz/microplan/master/logo_black.png" alt="microplan">
	<br>
	<br>
	<br>
</h1>

> Plan your project from command line

[![Run Status](https://api.shippable.com/projects/58287b8f8279be1000fa7edc/badge?branch=master)](https://app.shippable.com/projects/58287b8f8279be1000fa7edc)
[![npm version](https://badge.fury.io/js/microplan.svg)](https://badge.fury.io/js/microplan)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/microplan-xyz/microplan/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg)](https://gitter.im/microplan-xyz/Lobby)
## Install
Make sure to have Node.js 0.12 or greater + npm on your machine.
```bash
$ npm install -g microplan
```

## Inspiration
> "I am a strong believer that great software comes from great people. If you worry only about the technology side of the equation, you're missing way more than half of the picture"
>
> -- Sam Newman ( Building Microservices, chapter: "Evolutionary Architect" )

We wanted to solve a little bit of of the "Planning" side of the equation. We wanted a tool, that comes very handy. It should be very handy, like the terminal we open. wait ! why not, inside a terminal ?

### Planning Tools
| Tool | Status |
|------|--------|
| [Github](https://github.com/) | AVAILABLE   |
| [Gitlab](https://gitlab.com/) | AVAILABLE   |
| [Gitter](https://gitter.im)   | AVAILABLE   |
| [Slack](https://slack.com/)   | PLANNED     |

We will be using the above tools to plan and develop software.

Lets say you want to create a user registration form in your app. Your workflow might seem something like this.
- Ask UX team in gitter/slack on how UI should look like
- Open issue in frontend repo ( in github ), suggesting to add a page and notify about it ( in gitter )
- Open issue in backend repo ( in gitlab ), suggesting to add API endpoint

So, lets start using microplan to get this plan published in those tools from command line.

### login
Login stores your credentials in `.microplan` file in your HOME folder.
- `token` for Github could be generated from [here](https://github.com/settings/tokens)
- `token` for Gitlab could be generated from [here](https://gitlab.com/profile/personal_access_tokens)
- gitter uses custom integration URL directly in the planning file. ( more details on this below )
```bash
$ microplan login
```
![anim](https://cloud.githubusercontent.com/assets/4211715/20641564/9cca34f2-b420-11e6-8155-8080fc33faa8.gif)


### init
Initializes a file to start planning.
```bash
$ microplan init filename.yml

# open filename.yml and start editing
```
![anim](https://cloud.githubusercontent.com/assets/4211715/20641521/e8e06b5a-b41f-11e6-8dc3-9674c4fa4ca6.gif)

### configurations
Open the file initialized with `microplan init` and lets create the configurations. configurations help microplan to denote the place to publish (Example: which repository should I create the issue in ? Which room should I plan the discussion in ?)

```yml
feature: create user registration
description: "blah, blah ........" 

configurations:
  uxGitterChat:
    type: gitter
    url: "https://webhooks.gitter.im/e/xxxxxxxxxxxxxxxxxxx"
  
  frontendRepo:
    type: github
    slug: "microplan-xyz/www"
    
  backendRepo:
    type: gitlab
    slug: microplan-xyz/api"
```

### plans
`plans` object will make use of configurations and helps you express your steps in plan

```yml
plans:
  # Send message to UX team asking about the feature
  - title: "How should the User registration page look ?"
    description: "Should it have dark or light theme ? any specific font?"
    in: uxGitterChat

  # Create issue in frontend github repository
  # And notifies the UX team in gitter
  - title: "Choose frontend css framework for user registration page"
    description: Should we go with bootstrap or spectre css ? Benchmarks and prototyping PRs could be sent.
    in:
      - frontendRepo
      - uxGitterChat

  # Create issue with big description in gitlab repository
  - title: "Add user addition "
    in: backendRepo
    description: >
      Add `user-routes.js` file and use express Router
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

    

## How to use ?
`microplan` can be used by developers/architects to plan work needed in multiple microservices, to implement one feature.

When you want to implement a new featurem you start by creating a feature file for it.
```bash
$ microplan init feature-name.yml

# creates a file named feature-name
```
This will create a new file for you.

```yml
feature: "Add homepage"
description: "Have nice pictures and bold fonts"

configuration:
  gitterDEVChat:
    type: gitter
    url: "https://webhooks.gitter.im/e/devchatid"
  gitterProductChat:
    type: gitter
    url: "https://webhooks.gitter.im/e/productchatid"

plans:
  - title: "Bootstrap angular.js"
    description: "Write index.html as angular.js app"
    in: gitterDEVChat

  - title: "Team meeting about www service"
    description: "speak about enhancing www"
    in:
      - gitterProductChat
      - gitterDEVChat

```
Its a base template, which you can use to plan things and publish the plan to different tools like github, gitlab and gitter.
At the moment, we support only gitter and things are planned in our milestone.

`configuration` object helps you to define configurations for various tools. ( Example, for gitter it will obviously have the secret webhook url, as shown in the above yml)

`plans` is an array of items, which can be used to note down your plan in a step by step fashion and publish them. use the `in` property to express

After you complete your plan, it can be published by the following command.

```bash
$ microplan publish feature-name.yml
```

## Input Formats
| Format | Status |
|--------|--------|
| YAML   | AVAILABLE |
| JSON   | PLANNED   |
| TOML   | PLANNED   |

## Contributing
Check the [issue tracker](https://github.com/microplan-xyz/microplan/issues) for work in progress. Before sending a PR or adding new feature, please take time to open an issue and discuss about it.

If you are sending a PR, make sure to change the version in package.json according to your changes. You can use npm version command to achieve this.
```bash
$ npm version patch # for bug fixes
$ npm version minor # for new features
$ npm version major # for deprecation
```

`microplan` uses a automated publishing system. This means that, whenever your PR is merged, `microplan` will be published automatically to npm ( based on the version you gave in package.json )

## Contributors
[<img alt="argonlaser" src="https://avatars.githubusercontent.com/u/4816430?v=3&s=117" width="117">](https://github.com/argonlaser)[<img alt="scriptnull" src="https://avatars.githubusercontent.com/u/4211715?v=3&s=117" width="117">](https://github.com/scriptnull)[<img alt="killerveee" src="https://avatars.githubusercontent.com/u/18292587?v=3&s=117" width="117">](https://github.com/killerveee)
