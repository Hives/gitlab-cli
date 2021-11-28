import {Stage} from "./Stage";

export interface Pipeline {
    id: number,
    project: string,
    created_at: Date,
    created_by: string
    stages: Stage[]
}