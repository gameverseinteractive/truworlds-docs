---
title: Standard library
description: The math, random and host libraries, swap, and the other built-in globals
---

# Standard library

The standard library is what a script can use without creating or importing anything: a few global functions, and five libraries reached through the globals [math](api:global/math), [string](api:global/string), [table](api:global/table), [random](api:global/random) and [host](api:global/host). Library functions are called through their library: `math.floor(x)`, `string.upper(s)`, `table.count(t)`.

The members of a library cannot be replaced: `math.pi = 3` is a runtime error. See the [string library](strings.md#the-string-library) and the [table library](tables.md#the-table-library).

## math

The [math](api:global/math) library holds number functions and constants.

> [!WARNING]
> Engine properties such as a part's `Rotation` use degrees, while [math.sin](api:global/math.sin), [math.cos](api:global/math.cos) and the other trigonometry functions use radians. Convert with `math.rad(degrees)` and `math.deg(radians)`.

| Function | What it gives |
|---|---|
| [math.floor](api:global/math.floor) | `math.floor(x)` rounds toward negative infinity: `math.floor(3.7)` is `3`, `math.floor(-3.5)` is `-4`. |
| [math.min](api:global/math.min) | `math.min(a, b)` gives the smaller of two numbers. It takes exactly two arguments; for more, nest calls or use [reduce](api:builtin/array.reduce) on an array. |
| [math.clamp](api:global/math.clamp) | `math.clamp(value, min, max)` gives `value` limited to the range `min` to `max`. A `min` greater than `max` is a runtime error. |
| [math.is_nan](api:global/math.is_nan) | `math.is_nan(x)` is `true` when `x` is `NaN`. |

## Rounding

`math.round(x)` gives the nearest whole number, with exact halves going to the nearest even number: `math.round(2.5)` is `2`, `math.round(3.5)` is `4`. `math.round_digits(x, digits)` gives `x` rounded to `digits` decimal places. Halves go to the nearest even digit: `math.round_digits(3.14159, 2)` is `3.14`.

If you need halves to round up, write `math.floor(x + 0.5)`.

## random

Each running script has its own `random` generator, seeded unpredictably when the script starts. [random.between](api:global/random.between) including both ends is different from [range](api:global/range), which excludes its stop.

Roll anything that affects the game, such as loot or damage, in a server script.

| Function | What it gives |
|---|---|
| [random.between](api:global/random.between) | `random.between(min, max)` gives a random whole number from `min` to `max`, including both ends: `random.between(1, 6)` can return 6. |
| [random.nbetween](api:global/random.nbetween) | `random.nbetween(min, max)` gives a random fractional number from `min` up to, but not including, `max`. |
| [random.decimal](api:global/random.decimal) | `random.decimal()` gives a random fractional number from 0 up to, but not including, 1. |
| [random.seed](api:global/random.seed) | `random.seed(n)` sets the seed so that the same sequence of numbers follows every time. |

## host

[host.format_date](api:global/host.format_date) and [host.format_date_local](api:global/host.format_date_local) take the pattern first, then the time. See [measuring time](../networking/frames-and-time.md#loops-with-wait).

| Function | What it gives |
|---|---|
| [host.time](api:global/host.time) | `host.time()` gives the current time in seconds since 1 January 1970 00:00 UTC (a Unix timestamp), with millisecond precision. |
| [host.format_date](api:global/host.format_date) | `host.format_date(format, time)` writes the timestamp `time` out as UTC date and time text according to the pattern `format`. |

## swap

`swap(a, b)` exchanges the values of two variables. The variables are named as strings. A temporary variable does the same job as [swap](api:global/swap) and is clearer.

## Other global functions

For [tostring, tonumber and tobool](value-types.md#converting-between-types), [print, warn and error](../scripting/errors-and-debugging.md), [wait and spawn](../scripting/waiting-and-tasks.md) and [import](../scripting/modules-and-import.md), see their pages.

## What is not in the library

| Missing | Write instead |
|---|---|
| `len(x)` or `#x` | There is no `len(x)` or `#x`: use `x.length` for arrays and strings, and `table.count(t)` for tables. |
| `pairs(t)` or `ipairs(t)` | There is no `pairs(t)` or `ipairs(t)`: use `for key in t:` for tables and `for item in list:` for arrays. |
| `math.random` or `math.randomseed` | There is no `math.random` or `math.randomseed`: use [random.between](api:global/random.between), [random.decimal](api:global/random.decimal) and [random.seed](api:global/random.seed). |
| `math.min` or `math.max` of many values | There is no [math.min](api:global/math.min) or `math.max` of many values: use `list.reduce(expr(acc, n): math.min(acc, n), math.huge)`. |
