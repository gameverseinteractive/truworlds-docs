---
title: Value types
description: Every kind of value, how each turns into text, and converting between them
---

# Value types

You never write a type next to a variable: a variable holds whatever value you last put in it, and the value carries its own type, as [Variables and scope](variables-and-scope.md) showed.

## The kinds of value

| Kind | What it is |
|---|---|
| nil | `nil` is "no value". You get one by writing `nil`. |
| boolean | A boolean is a yes or no answer: `true` or `false`. |
| number | A number is any number, whole or fractional, such as `42`, `3.14` or `1e6`. |
| string | A string is text, written `"hi"` or `'hi'`. |
| function | A function is code you can call. You get one with `func`, `expr`, or a built-in such as [print](api:global/print). |
| array | An array is an ordered list of values, such as `[1, 2, 3]`. |
| table | A table is a set of keys, each with a value, such as `{ coins = 5 }`. |
| object | An object is a value of a type the engine provides, such as `new Part()`, `new Vector3(0, 5, 0)`, [game](api:global/game) or [this](api:global/this). |
| type | A type is an engine type itself: a name such as [Vector3](api:Vector3) or [Part](api:Part). |

## Copied or shared

Simple values (nil, booleans, numbers, strings) behave as independent copies. Changing one variable never affects another.

Assigning an array, a table or a function to a second variable, or passing it to a function, does not copy it: both names refer to the same one, and a change through one is seen through the other. See [Data types](../engine/data-types.md) for data-type values.

## nil

`nil` is the only "nothing" value in TruScript. Calling a function or method that does a job and has no result, such as `arr.push(x)`, gives `nil`.

Using `nil` where a real value is needed stops the script.

To check whether a value is nil, compare it with `nil`. This is the check you will write most.

## Booleans and numbers

Booleans are not numbers: arithmetic on a boolean is an error.

There is one number type. It holds whole numbers and fractions alike; `3` and `3.0` are the same value. Some decimal fractions cannot be stored exactly: `0.1 + 0.2` is `0.30000000000000004`. A number literal written `.5` is an error.

## NaN and infinity

NaN ("not a number") is a special number value: the result of a calculation with no answer. Dividing by zero, taking a remainder by zero, `math.sqrt(-1)` and `tonumber("abc")` all give NaN. NaN spreads: any arithmetic involving NaN gives NaN.

Infinity is a special number value: the result of a calculation too large to store, such as `1e308 * 10`. There is a negative infinity too. See [dividing by zero](operators.md#arithmetic).

## Values as text

A value is converted to text when you [print](api:global/print) it, join it to a string with the plus operator, or pass it to [tostring](api:global/tostring).

An instance in the world's tree prints as its [Name](api:Instance.Name), with nothing around it: a part renamed `Crate` prints `Crate`, a new part prints `Part`, `print(world)` prints `World` and `print(game)` prints `DataModel`.

| Value | As text |
|---|---|
| number | As text, a number is the shortest form that identifies the number. Whole numbers have no decimal point: `100`, not `100.0`. |
| array | As text, an array is `[1, 2, 3]`. Elements are converted the same way, so strings inside appear without quotes: `[1, a]`. |
| table | As text, a table is `{ key = value, other = value }`. |
| object | As text, an object depends on its type. Data types show their contents, for example `Vector3(1, 2, 3)`. |

## Checking what kind a value is

TruScript has no general `type()` or `typeof()` function. To test for nil, compare with `nil`. For engine instances, use `obj.IsA("ClassName")` and [obj.ClassName](api:TruWorldsObject.ClassName).

For [IsA](api:TruWorldsObject.IsA), see [Testing the class](../engine/instance-tree.md#testing-the-class).

## Converting between types

TruScript converts automatically in exactly two situations: any value is tested for truthiness in a condition, and any value is turned into text when joined to a string.

Text is never silently turned into a number: `"3" + 4` is the string `"34"`, and `"3" * 4` is an error.

[tostring](api:global/tostring), [tonumber](api:global/tonumber) and [tobool](api:global/tobool) each take exactly one argument. Any other count is a runtime error.

Always check the result of `tonumber` with [math.is_nan](api:global/math.is_nan) before using it.

| Function | What it gives |
|---|---|
| [tostring](api:global/tostring) | `tostring(value)` gives the value's text form. It works on every value. |
| [tonumber](api:global/tonumber) | `tonumber(value)` reads the value's text as a number, accepting a sign, a fraction, scientific notation and spaces around it. Anything else gives NaN (`"abc"`, `""`, `"1,000"`, `"0x10"`, `true`, `nil`); it never raises an error. |
| [tobool](api:global/tobool) | `tobool(value)` gives the value's truthiness, with one exception: the exact string `"false"` gives `false`. `"False"`, `"0"` and `"no"` are ordinary non-empty strings and give `true`. |
