# OpenAPI 3 Shotstack API Definition

Defines the Shotstack API and provides tooling for documentation and SDK generation.


### Linking Shins as a Subtree

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

### Installing Shins

Follow the process above to link and update Shins as a subtree, then:

```
cd .shins
npm install
```
