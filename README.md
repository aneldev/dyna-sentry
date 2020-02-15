# dyna-sentry

Puts some sugar onto Sentry.

Send issues easily with Data and special Scope from one method. 

Convert the `console.error`, `console.warn` etc.. to Sentry Issues.

# Setup to Convert consoles to issues

This is only what is needed.

```
// Initialize the Sentry as you do
import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: "https://<your sentry link>",
});

// Instantiate the DynaSentry
import {DynaSentry, EConsoleTypes} from "dyna-sentry";
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

Whenever your app `console.error` or `console.warn` an issue will be sent to entry.

The first argument of the console is used as the Title of the issue and all the rest as Additional Data.

You can filter out consoles to not send them to Sentry. _This is needed when you send the Logs also, since Sentry is consoling the POST for each sent issue._

Check out this DynaSentry setup.

```
// Instantiate the DynaSentry
import {DynaSentry, EConsoleTypes} from "dyna-sentry";
const dynaSentry = new DynaSentry({
    Sentry,
    captureConsole: {
        consoleTypes: [
            EConsoleTypes.ERROR,
            EConsoleTypes.WARN,
            // LOG, INFO, DEBUG are also available
        ],
        filter: (consoleType, consoleArgs) => {
            const text = consoleArgs[0];
            if (text.indeOf('invalid customer id') return false;
            return true;
        },
    },
});

```

# Setup to Send issues manually

You can both `sendIssues` with the same setup to Convert consoles to issues.

```
// Initialize the Sentry as you do
import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: "https://<your sentry link>",
});

// Instantiate the DynaSentry
import {DynaSentry} from "dyna-sentry";
const dynaSentry = new DynaSentry({Sentry});

// Wherever in your app send an issue to Sentry
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: {email},
});
```

# Send issue method `sendIssue`

## Set Level (Severity)

Default is Error.

There is an enum to get this easily and type-safe.

```
import {ELevel} from "dyna-sentry";

dynaSentry.sendIssue({
    level: ELevel.WARN,
    title: 'Cannot send email',
    data: {email},
    stringifyData: false,
});
```

The Enum

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

## Send a issue's data stringified

When you stringify the data, you can see the whole depth of the object on Sentry.

> **Tip:** The data stringify of the `sendIssue` can process objects with circular references with out exceptions, thanks to [dyna-stringify](https://github.com/aneldev/).

```
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: {email},
    stringifyData: true,
});
```

## Set Scope

Sentry offers a lot of methods to define the Scope of the issue.  

`sendIssue` offers a callback to define anything Sentry offers.

```
dynaSentry.sendIssue({
    title: 'Cannot send email',
    data: {email},
    stringifyData: false,
    setScope: scope => {
        scope.setUser({id: "204523"});
        scope.setTag('id24534', 'Network layer');
    },
});
```
## Sentry's Scope methods

There is no a clear a API for all methods of Sentry's scope, below interface Scope. Taken from @sentry/types/dist/scope.d.ts.

If you write in typescript you can inspect all methods and types. If not, search for each method at [Sentry's API](https://docs.sentry.io/enriching-error-data/scopes/?platform=javascript)

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

Config for `new DynaSentry(config: IDynaSentryConfig)`.

```
IDynaSentryConfig {
  Sentry: Sentry;
  captureConsole?: {
    consoleTypes?: EConsoleType[];  // default: empty (none)
    stringify?: boolean;            // default: false
    filter?: (consoleType: EConsoleType, consoleArgs: any[]) => boolean;
  };
}
```

## method `sendIssue`
```
public sendIssue(
    options: {
        title: string;
        level?: ELevel;
        data?: any;
        stringifyData?: boolean;    // default: false
        setScope?: (scope: Sentry.Scope) => void;
    }
): void
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

