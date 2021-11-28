import {Gitlab, Types} from "@gitbeaker/node";
import * as dotenv from "dotenv";
import {Job} from "./model/Job";
import {Stage} from "./model/Stage";
import {Pipeline} from "./model/Pipeline";
import {printPipeline} from "./printPipeline.js";
import {getProjectPath} from "./getProjectPath.js";

(async function () {
    // TODO 👀
    dotenv.config({path: "/home/hives/code/gitlab-cli/.env"});

    const gitlabAccessToken = process.env.GITLAB_ACCESS_TOKEN;

    const api = new Gitlab({token: gitlabAccessToken})

    const path = getProjectPath()
    const project = await api.Projects.show(path)

    const pipelines = await api.Pipelines.all(path, {maxPages: 1})

    const pipelineId = pipelines[0].id

    const lastPipeline = await api.Pipelines.show(path, pipelineId)
    const jobs = await api.Jobs.showPipelineJobs(path, pipelineId)

    const bridges = await api.Jobs.showPipelineBridges(path, pipelineId) as unknown as Types.BridgeSchema[]

    let jobsAndBridges: Job[] = []

    jobs.forEach(job => jobsAndBridges.push({
        id: job.id,
        stage: job.stage,
        name: job.name,
        status: job.status,
        duration: job.duration
    }))

    bridges.forEach(bridge => jobsAndBridges.push({
        id: bridge.id,
        stage: bridge.stage,
        name: bridge.name,
        status: bridge.status,
        duration: bridge.duration
    }))

    jobsAndBridges.sort((j1, j2) => j1.id - j2.id)

    const stageNames: string[] = [...new Set(jobsAndBridges.map(j => j.stage))]

    const stages: Stage[] = stageNames.map(stageName => {
        const jobs = jobsAndBridges.filter(job => job.stage === stageName);

        return {
            name: stageName,
            status: getStageStatus(jobs),
            jobs
        };
    })

    const pipeline: Pipeline = {
        id: lastPipeline.id,
        project: project.name,
        created_at: new Date(lastPipeline.created_at as string),
        created_by: lastPipeline.user.name,
        stages
    }

    printPipeline(pipeline)
})()

function getStageStatus(jobs: Job[]): string {
    // possible states: success, failed, skipped, pending, canceled [sic],
    // started, manual, created
    if (jobs.every(job => job.status === 'success')) return 'success';
    if (jobs.some(job => job.status === 'failed')) return 'failed';
    if (jobs.some(job => job.status === 'running')) return 'running';
    if (jobs.some(job => job.status === 'pending')) return 'pending';
    if (jobs.some(job => job.status === 'canceled')) return 'canceled';
    if (jobs.some(job => job.status === 'skipped')) return 'skipped';
    if (jobs.some(job => job.status === 'manual')) return 'manual';
    if (jobs.some(job => job.status === 'created')) return 'created';
    return 'UNKNOWN STATUS';
};
