import {Gitlab, Types} from "@gitbeaker/node";
import {getProjectPath} from "./getProjectPath.js";
import {Job} from "./domain/Job";
import {Stage} from "./domain/Stage";
import {Pipeline} from "./domain/Pipeline";

export function createGitlab(gitlabAccessToken: string) {
    const api = new Gitlab({token: gitlabAccessToken})
    const path = getProjectPath()

    return {
        getLastPipelineDetails: async function () {
            const [project, pipelines] = await Promise.all([
                api.Projects.show(path),
                api.Pipelines.all(path, {maxPages: 1})
            ])

            const lastPipelineId = pipelines[0].id

            const [lastPipeline, jobs, bridges, commit] = await Promise.all([
                api.Pipelines.show(path, lastPipelineId),
                api.Jobs.showPipelineJobs(path, lastPipelineId),
                api.Jobs.showPipelineBridges(path, lastPipelineId) as unknown as Types.BridgeSchema[],
                api.Commits.show(path, pipelines[0].sha)
            ])

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
                commitTitle: commit.title,
                createdAt: new Date(lastPipeline.created_at as string),
                createdBy: lastPipeline.user.name,
                stages
            }

            return pipeline
        }
    }
}

function getStageStatus(jobs: Job[]): string {
    // possible states: success, failed, skipped, pending, canceled [sic],
    // started, manual, created
    if (jobs.every(job => job.status === 'success')) return 'success';
    if (jobs.some(job => job.status === 'failed')) return 'failed';
    if (jobs.some(job => job.status === 'running')) return 'running';
    if (jobs.some(job => job.status === 'pending')) return 'pending';
    if (jobs.some(job => job.status === 'waiting_for_resource')) return 'pending';
    if (jobs.some(job => job.status === 'canceled')) return 'canceled';
    if (jobs.some(job => job.status === 'skipped')) return 'skipped';
    if (jobs.some(job => job.status === 'manual')) return 'manual';
    if (jobs.some(job => job.status === 'created')) return 'created';
    return 'UNKNOWN STATUS';
};
