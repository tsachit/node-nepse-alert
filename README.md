# Node NEPSE Alert

Just an alert system checking using NEPSE data

## How to run

Run these commands

one time command
```
yarn install
```
and to run
```
yarn start
```

Note: Make changes in `index.js` to change the `interval` value. If you want to add/update/remove conditions change `conditions.json` file.

### Aliases:
You can make these aliases or edit them for your ease, make sure you change `<project-location>` in these commands
```
alias nna-watch="yarn --cwd ~/<project-location>/node-nepse-alert start"
alias nna-conds="cat ~/<project-location>/node-nepse-alert/conditions.json"
alias nna-conds-nano="nano ~/<project-location>/node-nepse-alert/conditions.json"
```
