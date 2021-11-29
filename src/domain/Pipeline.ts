import {Stage} from "./Stage";

export interface Pipeline {
    id: number,
    project: string,
    commitTitle: string,
    createdAt: Date,
    createdBy: string
    stages: Stage[]
}