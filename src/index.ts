import {printPipeline} from "./printPipeline.js";
import {createGitlab} from "./gitlab.js";
import {loadEnv} from "./loadEnv.js";

loadEnv()

const gitlabAccessToken = process.env.GITLAB_ACCESS_TOKEN
if (typeof gitlabAccessToken !== 'string') throw "Gitlab access token not found";

const gitlab = createGitlab(gitlabAccessToken)

gitlab.getLastPipelineDetails()
    .then(printPipeline)
