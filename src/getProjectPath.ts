import {execSync} from "child_process";

export function getProjectPath(): string {
    const remoteOriginUrl = execSync("git config --get remote.origin.url", {encoding: 'utf-8'})

    const match = remoteOriginUrl.match(/.*:(.*).git/)
    const fragment = match && match[1] || ":("

    return fragment
}
