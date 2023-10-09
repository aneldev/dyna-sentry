# dyna-sentry

Enhances Sentry with additional features.

Easily send issues with data and a special scope using a single method.

Convert `console.error`, `console.warn`, etc., to Sentry Issues.

## Setup to Convert Consoles to Issues

This is all that is required:

```
// Initialize Sentry as you normally do
import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: "https://<your Sentry link>",
});

// Instantiate DynaSentry
import { DynaSentry, EConsoleTypes } from "dyna-sentry";
const dynaSentry = new DynaSentry({
    Sentry,
    captureConsole: {
        consoleTypes: [
            EConsoleTypes.ERROR,
            EConsoleTypes.WARN,
            // LOG, INFO, DEBUG are also available
        ],
    },
});
```

Whenever your app encounters `console.error` or `console.warn`, an issue will be sent to Sentry. The first text argument of the console is used as the title of the issue, and everything else is included as additional data.

## Filter Consoles

You can filter out specific consoles to prevent them from being sent to Sentry. This is necessary when you are also logging the POST requests for each sent issue.

```
import { DynaSentry, EConsoleTypes } from "dyna-sentry";
const dynaSentry = new DynaSentry({
    Sentry,
    captureConsole: {
        consoleTypes: [
            EConsoleTypes.ERROR,
            EConsoleTypes.WARN,
            // LOG, INFO, DEBUG are also available
        ],
        filter: (consoleType, consoleArgs, consoleText) => {
            if (consoleText.indexOf('invalid customer id') !== -1) return false;
            return true;
        },
    },
});
```

## Filter out Consoles with Text

You can easily filter out consoles that contain specific text and prevent them from being sent to Sentry. This is useful when you want to exclude certain messages from being logged.

```
import { DynaSentry, EConsoleTypes } from "dyna-sentry";
const dynaSentry = new DynaSentry({
    Sentry,
    captureConsole: {
        consoleTypes: [
            EConsoleTypes.ERROR,
            EConsoleTypes.WARN,
            // LOG, INFO, DEBUG are also available
        ],
        filterOut: {
            texts: [
                "DEBUG-3052",
                "[Violation]",
            ],
        },
    },
});
```

## Setup to Send Issues Manually

```
// Initialize Sentry as you normally do
import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: "https://<your Sentry link>",
});

// Instantiate DynaSentry
import { DynaSentry } from "dyna-sentry";
const dynaSentry = new DynaSentry({ Sentry });

// Send an issue to Sentry from anywhere in your app
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: { email },
});
```
> Note: You can use `sendIssue` with or without the `captureConsole` setup.

## Sending an Issue Using the `sendIssue` Method

### Set Severity Level

The default level is "Error." You can easily set it using an enum.

```
import { ELevel } from "dyna-sentry";

dynaSentry.sendIssue({
    level: ELevel.WARN,
    title: 'Cannot send email',
    data: { email },
    stringifyData: false,
});
```

The `ELevel` Enum:

```
enum ELevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warning",
  LOG = "log",
  INFO = "info",
  DEBUG = "debug",
  CRITICAL = "critical"
}
```

### Send Issue Data as a String

When you stringify the data, you can see the entire depth of the object on Sentry.

Tip: The data stringify of the `sendIssue` can process objects with circular references without exceptions, thanks to dyna-stringify.

```
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: { email },
    stringifyData: true,
});
```

### Set Scope

Sentry offers numerous methods to define the scope of the issue. sendIssue provides a callback to define anything that Sentry offers.

```
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: { email },
    stringifyData: false,
    setScope: scope => {
        scope.setUser({ id: "204523" });
        scope.setTag('id24534', 'Network layer');
    },
});
```
## Sentry's Scope Methods

There is no clear API for all of Sentry's scope methods. Below is an interface for the scope, taken from @sentry/types/dist/scope.d.ts. If you are using TypeScript, you can inspect all methods and types. If not, you can search for each method in Sentry's API.

``` 
export interface Scope {
    /** Add new event processor that will be called after {@link applyToEvent}. */
    addEventProcessor(callback: EventProcessor): this;
    /**
     * Updates user context information for future events.
     *
     * @param user User context object to be set in the current context. Pass `null` to unset the user.
     */
    setUser(user: User | null): this;
    /**
     * Set an object that will be merged sent as tags data with the event.
     * @param tags Tags context object to merge into current context.
     */
    setTags(tags: {
        [key: string]: string;
    }): this;
    /**
     * Set key:value that will be sent as tags data with the event.
     * @param key String key of tag
     * @param value String value of tag
     */
    setTag(key: string, value: string): this;
    /**
     * Set an object that will be merged sent as extra data with the event.
     * @param extras Extras object to merge into current context.
     */
    setExtras(extras: {
        [key: string]: any;
    }): this;
    /**
     * Set key:value that will be sent as extra data with the event.
     * @param key String of extra
     * @param extra Any kind of data. This data will be normailzed.
     */
    setExtra(key: string, extra: any): this;
    /**
     * Sets the fingerprint on the scope to send with the events.
     * @param fingerprint string[] to group events in Sentry.
     */
    setFingerprint(fingerprint: string[]): this;
    /**
     * Sets the level on the scope for future events.
     * @param level string {@link Severity}
     */
    setLevel(level: Severity): this;
    /**
     * Sets the transaction on the scope for future events.
     * @param transaction string This will be converted in a tag in Sentry
     */
    setTransaction(transaction?: string): this;
    /**
     * Sets context data with the given name.
     * @param name of the context
     * @param context Any kind of data. This data will be normailzed.
     */
    setContext(name: string, context: {
        [key: string]: any;
    } | null): this;
    /**
     * Sets the Span on the scope.
     * @param span Span
     */
    setSpan(span?: Span): this;
    /** Clears the current scope and resets its properties. */
    clear(): this;
    /**
     * Sets the breadcrumbs in the scope
     * @param breadcrumbs Breadcrumb
     * @param maxBreadcrumbs number of max breadcrumbs to merged into event.
     */
    addBreadcrumb(breadcrumb: Breadcrumb, maxBreadcrumbs?: number): this;
    /**
     * Clears all currently set Breadcrumbs.
     */
    clearBreadcrumbs(): this;
}
``` 

# API

## DynaSentry config

Configuration for new DynaSentry(config: IDynaSentryConfig).

```
IDynaSentryConfig {
  Sentry: any;
  captureConsole?: {
    consoleTypes?: EConsoleType[];  // default: empty (none)
    stringifyData?: boolean;        // default: false
    filter?: (consoleType: EConsoleType, consoleArgs: any[], consoleText: string) => boolean;
    filterOut?: IFilterOut;
    setScope?: (scope: Sentry.Scope) => void;
  };
}
```

## method `sendIssue`
```
public sendIssue(options: {
    title: string;
    level?: ELevel;
    data?: any;
    stringifyData?: boolean;    // default: false
    setScope?: (scope: Sentry.Scope) => void;
}): void
```

## enum EConsoleType
```
export enum EConsoleType {
  ERROR = 'error',
  WARN = 'warn',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}
```
## enum ELevel
```
export enum ELevel {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warning",
  LOG = "log",
  INFO = "info",
  DEBUG = "debug",
  CRITICAL = "critical"
}```

## 

