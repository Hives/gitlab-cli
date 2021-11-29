import {addSeconds, format} from 'date-fns'
import {Stage} from "./domain/Stage";
import {Pipeline} from "./domain/Pipeline";
import {Job} from "./domain/Job";
import {applyStatusStyle, applyStyle} from "./applyStatusStyle.js";

// format like: 8:09pm Fri 26th Nov
const dateFormat = 'h:mmaaa iii do LLL'

export function printPipeline(pipeline: Pipeline): void {
    printHeading(pipeline)
    pipeline.stages.forEach(printStage)
}

function printHeading(pipeline: Pipeline): void {
    const {project, createdBy, createdAt, commitTitle} = pipeline;
    const formattedProject = applyStyle(project, 'highlight')
    const formattedTime = applyStyle(formatDateTime(createdAt), 'highlight')
    const formattedCreatedBy = applyStyle(createdBy, 'highlight')

    console.log(formattedProject)
    console.log(`Triggered at ${formattedTime} by ${formattedCreatedBy}`)
    console.log(commitTitle)
    console.log()
}

function printStage(stage: Stage): void {
    const {name, status, jobs} = stage
    const message = applyStatusStyle(`  ${statusIcon(status)} ${name}`, status)
    console.log(message)
    jobs.forEach(printJob)
}

function printJob(job: Job): void {
    const {name, status, duration} = job
    const message = applyStatusStyle(`    ${statusIcon(status)} ${name} ${formatJobDuration(duration)}`, status)
    console.log(message)
}

function formatDateTime(dateTime: Date): string {
    return format(dateTime, dateFormat)
}

function formatJobDuration(duration: number | undefined): string {
    if (typeof duration !== "number") return '';
    const helperDate = addSeconds(new Date(0), duration)
    return format(helperDate, 'mm:ss')
}

function statusIcon(status: string): string {
    switch (status) {
        case 'success':
            return "✔"
        case 'failed':
            return "❌"
        case 'running':
            return "⏳"
        case 'pending':
            return "🕑"
        case 'canceled':
            return "⛔"
        case 'skipped':
            return "⏩"
        case 'manual':
            return "⚙"
        case 'created':
            return "🚫"
        default:
            return "⁉"
    }
}