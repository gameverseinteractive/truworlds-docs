---
title: Error handling
description: Raise and catch errors with throw, try, catch and finally
---

# Error handling

`try` runs a block and lets you react if something in it fails. `throw` raises an error on purpose: execution stops at that line and jumps to the nearest enclosing `catch`. An error nothing catches is covered in [Errors and debugging](../scripting/errors-and-debugging.md).

## try, catch and finally

This script reads a position past the end of an array inside `try` and prints the error message in `catch`.

```truscript
local items = ["sword", "shield"]

try:
    print(items[5])
    print("this line is skipped")
catch e:
    print("could not read the item: " + e.message)

print("the script continues")

# could not read the item: Array index out of range
# the script continues
```

When a runtime error occurs anywhere inside a `try` block, directly or in a function it calls, execution jumps to the `catch` block and then continues after the whole statement. A `try` needs at least a `catch` or a `finally`. `try` does not undo anything. Lines that ran before the failure keep their effect.

A `break` or `continue` inside a `try` still runs the `finally` block on the way out. A `return`, `break` or `continue` written directly inside a `finally` block is a compile error.

| Part | What it does |
|---|---|
| `try` | `try:` holds the block to attempt. If any line of it fails, the rest of the block is skipped. |
| `catch` | `catch e:` runs only if the `try` block failed, and `e` is the value that was thrown; `catch:` with no name also works. |
| `finally` | `finally:` runs afterwards in every case: success, failure, or an early `return`. It is optional. |

## What catch does not see

Almost every runtime error can be caught, including the ones raised by the language itself. `try` does not catch syntax errors. Those stop the script from starting.

For [error()](api:global/error) and stopping a script, see [Stopping a script on purpose](../scripting/errors-and-debugging.md#stopping-a-script-on-purpose).

## The Error type

One object type belongs to the language itself: `Error`, which describes a failure. The `Error` constructor needs exactly one string. The two properties of `Error`, `message` and `stackTrace`, are read-only and lower camel case, unlike engine types' capitalized member names.

Errors raised by TruWorlds itself are always `Error` objects, so `e.message` and `e.stackTrace` work for them.

## Throwing your own errors

Any value can be thrown. Throw when a function is asked to do something it cannot do correctly and the caller should know. Do not throw for ordinary outcomes: "the player cannot afford this" is a normal result (return `false`), not an error.

If there is no enclosing `catch`, a thrown error stops the task and is reported in the Console, exactly like a built-in error.

> [!WARNING]
> A thrown string has no `.message`, and reading `e.message` on it is a runtime error raised inside your `catch` block. If a `try` body can produce both a built-in error and a string, always throw `Error` objects, or print the error with `tostring(e)`.

| Form | What the catcher gets |
|---|---|
| `throw new Error("message")` | `throw new Error("message")` is the standard form. An `Error` has a `message` and, once thrown, a `stackTrace`. Converting it to text gives `Error: message`. |
| `throw "message"` | `throw "message"` throws a plain string. It is simple, but the catcher gets no `message` or `stackTrace` members. |
| `throw { ... }` | `throw { code = 404, reason = "not found" }` throws a table, for when the catcher needs structured details. |
| `throw` | `throw` alone, inside a `catch`, re-raises the error currently being handled. |

## Rethrowing

A `catch` cannot accept only certain kinds of errors: one `catch` receives everything; inspect the value and rethrow what you do not want. Use a bare `throw` when a `catch` decides the error is not one it should handle.

A bare `throw` is only allowed directly inside a `catch` block. Anywhere else it is a compile error.

## Mistakes that raise no error

Some mistakes produce a quiet value instead of an error, so the script keeps going with something unexpected. When a value is unexpectedly `nil`, a mistake that produces a quiet value instead of an error is the usual cause.

[FindFirstChild](api:Instance.FindFirstChild) with no matching child is not an error: it gives `nil`. Quiet values also come from [dividing by zero](operators.md#arithmetic), [reading a missing table key](tables.md#reading-and-writing-entries), [calling your own function with too few arguments](functions.md#arguments), [a function that ends without return](functions.md#return-values) and [assigning to a misspelled variable name](variables-and-scope.md#globals-by-default).

For an operation that produces a quiet value instead of an error, `try` has nothing to catch: check the result instead.

## Hiding errors

An empty `catch:` that ignores every error makes bugs invisible. Do not use `try` to hide problems. At least [warn](api:global/warn) what happened.

## Problems found before a script runs

A script is checked before it runs: when you edit it, and again when it is about to start. See [the Problems panel](../creator/script-editor.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Inside a catch block, an error says string has no member named message: `string has no member named 'message'.` | Throw `Error` objects, or print the error with `tostring(e)`. See [Throwing your own errors](#throwing-your-own-errors). |
