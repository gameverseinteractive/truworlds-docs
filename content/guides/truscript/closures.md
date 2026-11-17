---
title: Closures
description: How functions capture the variables around them
---

# Closures

A function can use the variables that were visible where it was written, and keeps them for as long as the function exists, even after the code that created them has finished. A function together with the variables it holds on to is called a closure.

## Variables, not values

A closure holds on to the variable itself, not a copy of its value: if the variable changes later, the function sees the new value.

This script changes a captured variable after the function is made, and the function sees the new value.

```truscript
local greeting = "hi"
local say = func(): print(greeting)

greeting = "bye"
say()                   # prints bye
```

It prints `bye`.

A closure can also assign to a captured variable, and the change is seen by everything else that uses that variable.

## Captured variables stay alive

A local that a function has captured stays alive for as long as that function does.

This script's `make_adder` returns a function that keeps its own amount after `make_adder` has finished.

```truscript
func make_adder(amount):
    return expr(n): n + amount      # this function remembers "amount"

local add5 = make_adder(5)
local add100 = make_adder(100)

print(add5(10))         # prints 15
print(add100(10))       # prints 110
```

It prints `15`, then `110`.

Every time a block runs, its locals are new, and a closure created during one run is tied to that run's variables, so calling a function twice produces two closures with separate state.

## Loop variables

The variable of a `for` loop is a local that belongs to the loop. It does not exist after the loop. The variable of a `for` loop is created anew for every pass. A function created in the body captures the variable of its own pass, so each function keeps its own value.

A `while` loop has no loop variable of its own: every function created in the body captures the same counter declared outside it, which holds its final value by the time the functions run. To give each function created in a `while` body its own value, copy the value into a `local` declared inside the body.

Each pass of this `while` loop copies the counter into a body local, so each function keeps its own value.

```truscript
local getters = []
local i = 0
while i < 3:
    local current = i               # a new variable each pass
    getters.push(expr(): current)
    i += 1

print(getters[0]())     # prints 0
print(getters[1]())     # prints 1
print(getters[2]())     # prints 2
```

It prints `0`, then `1`, then `2`.

## Assigning inside a closure

Capturing applies only to locals: a plain assignment inside a closure to a name that is not a local in scope creates a global. If you meant to update an outer local from a function, make sure that local is declared, with `local`, in an enclosing block.

Writing `local` again inside a function creates a new variable instead of updating the captured one.

## Private state

In a table of functions built inside a function, the locals of the outer function become private state, shared by the functions in the table and invisible to everyone else. For private state, build a table of functions inside a function. See [a table of functions](tables.md#functions-in-a-table).
