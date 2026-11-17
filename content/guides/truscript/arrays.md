---
title: Arrays
description: "Ordered lists: indexing, iteration, copying, sorting and array members"
---

# Arrays

Arrays start at 0, so the last item of a three-item array is `items[2]`. Negative indexes count back from the end of an array (`items[-1]` is the last item), and are out of range only past the first item.

This script reads elements by position, assigns to one, and adds to one with compound assignment.

```truscript
local items = ["a", "b", "c"]
print(items[0])    # a
print(items[2])    # c

items[1] = "B"
print(items)       # [a, B, c]

items[0] += "!"    # compound assignment works on an element
print(items[0])    # a!
```

## Positions that do not exist

Reading or writing an array position that does not exist is a runtime error, after negative positions are resolved. Arrays never grow by assignment. An array position must be a number. Anything else is a runtime error; in particular `items["0"]` does not work.

To add elements to an array, use [push](api:builtin/array.push) or [insert](api:builtin/array.insert). To check an array position first, compare it with [length](api:builtin/array.length). An array's `length` is a read-only property, written without parentheses: `list.length`.

## Changing an array

[push](api:builtin/array.push), [pop](api:builtin/array.pop), [insert](api:builtin/array.insert), [remove](api:builtin/array.remove), [remove_at](api:builtin/array.remove_at), [clear](api:builtin/array.clear) and [shuffle](api:builtin/array.shuffle) change the array in place. [map](api:builtin/array.map), [filter](api:builtin/array.filter) and [sort](api:builtin/array.sort) return a new array and leave the original alone.

Before calling `pop`, check that the array's `length` is greater than 0.

| Member | What it does |
|---|---|
| [push](api:builtin/array.push) | `push(value)` changes the array: it adds `value` to the end. |
| [pop](api:builtin/array.pop) | `pop()` changes the array: it removes the last element and returns it. It is an error on an empty array. |
| [insert](api:builtin/array.insert) | `insert(index, value)` changes the array: it inserts `value` at `index`, moving later elements up by one. |
| [remove_at](api:builtin/array.remove_at) | `remove_at(index)` changes the array: it removes the element at `index` and returns it. |
| [remove](api:builtin/array.remove) | `remove(value)` changes the array: it removes the first element equal to `value`, and does nothing if there is none. |
| [index_of](api:builtin/array.index_of) | `index_of(value)` does not change the array: it gives the position of the first element equal to `value`. |
| [contains](api:builtin/array.contains) | `contains(value)` does not change the array: it tells whether any element equals `value`. |

## Members that take a function

[map](api:builtin/array.map), [filter](api:builtin/array.filter), [reduce](api:builtin/array.reduce), [find](api:builtin/array.find), [for_each](api:builtin/array.for_each), [some](api:builtin/array.some), [every](api:builtin/array.every) and [count](api:builtin/array.count) call the function you give them for each element, with the element and its zero-based position, `(item, index)`.

This script filters an array by its elements and by their positions.

```truscript
local numbers = [1, 2, 3, 4, 5, 6]
print(numbers.filter(expr(n): n % 2 == 0))    # [2, 4, 6]
print(numbers.filter(expr(n, i): i < 2))      # [1, 2]
```

For what a function you pass can use from the code around it, see [Closures](closures.md).

| Member | What it gives |
|---|---|
| [map](api:builtin/array.map) | `map(fn)` does not change the array: it gives a new array with each element replaced by `fn(item, index)`. |
| [filter](api:builtin/array.filter) | `filter(fn)` does not change the array: it gives a new array with only the elements for which `fn(item, index)` is truthy. |

## Sorting

`sort()` and `sort(fn)` do not change the array: they give a new, sorted array.

> [!WARNING]
> A line that only says `numbers.sort()` throws the sorted array away, and `numbers` keeps its old order. Always assign the result.

With no argument, [sort](api:builtin/array.sort) puts elements in ascending order using `<`, which works when every element is a number or every element is a string. A comparison function `fn(a, b)` given to `sort` answers one question: should `a` come before `b`? A truthy value means yes.

## Searching

[index_of](api:builtin/array.index_of), [contains](api:builtin/array.contains) and [remove](api:builtin/array.remove) compare elements with the `==` rule: by value for numbers, strings, booleans and `nil`. See [Equality](operators.md#equality).

To search an array by content, use [find](api:builtin/array.find), [some](api:builtin/array.some) or [filter](api:builtin/array.filter) with a function.

## Copying and joining

An array is shared, not copied, when you assign or pass it; see [Copied or shared](value-types.md#copied-or-shared).

The simplest copy of an array is [map](api:builtin/array.map) with a function that returns each element unchanged.

`+` does not join arrays: `[1, 2] + [3]` is a runtime error.

A `for` loop visits the items an array had when it started; see [Changing what a for loop visits](control-flow.md#changing-what-a-for-loop-visits).

## Arrays or tables

Use an array for a sequence. Use a table for a record with named fields or for looking things up by a key.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says an array index must be a number: `Array index must be a number` | Use a table for a record with named fields or for looking things up by a key. See [Positions that do not exist](#positions-that-do-not-exist) and [Arrays or tables](#arrays-or-tables). |
