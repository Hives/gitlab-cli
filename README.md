# GitLab pipelines in your terminal

Run `node /path/to/gitlab-cli/dist/index.js` from a folder containing a `git`
repo of a Gitlab project. It will print out the status of the last pipeline in
your terminal.

## Setup

You'll need to create a Gitlab access token with permissions to read from the
api. Copy `.env-example` to `.env` and put your access token in there.

