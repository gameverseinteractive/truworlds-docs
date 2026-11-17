---
title: TruScript
description: The language scripts are written in, from syntax to the standard library
---

# TruScript

TruScript is the scripting language that brings a TruWorlds world to life: a [script](../scripting/index.md) opens a door when a player steps on a pad, counts coins, saves progress, moves a platform, draws a menu. It applies equally to server, client and module scripts. TruScript is its [own language](for-experienced-programmers.md): habits from other languages trip you up somewhere.

## The basics

A few rules shape every line you write:

- A [block](syntax-basics.md) is a colon at the end of the line that opens it, and a body on the following lines, indented further.
- A name you assign without `local` becomes a [global variable](variables-and-scope.md).
- You never write a [type](value-types.md): a variable holds whatever value you last put in it.
- [Division](operators.md) never rounds: `7 / 2` is `3.5`.
- Every value is truthy or falsy when tested, a rule called [truthiness](truthiness.md).
- `+` [joins](strings.md) when either side is a string, converting the other like [tostring](api:global/tostring) does.
- TruScript has `if`, [two loops](control-flow.md) (`while` and `for`), and `break`, `continue` and `return` to jump out of them.

## Functions

A [function](functions.md) is a value you can copy, pass, return and store. A function can use the variables that were visible where it was written, and [keeps them](closures.md) for as long as the function exists.

## Arrays, tables and objects

[Arrays](arrays.md) start at 0, so the last item of a three-item array is `items[2]`. A [table](tables.md) is the general-purpose record and dictionary. Everything else you work with in a world, such as a [Part](api:Part) or a [Vector3](api:Vector3), is an [object](objects-and-construction.md) provided by TruWorlds.

## Errors

`try` lets you react when something [fails](error-handling.md).

## Coroutines

A [coroutine](coroutines-and-yield.md) is running code that can pause in the middle, let everything else carry on, and continue later from exactly where it stopped, with all its variables intact.

## The standard library

The [standard library](standard-library.md) is what a script can use without creating or importing anything: a few global functions, and five libraries reached through the globals [math](api:global/math), [string](api:global/string), [table](api:global/table), [random](api:global/random) and [host](api:global/host).
