import {addSeconds, format} from 'date-fns'
import {Stage} from "./model/Stage";
import {Pipeline} from "./model/Pipeline";
import {Job} from "./model/Job";
import chalk from "chalk";

// 8:09pm Fri 26th Nov
const dateFormat = 'h:mmaaa iii do LLL'

export function printPipeline(pipeline: Pipeline): void {
    printHeading(pipeline)
    pipeline.stages.forEach(printStage)
}

function printHeading(pipeline: Pipeline): void {
    const {project, created_by, created_at} = pipeline;
    console.log(`Project: ${project}`)
    console.log(`Start time: ${formatDateTime(created_at)}`)
    console.log(`Triggered by: ${created_by}`)
    console.log()
}

function printStage(stage: Stage): void {
    const {name, status, jobs} = stage
    const message = style(`  ${statusIcon(status)} ${name}`, status)
    console.log(message)
    jobs.forEach(printJob)
}

function printJob(job: Job): void {
    const {name, status, duration} = job
    const message = style(`    ${statusIcon(status)} ${name} ${formatJobDuration(duration)}`, status)
    console.log(message)
}

function style(message: string, status: string): string {
    let style: (text: string) => string;
    switch (status) {
        case 'success':
            style = text => chalk.green(text)
            break;
        case 'failed':
            style = text => chalk.red(text)
            break;
        case 'running':
            style = text => chalk.yellow(text)
            break;
        case 'pending':
            style = text => chalk.blue(text)
            break;
        case 'canceled':
            style = text => chalk.red(text)
            break;
        case 'skipped':
            style = text => chalk.white(text)
            break;
        case 'manual':
            style = text => chalk.white(text)
            break;
        case 'created':
            style = text => chalk.white(text)
            break;
        default:
            style = text => chalk.white(text)
            break;
    }
    return style(message);
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