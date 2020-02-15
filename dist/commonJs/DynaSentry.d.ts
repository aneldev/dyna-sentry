import Sentry from '@sentry/browser';
export interface IDynaSentryConfig {
    Sentry: any;
}
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
    private readonly config;
    private sentry;
    constructor(config: IDynaSentryConfig);
    sendIssue({ title, level, data, stringifyData, setScope, }: {
        title: string;
        level?: ELevel;
        data?: any;
        stringifyData?: boolean;
        setScope?: (scope: Sentry.Scope) => void;
    }): void;
}
