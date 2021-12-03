# GitLab pipelines in your terminal

Run `node /path/to/gitlab-cli/dist/index.js` from a folder containing a `git`
repo of a Gitlab project. It will print out the status of the most recent
pipeline in your terminal.

Or better yet, create an alias for that command by adding this to your bash/zsh
profile, then you can easily run it from anywhere:

```
alias pipe="node /path/to/gitlab-cli/dist/index.js"
```

## Setup

You'll need to create a Gitlab access token with read permissions for the Gitlab
api. Copy `.env-example` to `.env` and add your access token.

Compile the Javascript in `/src` to Javascript in `/dist` by running something
like `tsc` in the root folder. Required Typescript to be installed:

```
npm i -g typescript
```

