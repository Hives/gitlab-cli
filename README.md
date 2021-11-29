# GitLab pipelines in your terminal

Run `node /path/to/gitlab-cli/dist/index.js` from a folder containing a `git`
repo of a Gitlab project. It will print out the status of the most recent
pipeline in your terminal.

## Setup

You'll need to create a Gitlab access token with read permissions for the Gitlab
api. Copy `.env-example` to `.env` and add your access token.

Compile the Typescript to Javascript by running something like `tsc` in the root
folder.

