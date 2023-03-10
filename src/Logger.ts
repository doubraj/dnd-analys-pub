export enum LoggerLevel {
    DEBUG,
    INFO,
    WARNING,
    ERROR,
}

export class Logger {
    public constructor(private level: LoggerLevel) {}
    public debug(msg: string, extra?: unknown): void {
        if (this.level <= LoggerLevel.DEBUG) {
            this.log('DEBUG', msg, extra ?? '');
        }
    }
    public info(msg: string, extra?: unknown): void {
        if (this.level <= LoggerLevel.INFO) {
            this.log('INFO', msg, extra ?? '');
        }
    }
    public warn(msg: string, extra?: unknown): void {
        if (this.level <= LoggerLevel.WARNING) {
            this.log('WARNING', msg, extra ?? '');
        }
    }
    public error(msg: string, extra?: unknown): void {
        this.log('ERROR', msg, extra ?? '');
    }

    private log(level: string, msg: string, extra: unknown) {
        console.log(`[${level}]: ${msg}; ${extra}`);
    }
}
