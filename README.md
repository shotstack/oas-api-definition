# OpenAPI 3 Shotstack API Definition

Defines the Shotstack API and provides tooling for documentation and SDK generation.

## Installation

The project is built using Node.js.

Install shins dependencies:
```
cd .shins
nvm use
npm i
```

Install dependencies:
```
npm install
```

Add google analytics: Create the file `$workspace/.tags`:
```
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-12345"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'UA-12345');
</script>
```

## Generating Docs

Generate the docs using:

```
npm run build:docs
```

Generated docs are saved to build/docs directory

You can preview the docs in the browser using:

```
npm run start
```

Deploy docs using:

```
npm run deploy:docs
```

Note: this deploys to Shotstack's S3 docs bucket, if you wish to host your own documentation, modify the script within
the `package.json` file.


## Generating SDK's

Requires the [OpenAPI Generator](https://openapi-generator.tech/) to be installed.

```
npm install @openapitools/openapi-generator-cli -g
```

or

```
brew install openapi-generator
```

Once installed generate SDK's for PHP, Node and Ruby:

```
npm run build:sdks
```

Note: The generated SDK's need some modifications to work correctly, and files need to be copied to the respective
project repos.

### Linking Shins as a Subtree

This is for reference only, you should not need to follow these steps.

Add our fork of Shins:
```
git remote add -f shins git@github.com:shotstack/shins.git
```

Add it as a subtree:
```
git subtree add --prefix .shins/ shins master --squash
```

To pull latest changes:
```
git subtree pull --prefix=.shins/ shins master --squash
```

For more details on Git subtrees see: https://www.atlassian.com/git/tutorials/git-subtree
