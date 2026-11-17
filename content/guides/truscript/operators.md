---
title: Operators
description: Arithmetic, equality, ordering, assignment and precedence
---

# Operators

TruScript's operators do arithmetic (`+`, `-`, `*`, `/`, `%`), compare values (`==`, `!=`, `<`, `<=`, `>`, `>=`), combine conditions with `not`, `and` and `or`, step a number with `++` and `--`, and call, index and reach members with `f(...)`, `x[...]` and `x.name`. See [Truthiness and logic](truthiness.md) for `not`, `and` and `or`.

## Arithmetic

Division never rounds: `7 / 2` is `3.5`. The remainder works with fractions, and the result takes the sign of the left value.

Dividing by zero is not an error: it gives [`NaN`](value-types.md#nan-and-infinity). `NaN` counts as false in a condition.

Check with `math.is_nan(x)` when a divisor might be zero.

> [!WARNING]
> Two minus signs with nothing between them are the decrement operator, not a double negative: `--5` is a syntax error. Write `-(-5)` or put the inner value in a variable.

Text is never silently turned into a number: see [Converting between types](value-types.md#converting-between-types).

| You want | Write |
|---|---|
| Power | For a to the power b, write `math.pow(a, b)`. |
| Whole-number division | For whole-number division, write `math.floor(a / b)`. |

## Equality

`==` and `!=` accept any two values and never raise an error.

| Values | Equal when |
|---|---|
| nil | `nil` is equal only to `nil`: only `nil == nil`. |
| numbers | Numbers are equal when they differ by less than one ten-billionth (`1e-10`). So `0.1 + 0.2 == 0.3` is `true`. |
| strings | Strings are equal when they have the same characters in the same order. Case matters: `"A" == "a"` is `false`. |
| arrays, tables, functions | Arrays, tables and functions are equal when they are the very same array, table or function. Two separate arrays with the same contents are not equal. |
| objects | Objects are equal when they are the very same object. |

## Ordering

The four ordering operators (less than, less than or equal, greater than, greater than or equal) compare two numbers or two strings and give a boolean. Comparing anything other than two numbers or two strings stops the script.

The most common cause of an ordering error is a value that is `nil` when you expected a number, such as a table key that was never set. Before an ordering comparison, check for `nil` first, or give a default with `or`; see [defaults with or](truthiness.md#defaults-with-or).

Comparisons do not chain: `1 < x < 10` compares `1 < x` first, then compares that boolean with 10, which is an error. To test whether a value is between two others, join two comparisons with `and`.

This script tests whether a value is between 1 and 10 with two comparisons joined by `and`.

```truscript
local x = 5
if x > 1 and x < 10:
    print("in range")   # prints in range
```

It prints `in range`.

## Increment and decrement

Two plus signs add one to a variable. Two minus signs subtract one. Increment and decrement work on a plain variable name only. `arr[0]++` and `player.score--` are syntax errors.

To add one to an element or member, use compound assignment instead: `arr[0] += 1`.

## Assignment

Assignment, with `=` and its compound forms, is a statement that gives no value, so it cannot be used inside an expression. It follows that `if x = 5:` is a syntax error.

A compound assignment applies an arithmetic operator and stores the result back. `x += 5` means `x = x + 5`. Compound assignment works on every kind of target, which makes it the replacement for `++` and `--` on elements and members.

## Operators on engine values

Engine data types can define what the arithmetic operators mean for them. See [Data types](../engine/data-types.md) for arithmetic on data types.

## Precedence

Brackets override precedence.

| Level | Operators |
|---|---|
| 1 | Precedence level 1, the highest: call `f()`, index `x[i]`, member `x.name`, and postfix increment and decrement, grouped left to right. |
| 2 | Precedence level 2: prefix increment and decrement, `not`, and negation `-x`, each applied to what follows. |
| 3 | Precedence level 3: multiply, divide and remainder, grouped left to right. |
| 4 | Precedence level 4: add and subtract, grouped left to right. |
| 5 | Precedence level 5: less than, less or equal, greater than and greater or equal, grouped left to right. |
| 6 | Precedence level 6: equal and not equal, grouped left to right. |
| 7 | Precedence level 7: `and`, grouped left to right. |
| 8 | Precedence level 8, the lowest: `or`, grouped left to right. |

## Operators TruScript does not have

There are no other operators: no colon call syntax, no `&&` or `||`, no `!` for not, no `**` for powers, no `//` for whole-number division, no `..` for joining strings, no `? :` conditional and no bitwise operators.

## Troubleshooting

| What you see | Fix |
|---|---|
| `nil < 1` stops the script, and the error says it cannot compare less between Nil and a Number: `Cannot compare less between types Nil and Number` | Check for `nil` first, or give a default with `or`. See [Ordering](#ordering). |
| `1 < x < 10` stops the script, and the error says it cannot compare less between a Boolean and a Number: `Cannot compare less between types Boolean and Number` | Join two comparisons with `and`. See [Ordering](#ordering). |
| `arr[0]++` or `player.score--` is a syntax error that says an identifier was expected before `++` or `--`: `Expected identifier before ++/--` | Use compound assignment instead: `arr[0] += 1`. See [Increment and decrement](#increment-and-decrement). |
