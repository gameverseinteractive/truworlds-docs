---
title: Truthiness and logic
description: Which values count as false, and what and, or and not give back
---

# Truthiness and logic

A condition in TruScript does not have to be a boolean. Every value is either truthy (counts as true) or falsy (counts as false) when it is tested. This rule is called truthiness.

## The five falsy values

There are exactly five falsy values: `nil`, `false`, the number `0`, NaN and the empty string. Everything else is truthy. An instance is always truthy.

| Value | Counts as |
|---|---|
| zero | The number `0` counts as false, including `-0` and `0.0`. |
| other strings | Any other string counts as true, including `"false"`, `"0"`, `"nil"` and a single space `" "`. |
| arrays | Any array counts as true, including the empty array `[]`. |
| tables | Any table counts as true, including the empty table `{}`. |

## Truthiness is not equality

Truthiness does not apply to equality: `0 == false` and `"" == nil` are `false`, because values of different types are never equal.

Never write `if x == true:` or `if x == false:`; write `if x:` and `if not x:`. The comparison fails for every truthy value that is not the boolean `true`. Use an explicit `nil` test (`if x == nil:`) when `0`, `false` or `""` are valid values.

## not

`not` gives `true` when its value is falsy and `false` when it is truthy. It always produces a boolean. When you need an actual `true` or `false`, for example to store in a [BoolValue](api:BoolValue), [print](api:global/print) or send to another script, apply `not` twice.

`not` sits above the comparison operators. `not a == b` therefore means `(not a) == b`, not `not (a == b)`. For `not (a == b)`, write the brackets, or use the not-equal operator.

## What `and` and `or` give back

`and` and `or` do not produce `true` or `false`. They return one of their two values, unchanged.

`or` returns its left value when that value is truthy, and its right value otherwise. `and` returns its left value when that value is falsy, so the right side is never evaluated.

`and` and `or` evaluate their right side only when the left side does not already decide the answer. Short-circuiting is what makes guards safe: in `player != nil and player.Name == "Pat"`, the name is only read when the player exists.

`and` binds tighter than `or`: `a or b and c` means `a or (b and c)`.

## Defaults with or

This script gives a default for a count of lives, first with `or` and then with an explicit `nil` test.

```truscript
local lives = 0
print(lives or 3)          # prints 3 (wrong when 0 lives is a real state)

local shown = lives
if shown == nil:
    shown = 3
print(shown)               # prints 0
```

It prints `3`, then `0`.

> [!WARNING]
> `or` replaces every falsy value, not only `nil`: `count or 10` turns a real `0` into `10`. When `0`, `false` or `""` are meaningful values, test for `nil` explicitly.

## Choosing between two values

`cond and a or b` is a common way to choose between two values. It returns `b` whenever `a` is falsy, even when `cond` is truthy.

Use the `cond and a or b` idiom only when the middle value can never be `nil`, `false`, `0`, NaN or `""`. For choosing with a statement instead, see [an if statement](control-flow.md).
