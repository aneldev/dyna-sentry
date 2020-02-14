import Sentry from '@sentry/browser';

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
  constructor(sentry: any) {
    this.sentry = sentry;
  }

  public sendIssue(
    {
      title,
      level = ELevel.ERROR,
      data,
      stringifyData = true,
    }: {
      title: string,
      level?: ELevel,
      data?: any,
      stringifyData?: boolean,
    }
  ): void {
    this.sentry.withScope((scope: Sentry.Scope) => {
      Object.keys(data).forEach((key: string) => {
        scope.setExtra(
          key,
          stringifyData
            ? JSON.stringify(data[key], null, 2)
            : data[key],
        );
      });
      scope.setLevel(level as any);
      this.sentry.captureMessage(title);
    });
  }
}
