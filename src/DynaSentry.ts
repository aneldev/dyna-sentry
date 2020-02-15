import Sentry from '@sentry/browser';
import {dynaStringify} from "dyna-stringify";
import {stringify} from "querystring";

export interface IDynaSentryConfig {
  Sentry: any;
  captureConsole?: {
    consoleTypes?: EConsoleType[];  // default: empty (none)
    stringifyData?: boolean;        // default: false
    filter?: (consoleType: EConsoleType, consoleArgs: any[]) => boolean;
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
  private sentry: Sentry;

  constructor(private readonly config: IDynaSentryConfig) {
    this.sentry = config.Sentry;
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
    }
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

  // private

  private originalConsoles: { [consoleType: string]: any } = {};

  private initSniffConsoles(): void {
    const {
      captureConsole = {},
    } = this.config;
    const {
      consoleTypes = [],
      filter = () => true,
      stringifyData = false,
      setScope,
    } = captureConsole;
    consoleTypes
      .forEach(consoleType => {
        this.originalConsoles[consoleType] = console[consoleType];
        console[consoleType] = (...args: any[]) => {
          this.originalConsoles[consoleType](...args);
          if (filter(consoleType, args)) {
            this.sendIssue({
              title: (() => {
                if (typeof args[0] === 'string') return args[0];
                return `Console Object: ${dynaStringify(args[0])}`;
              })(),
              level: (() => {
                if (consoleType === EConsoleType.WARN) return ELevel.WARN as any;
                return consoleType;
              })(),
              data: args
                .slice(1)
                .reduce((acc, arg, index) => {
                  acc[`console-arg-${index}`] = arg;
                  return acc;
                }, {}),
              stringifyData,
              setScope,
            });
          }
        };
      });
  }
}
