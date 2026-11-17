---
title: From other languages
description: Habits from Lua, Python and JavaScript, and features TruScript leaves out
---

# From other languages

TruScript is its own language. It looks familiar if you know other scripting languages, and habits from each of them trip you up somewhere. TruScript looks like Python, but behaves more like Lua or JavaScript.

## Coming from Lua

See [blocks and comments](syntax-basics.md#blocks-and-indentation), [falsy values](truthiness.md#the-five-falsy-values) and [array indexes](arrays.md).

| In Lua | In TruScript |
|---|---|
| `then` ... `end`, `do` ... `end` | Lua's `then` ... `end` and `do` ... `end` are a colon and an indented block in TruScript. There is no `end`. |
| `obj:Method(a)` | Lua's `obj:Method(a)` is `obj.Method(a)` in TruScript. Member calls always use a dot. There is no colon call and no implicit `self`. |
| `-- comment` | Lua's `-- comment` is `# comment` in TruScript. Block comments are delimited by three hashes. |
| Indexes from 1 | Where Lua indexes start at 1, TruScript array indexes start at 0. Index -1 is the last element. |
| `a .. b` | Lua's `a .. b` is `a + b` in TruScript. Plus joins text when either side is a string. |
| `~=` | Lua's `~=` is `!=` in TruScript. |
| `elseif` | Lua's `elseif` is `elif` in TruScript. |
| Falsy values | Where in Lua `nil` and `false` are the only falsy values, in TruScript `nil`, `false`, `0`, NaN and `""` are falsy. |
| `for i = 1, 10 do` | Lua's `for i = 1, 10 do` is `for i in range(1, 11):` in TruScript. |

## Coming from Python

See [globals and block scope](variables-and-scope.md#globals-by-default), [joining text](strings.md#joining) and [division](operators.md#arithmetic).

| In Python | In TruScript |
|---|---|
| Assignment in a function | Where in Python assignment in a function creates a local, in TruScript assignment creates a global unless the name was declared `local`. |
| Names in an `if` or loop | Where in Python a name assigned in an `if` or loop is visible afterwards, in TruScript `local` is block scoped: it is gone when the block ends. |
| `None`, `True`, `False` | Python's `None`, `True` and `False` are `nil`, `true` and `false` in TruScript. |
| Empty values | Where in Python an empty list, dict and string are falsy, in TruScript only `""` is falsy. Empty arrays and tables are truthy. |
| `f"hp: {hp}"` | Python's `f"hp: {hp}"` is `"hp: " + hp`, or `string.format("hp: {0}", hp)`, in TruScript. |
| `x // y`, `x ** y` | Python's `x // y` and `x ** y` are `math.floor(x / y)` and `math.pow(x, y)` in TruScript. |
| `1 / 0` | Where in Python `1 / 0` raises, in TruScript `1 / 0` is NaN. |
| `a if c else b` | Python's `a if c else b` has no TruScript equivalent. Use an `if` statement, or `c and a or b` with care. |

## Coming from JavaScript

There are no braces for blocks and no `var`, `let` or `const`. A variable is made by plain assignment (global) or `local` (block scoped, like `let`).

There is no `===`: `==` never converts types, so `1 == "1"` is `false`. There is no `undefined`: reading an unset variable throws, and a missing table key is `nil`.

Empty arrays and objects are truthy, as in JavaScript; `0`, `""` and NaN are falsy, as in JavaScript. See [equality](operators.md#equality) and [closures](closures.md).

## What TruScript leaves out

TruScript is a small language on purpose. Many features you may know from other languages are not there.

| Missing | Write instead |
|---|---|
| Ternary | There is no ternary operator `c ? a : b`, and `if` is not an expression. Use instead an `if` statement that assigns, or `c and a or b` when `a` can never be falsy. |
| Classes | There are no classes, no inheritance and no `self`. Use instead tables of data and functions, closures, and several scripts on one instance. |
| Parameters | There are no default, named, optional or variadic parameters. Instead, check for `nil` inside the function, or pass a table of options. |
| Multiple returns | There are no multiple return values, tuples or destructuring. Instead, return an array or a table and read the parts. |
| `switch` | There is no `switch` or `match`. Use an `if` / `elif` chain, or a table lookup. |
| Other loops | There is no `do ... while`, `repeat ... until`, numeric `for`, labeled `break` or `goto`. Use `while true:` with `break`, and `for i in range(...)`. |
| Strings | There is no string interpolation, there are no multi-line strings and strings have no methods. Use `+`, [string.format](api:global/string.format), `\n` and the `string` library. |
| Operators | There is no `**`, `//`, bitwise operator, `!`, `&&`, `||`, `??` or `?.`. Use [math.pow](api:global/math.pow), `math.floor(a / b)`, `not`, `and`, `or` and explicit `nil` checks. |
| Collections | There is no `x in list` as a test, there are no slices (`list[1:3]`) and no comprehensions. Use `list.contains(x)`, `filter` with the index, and `map` / `filter`. |
| Errors | There is no typed `catch`, and there are no custom error classes. Use one `catch`, inspect the value, and rethrow. |
| Constants | There are no constants (`const`) and no enums of your own. Use a naming convention, and a table of named values. |
