import {config} from "dotenv";

export function loadEnv() {
    const envUrl = new URL('../.env', import.meta.url)
    const envPath = envUrl.href.replace("file://", "")
    config({path: envPath});
}
