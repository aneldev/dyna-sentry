import * as Sentry from '@sentry/browser';
import { IFilterOut } from "./utils/FilterOut";
export interface IDynaSentryConfig {
    Sentry: any;
    captureConsole?: {
        consoleTypes?: EConsoleType[];
        stringifyData?: boolean;
        filter?: (consoleType: EConsoleType, consoleArgs: any[], consoleText: string) => boolean;
        filterOut?: IFilterOut;
        setScope?: (scope: Sentry.Scope) => void;
    };
}
export declare enum EConsoleType {
    ERROR = "error",
    WARN = "warn",
    LOG = "log",
    INFO = "info",
    DEBUG = "debug"
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
    private readonly sentry;
    private readonly filterOut;
    constructor(config: IDynaSentryConfig);
    sendIssue({ title, level, data, stringifyData, setScope, }: {
        title: string;
        level?: ELevel;
        data?: any;
        stringifyData?: boolean;
        setScope?: (scope: Sentry.Scope) => void;
    }): void;
    private originalConsoles;
    private initSniffConsoles;
    private filter;
}
