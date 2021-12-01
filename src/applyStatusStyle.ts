import chalk from "chalk";

export function applyStyle(message: string, style: string): string {
  switch (style) {
    case 'highlight':
      return chalk.whiteBright(message)
    default:
      return chalk.white(message)
  }
}

export function applyStatusStyle(message: string, status: string): string {
  switch (status) {
    case 'success':
      return chalk.green(message)
    case 'failed':
      return chalk.red(message)
    case 'running':
      return chalk.yellow(message)
    case 'pending':
      return chalk.blue(message)
    case 'canceled':
      return chalk.red(message)
    case 'skipped':
      return chalk.white(message)
    case 'manual':
      return chalk.white(message)
    case 'created':
      return chalk.white(message)
    default:
      return chalk.white(message)
  }
}

