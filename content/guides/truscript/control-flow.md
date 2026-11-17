---
title: Control flow
description: Decide and repeat with if, while, for and range
---

# Control flow

TruScript has one decision statement (`if`), two loops (`while` and `for`), and three statements that jump out of them (`break`, `continue` and `return`).

## if, elif and else

`if` runs its body when its condition is [truthy](truthiness.md). Add `else` for what should happen otherwise, and any number of `elif` ("else if") branches in between.

This script picks a rank for a score of 75 with an `if`, `elif` and `else` chain.

```truscript
local score = 75
local rank = nil
if score > 100:
    rank = "gold"
elif score > 50:
    rank = "silver"
elif score > 10:
    rank = "bronze"
else:
    rank = "none"
print(rank)     # prints silver
```

It prints `silver`.

The branches of an `if` are tested from top to bottom; the first one whose condition is truthy runs, and the rest are skipped.

The keyword is `elif`. Writing `else if` on one line is a syntax error. Where you wrote `else if`, write `elif`.

`if x = 5:` is also a syntax error; see [Assignment](operators.md#assignment).

To choose between many values, use an `elif` chain, or look the answer up in a table when every branch does the same kind of thing.

## while

A `while` loop tests its condition, runs its body if the condition is truthy, and repeats. For a loop that runs at least once, write `while true:` and leave with `break` when you are done.

See [loops that never end](../scripting/waiting-and-tasks.md#loops-that-never-end).

## for

A `for` loop runs its body once for each value that something provides. The loop variable is set to each value in turn.

This script prints each element of an array with a `for` loop.

```truscript
for fruit in ["apple", "pear", "melon"]:
    print(fruit)
# prints:
# apple
# pear
# melon
```

It prints `apple`, then `pear`, then `melon`.

A `for` loop has exactly one loop variable. `for key, value in tbl:` is a syntax error. You cannot loop over a string, a number or `nil`. Looping over `nil` is the common mistake of the three: a variable you expected to hold an array holds `nil`.

| Looping over | The loop variable gets |
|---|---|
| an array | Looping over an array, the loop variable receives each element, first to last. |
| a table | Looping over a table, the loop variable receives each key. Use `tbl[key]` to get the value. Do not rely on the order of keys. |
| `range(...)` | Looping over `range(...)`, the loop variable receives each number in the range. |

## Changing what a for loop visits

A `for` loop over an array goes through the items the array had when the loop started: adding or removing items during the loop does not change which are visited. A `for` loop over a table also visits what the table held when the loop started: adding to or removing from the table inside the body does not change what it visits.

It is safe to remove elements from an array or table while a `for` loop goes over it.

## range

The stop value of [range](api:global/range) is never included, so `range(arr.length)` gives exactly the valid indexes of an array. Counting down with `range` needs a negative step: `range(3, 0, -1)` gives 3, 2, 1.

Counting down with `range` without a step is an error: `range(10, 0)` stops the script.

`range` does not build an array. It produces a one-time sequence that a `for` loop consumes. Call `range` directly in the `for` line each time.

| Form | Counts |
|---|---|
| `range(stop)` | `range(stop)` counts from 0 up to, but not including, `stop`: `range(3)` gives 0, 1, 2. |
| `range(start, stop)` | `range(start, stop)` counts from `start` up to, but not including, `stop`: `range(1, 4)` gives 1, 2, 3. |
| `range(start, stop, step)` | `range(start, stop, step)` counts from `start`, adding `step` each time, stopping before `stop`: `range(0, 10, 3)` gives 0, 3, 6, 9. |

## break and continue

Inside a loop, `break` leaves the loop immediately. Execution continues after the loop. Inside a loop, `continue` skips the rest of the current pass: a `while` loop tests its condition again, a `for` loop takes the next value. `break` and `continue` affect only the innermost loop they are written in.

If the statement that moves a `while` loop forward comes after a `continue`, it is skipped and the loop never ends. In a `while` loop, advance before any `continue`.

## return outside a function

`return` is also allowed outside any function. There it stops the top level of the script: the statements below it do not run. For `return` in a function, see [Functions](functions.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says a `:` was expected after an else statement, but it found `if`: `Expected ':' after else statement, got 'if'` | Where you wrote `else if`, write `elif`. See [if, elif and else](#if-elif-and-else). |
| A `for` loop stops the script with an error saying `nil` cannot be enumerated: `Cannot enumerate nil.` | Check that the variable holds an array before the loop. See [for](#for). |
