import {Job} from "./Job";

export interface Stage {
    name: string,
    status: string,
    jobs: Job[]
}

