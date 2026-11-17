---
title: Errors and debugging
description: Read errors and stack traces, and report problems from scripts
---

# Errors and debugging

A problem found before the script runs is a syntax error (a compile error). A problem found while the script runs is a runtime error. For what a syntax error does to a script, see [When a script runs](what-is-a-script.md#when-a-script-runs). A syntax error shows as a red error line in the Console panel. Everything scripts print, and every error, goes to the Console panel; see [Console and Edit History](../creator/script-console.md). An error in a [client script](script-types.md#client-scripts) is reported by that player's session, not by the server.

## Reading an error

The first part of an error is the message, which says what went wrong, in words. The second part names the script file and the instance it was attached to, which tells you which copy failed. For a module, it names the module's path instead.

The third part is the stack trace: one or more lines starting with `-- At Line`, each giving a position as `line:column - line:column`, where a piece of code starts and where it ends. When an error happens inside a function that was called from another function, the stack trace has one line for each step on the way there.

Read a stack trace of several lines from the bottom.

## What an error stops

An uncaught error stops the [task](waiting-and-tasks.md) it happened in: the rest of the top level, that one run of a signal handler, or that spawned task. This server script, attached to a part, connects a `Touched` handler that prints who touched the part, then reads a member through a `nil` variable at the top level, followed by one more print.

```truscript
this.Touched.Connect(func(other):
    print("Touched by " + other.Name)     # keeps working
)

local missing = nil
missing.Explode()                          # error: the top level stops here
print("never printed")
# Output:
# nil has no member named 'Explode'.
# Script '...' on object Part
# -- At Line ...
# Touched by Avatar          (later, each time the part is touched)
```

It prints `nil has no member named 'Explode'.`, then the script and object line and the stack trace, and then `Touched by Avatar` each time the part is touched.

Everything else carries on after an uncaught error: connections made before it stay connected, other handlers still run, and the same handler runs again the next time its signal fires.

## Writing to the Console

| Function | What it does |
|---|---|
| [print](api:global/print) | `print(...)` writes an ordinary line. It takes any number of values and joins them with spaces. |
| [warn](api:global/warn) | `warn(...)` writes a warning line. The script continues. |
| [error](api:global/error) | `error(...)` writes an error line. The script continues: it does not stop anything. |

## Stopping a script on purpose

> [!WARNING]
> `error()` is a logging function: it writes a red line and the script carries on. To stop, use `throw`.

For `throw`, see [Error handling](../truscript/error-handling.md).

## Calls that can fail

Calls that reach outside your script, such as saving data, web requests, a function another script bound or a module that may be missing, can fail even when your code is right. Wrap calls that reach outside your script in `try`: data stores, web requests, [InvokeAsync](api:LocalFunction.InvokeAsync) and optional imports. For `try`, see [Error handling](../truscript/error-handling.md).

## Typo suggestions

Reading or writing a name that is not a member is an error; see [No properties of your own](../engine/properties-methods-signals.md#no-properties-of-your-own). When a name that is not a member is close to a real one, the error message suggests what you probably meant.

Suggestions cover members of instances. A wrong name on a data type such as [Vector3](api:Vector3), or a wrong variable name, gives the plain message without a suggestion.

## Finding a bug with print

To see whether a script is running at all, put `print("started", this.Name)` on its first line. If nothing prints, see [the conditions for a script to run](what-is-a-script.md#when-a-script-runs).

A script can seem to print nothing because it is a client script and you are looking at the server's console, or the other way round; see [When a script runs](what-is-a-script.md#when-a-script-runs). To see whether execution reaches the line you care about, add a `print` just before it.

## Errors about nil

Reading a member through something that is `nil` is an error. Assigning a member through something that is `nil` is an error.

When a member is read or set through something that is `nil`, the fault is earlier: find out why the thing on the left of the dot is `nil` (a failed [FindFirstChild](api:Instance.FindFirstChild), a [WaitForChild](api:Instance.WaitForChild) that timed out, a function that returned nothing).

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says nil has no member with the name you used: `nil has no member named 'name'.` | Find out why the thing on the left of the dot is `nil`; see [Errors about nil](#errors-about-nil). |
| An error says a member cannot be set on nil: `Cannot set member 'name' on nil.` | Find out why the thing on the left of the dot is `nil`; see [Errors about nil](#errors-about-nil). |
