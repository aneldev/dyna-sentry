import * as Sentry from '@sentry/browser';
import {dynaStringify} from "dyna-stringify";
import {consoleSplit} from "./utils/consoleSplit";
import {
  IFilterOut, FilterOut,
} from "./utils/FilterOut";

export interface IDynaSentryConfig {
  Sentry: any;
  captureConsole?: {
    consoleTypes?: EConsoleType[];  // Default is empty (none)
    stringifyData?: boolean;        // Default is false
    filter?: (consoleType: EConsoleType, consoleArgs: any[], consoleText: string) => boolean;
    filterOut?: IFilterOut;
    setScope?: (scope: Sentry.Scope) => void;
  };
}

export enum EConsoleType {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}

export enum ELevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warning",
  LOG = "log",
  INFO = "info",
  DEBUG = "debug",
  CRITICAL = "critical"
}

export class DynaSentry {
  // @ts-ignore
  private readonly sentry: Sentry;
  private readonly filterOut: FilterOut | null = null;

  constructor(private readonly config: IDynaSentryConfig) {
    this.sentry = config.Sentry;
    if (config.captureConsole && config.captureConsole.filterOut) {
      this.filterOut = new FilterOut(config.captureConsole.filterOut);
    }
    this.initSniffConsoles();
  }

  public sendIssue(
    {
      title,
      level = ELevel.ERROR,
      data,
      stringifyData = true,
      setScope,
    }: {
      title: string;
      level?: ELevel;
      data?: any;
      stringifyData?: boolean;
      setScope?: (scope: Sentry.Scope) => void;
    },
  ): void {
    this.sentry.withScope((scope: Sentry.Scope) => {
      if (setScope) setScope(scope);
      Object.keys(data).forEach((key: string) => {
        scope.setExtra(
          key,
          stringifyData
            ? dynaStringify(data[key], {spaces: 1})
            : data[key],
        );
      });
      scope.setLevel(level as any);
      this.sentry.captureMessage(title);
    });
  }

  // Private

  private originalConsoles: { [consoleType: string]: any } = {};

  private initSniffConsoles(): void {
    const {captureConsole = {}} = this.config;
    const {
      consoleTypes = [],
      stringifyData = false,
      setScope,
    } = captureConsole;
    consoleTypes
      .forEach(consoleType => {
        this.originalConsoles[consoleType] = console[consoleType];  // eslint-disable-line no-console
        console[consoleType] = (...args: any[]) => {          // eslint-disable-line no-console
          this.originalConsoles[consoleType](...args);
          const consoleContent = consoleSplit(args);
          if (this.filter(consoleType, args, consoleContent.text)) {
            this.sendIssue({
              title: (() => {
                if (consoleContent.text) return consoleContent.text;
                return `Console Object: ${dynaStringify(args[0])}`;
              })(),
              level: (() => {
                if (consoleType === EConsoleType.WARN) return ELevel.WARN as any;
                return consoleType;
              })(),
              data: consoleContent.restArgs
                .reduce((acc, arg, index) => {
                  acc[`console-arg-${index + consoleContent.restArgIndex}`] = arg;
                  return acc;
                }, {}),
              stringifyData,
              setScope,
            });
          }
        };
      });
  }

  private filter(consoleType: EConsoleType, args: any, consoleText: string): boolean {
    const {captureConsole = {}} = this.config;
    const {filter} = captureConsole;

    return (
      (
        !filter
        || filter(consoleType, args, consoleText)
      )
      && (
        !this.filterOut
        || this.filterOut.filter(consoleText)
      )
    );
  }
}
