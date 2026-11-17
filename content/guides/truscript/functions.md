---
title: Functions
description: Declare, call and pass functions, and write them inline
---

# Functions

Declare a function with `func`, a name, a list of parameters in round brackets, a colon, and an indented body.

This script declares a function that adds two numbers, then prints the result of calling it.

```truscript
func add(x, y):
    return x + y

print(add(10, 20))      # prints 30
```

It prints `30`.

A `func` statement defines a function. Defining a function does not run it. The brackets are always required, in a function's declaration and in the call, even when there are no parameters. Writing a function's name without brackets does not call the function. It refers to the function itself, as a value.

## When a function exists

A `func` statement runs like any other statement: at that moment it creates the function and stores it in a variable with the function's name. Calling a function on a line that runs before its `func` statement is an error.

A function body may call functions defined further down the script, because the body only runs when the function is called. Two functions can call each other whichever is written first.

The variable a `func` statement creates is a local of its block: a top-level function can be used anywhere in the script, one declared inside a function, an `if` or a loop only inside that block.

A function name is a variable. Declaring a second function with the same name in the same block replaces the first, without any warning.

## Arguments

Parameters are matched to arguments by position: the first argument goes to the first parameter, and so on. Calling your own function with too few arguments is not an error: the missing parameters are `nil`. Calling your own function with too many arguments is not an error: the extra arguments are ignored.

Only functions written in TruScript accept too few or too many arguments. Built-in functions and engine methods check their arguments in number and type, and a call that matches none of their forms stops the script.

If a handler declares more parameters than the signal passes, the extra ones are `nil`. Because extra arguments are dropped, a signal handler may declare fewer parameters than the signal provides.

Each parameter is a local variable of the function. It hides any outer variable of the same name for the duration of the call. Reassigning a parameter never changes the caller's variable. Simple values arrive as copies. See [Copied or shared](value-types.md#copied-or-shared).

## Return values

`return` ends the function immediately and hands one value back to the caller. A function that ends without `return` is not an error: it gives `nil`. A function returns exactly one value. To give back more than one thing, return an array or a table and take it apart at the call.

## Functions are values

A function is a value: its name is a variable that holds it, and you can copy it, pass it, return it and store it in arrays and tables.

This script passes a function to a function.

```truscript
func apply_twice(f, x):
    return f(f(x))

func add_three(n):
    return n + 3

print(apply_twice(add_three, 10))   # prints 16
```

It prints `16`.

In `apply_twice(add_three, 10)`, `add_three` has no brackets, so the call passes the function, not its result.

## Anonymous functions

`func(params):` followed by a body is exactly like a named function, minus the name. It uses `return` to give back a value. `expr(params):` followed by one expression is a function that evaluates that expression and returns the result. There is no `return` keyword and no block.

This script passes `expr` functions to the array methods [map](api:builtin/array.map), [filter](api:builtin/array.filter) and [reduce](api:builtin/array.reduce).

```truscript
local numbers = [1, 2, 3, 4]
print(numbers.map(expr(n): n * 2))              # prints [2, 4, 6, 8]
print(numbers.filter(expr(n): n % 2 == 0))      # prints [2, 4]
print(numbers.reduce(expr(sum, n): sum + n, 0)) # prints 10
```

It prints `[2, 4, 6, 8]`, then `[2, 4]`, then `10`.

A function cannot be placed after the closing bracket of a call: `each(list) func(v): ...` is an error. Put a function passed to a call inside the call's brackets.

This server script, attached to a [Part](api:Part), connects a multi-line `func` to [Touched](api:PhysicsInstance.Touched), with the call's closing bracket on its own line.

```truscript
this.Touched.Connect(func(other):
    print("touched by " + other.Name)
    this.Color = Color3.Random()
)
```

What a function captures from the code around it is covered in [Closures](closures.md).

## Functions that wait

A function may call [wait](api:global/wait), wait on a signal, or call any engine method that pauses. The whole chain of callers pauses with it and continues when the wait is over. Nothing special is needed in the declaration. See [calls that pause](../scripting/waiting-and-tasks.md#calls-that-pause).

## Troubleshooting

| What you see | Fix |
|---|---|
| The script does not run, and the error says a trailing function lambda is invalid: `Invalid trailing function lambda; wrap in parentheses to use as a call argument` | Put the function inside the call's brackets. See [Anonymous functions](#anonymous-functions). |
| Calling `math.sqrt()` with no argument stops the script with an error: `No overload of 'sqrt' matches the supplied 0 argument(s).` | Pass a built-in function the number and kinds of arguments it expects. See [Arguments](#arguments). |
