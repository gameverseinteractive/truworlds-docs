---
title: Variables and scope
description: Create and change variables, and choose where a name is visible
---

# Variables and scope

You create a variable by assigning a value to a name with `=`, with no keyword and no type. A variable has no fixed type: the same variable can hold a number now and a string later.

## Globals by default

Any name you assign without `local` becomes a global variable of that script.

This script assigns a variable without `local` inside a function, then prints it outside the function.

```truscript
func setup():
    level = 5          # no "local": this is a global

setup()
print(level)           # prints 5 (visible out here)
```

It prints `5`.

Assigning to a misspelled variable name is not an error: a new global variable is created, and the one you meant is unchanged.

Two functions that both use a helper variable such as `i` or `total` without `local` share one variable. When one interrupts the other (a signal handler runs while a loop is waiting), they overwrite each other's values.

The script checker warns when an assignment inside a function creates a global. If you did not mean an assignment inside a function to create a global, add `local`. The script's other globals are covered in [this, game and world](../scripting/this-game-world.md).

## Reading a name that has no value

Using a name that has never been given a value does not give `nil`: the script stops with an error.

## Local variables and blocks

Put `local` in front of the first assignment to make a variable that belongs to the current block only. Declare every variable with `local` unless you have a specific reason for a global.

A `local` belongs to the block it is declared in: the body of an `if`, `elif`, `else`, `while`, `for`, `func`, `try`, `catch` or `finally`. When that block ends, the variable is gone.

This script declares a local inside an `if` block, then reads it inside and after the block.

```truscript
ready = true
if ready:
    local message = "go"
    print(message)       # prints go
print(message)           # error: Symbol 'message' is not defined
```

It prints `go`.

If a value must survive past the block, declare it before the block and assign to it inside.

A `local` inside a loop body is created fresh each time the loop body runs and discarded when that run of the body ends. See [loop variables](closures.md#loop-variables).

## Declaring a local

A `local` declaration must have an equals sign and a value. There is no way to declare a local without one. When a `local` has no value, add `= nil` or a real value.

You cannot declare the same local twice in one block. The script does not run. Declare a local once in a block and assign to it afterwards.

You may list several names after `local`, separated by commas, with one value. The value is worked out once and every name receives it.

It follows that if the value of a `local` with several names is an array, a table or an object, every name refers to the same one.

## When a name is looked up

A name is resolved at the moment the line that mentions it runs, not when the script is first read. So a function may mention a local that is declared further down the script, as long as the function is not called until that declaration has run.

The rule is about timing: if the function runs before the declaration of a name it uses has run, the name does not exist yet.

## Constants

TruScript has no `const` keyword and no way to stop a variable from being reassigned: nothing prevents `MAX_HEALTH = 1` later in the script.

A constant is a convention: give the variable an `UPPER_SNAKE_CASE` name, set it once at the top of the script, and never assign to it again.

## Troubleshooting

| What you see | Fix |
|---|---|
| A warning says an assignment inside a function creates a global: `Assignment to 'x' inside function 'f' creates a global; declare it with 'local' to keep it function-scoped.` | If you did not mean it to create a global, add `local`. See [Globals by default](#globals-by-default). |
| The script does not run, and the error says `=` was expected after local variable names: `Expected '=' after local variable names, got newline` | Add `= nil` or a real value. See [Declaring a local](#declaring-a-local). |
| The script does not run, and the error says a local variable is already declared in this scope: `Local variable 'x' is already declared in this scope.` | Declare the local once in the block and assign to it afterwards. See [Declaring a local](#declaring-a-local). |
