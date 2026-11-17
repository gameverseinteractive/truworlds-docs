---
title: Modules and import
description: Share code and state between scripts with module scripts
---

# Modules and import

A *module script* is a script whose job is to be used by other scripts. You load a module script from another script with [import](api:global/import): `import(path)`, instead of attaching it. An imported module runs, and whatever its top level returns is handed to the script that imported it. A module's *export* is whatever its top level returns. It can be any value.

## A first module

This module script, saved at `Shared/Greeter` and attached to no instance, exports two functions, `greet` and `shout`, in a table.

```truscript
func greet(name):
    return "Hello, " + name + "!"

func shout(name):
    return string.upper(greet(name))

return { greet = greet, shout = shout }
```

This server script, attached to any instance and saved in the top folder, imports the module saved at `Shared/Greeter` and calls both of its functions.

```truscript
local Greeter = import("Shared/Greeter")
print(Greeter.greet("Ada"))
print(Greeter.shout("Ada"))
# Output:
# Hello, Ada!
# HELLO, ADA!
```

It prints `Hello, Ada!`, then `HELLO, ADA!`.

A module with no `return` exports `nil`.

## Import paths

A relative `import` path is relative to the file that contains the `import` call, not to the instance the script is attached to: when module `A` imports `"B"`, that means `B` next to `A`. Use global paths (`/Shared/Greeter`) for modules that many scripts use. For the path rules, see [Paths](script-components.md#paths).

`import` fails when there is no file at the path. When no file is found, the message shows the full path that was tried, which tells you which folder a relative path was resolved from.

When `import` finds no file, check the spelling, the capitals and whether the path should start with `/`.

| Path | Where it starts |
|---|---|
| `import("Shared/Greeter")` | Relative: it starts in the folder of the calling script, goes into `Shared`, and finds `Greeter`. |
| `import("/Shared/Greeter")` | Global: a leading `/` starts at the top folder of the world, wherever the calling script is. |


## A module runs once per side

The first `import` of a file runs the module's top level and remembers the result. Every later `import` of that file on the same [side](script-types.md) returns the remembered value without running the module again.

This module script, saved at `Shared/Counter` and attached to no instance, keeps a private count, and exports only a function that adds one to it and returns it.

```truscript
local count = 0            # private: importers cannot reach this directly

func next():
    count = count + 1
    return count

return { next = next }
```

Because every importer receives the same export, a module is the simplest place for state that several scripts need.

Module sharing is per side: the server and each player's device have their own copy of every module. Module state is never shared between the server and a device, or between two devices; to move data across, use a [RemoteEvent](api:RemoteEvent).

## Inside a module

In a module script loaded with `import()`, [this](api:global/this) is `nil`; see [When this is nil](this-game-world.md#when-this-is-nil). A module is not attached to an instance. Pass instances to its functions as arguments.

## Which scripts can import which

| Importing script | May import |
|---|---|
| A server script | A module script or a server script. Importing a client script is an error. |
| A client script | A module script or a client script. Importing a server script is an error. |
| A module script | A module script. Importing a server script or a client script is an error. |

When the combination of importing script and imported script is not allowed, change the target to a module script, or import it from a script of the matching type.

## Modules that wait

A module's top level is allowed to wait, for example with [wait](api:global/wait): `wait()`, or [WaitForChild](api:Instance.WaitForChild): `WaitForChild()`. While a module's top level waits, the script that called `import` is paused, and continues with the module's export once the module has finished.

## Troubleshooting

| What you see | Fix |
|---|---|
| An import fails because it could not find the file at the path: `import(): Could not find file at path '<path>'` | Check the spelling, the capitals and whether the path should start with `/`; see [Import paths](#import-paths). |
| An import fails because one type of script cannot import the other: `import(): A <type> script cannot import the <type> script at '<path>'` | Change the target to a module script, or import it from a script of the matching type; see [Which scripts can import which](#which-scripts-can-import-which). |
