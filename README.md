<h1 align="center">
	<br>
	<img width="400" src="https://raw.githubusercontent.com/microplan-xyz/microplan/master/logo_black.png" alt="microplan">
	<br>
	<br>
	<br>
</h1>

> Plan your project from command line

[![Run Status](https://api.shippable.com/projects/58287b8f8279be1000fa7edc/badge?branch=master)](https://app.shippable.com/projects/58287b8f8279be1000fa7edc)

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

## Planning Tools
| Tool | Status |
|------|--------|
| [Gitter](https://gitter.im)   | AVAILABLE |
| [Github](https://github.com/) | PLANNED   |
| [Gitlab](https://gitlab.com/) | PLANNED   |

## Input Formats
| Format | Status |
|--------|--------|
| YAML   | AVAILABLE |
| TOML   | PLANNED   |
