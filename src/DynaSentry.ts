import Sentry from '@sentry/browser';
import {dynaStringify} from "dyna-stringify";

export interface IDynaSentryConfig {
  Sentry: any;
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
  }

  public sendIssue(
    {
      title,
      level = ELevel.ERROR,
      data,
      stringifyData = true,
      setScope,
    }: {
      title: string,
      level?: ELevel,
      data?: any,
      stringifyData?: boolean,
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
}
