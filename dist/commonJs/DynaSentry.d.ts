export declare enum ELevel {
    FATAL = "fatal",
    ERROR = "error",
    WARN = "warning",
    LOG = "log",
    INFO = "info",
    DEBUG = "debug",
    CRITICAL = "critical"
}
export declare class DynaSentry {
    private sentry;
    constructor(sentry: any);
    sendIssue({ title, level, data, stringifyData, }: {
        title: string;
        level?: ELevel;
        data?: any;
        stringifyData?: boolean;
    }): void;
}
