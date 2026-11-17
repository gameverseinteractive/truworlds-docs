---
title: this, game and world
description: The three names every script starts with
---

# this, game and world

Every script starts with three names already defined: [this](api:global/this), [game](api:global/game) and [world](api:global/world).

## this

[this](api:global/this) is the instance the script is attached to: use it for working on "my" object, such as the part to spin or the door to open.

This server script, attached to any part, prints the name, class and parent name of the instance it is attached to, then sets its [Color](api:Part.Color).

```truscript
print("I am " + this.Name + ", a " + this.ClassName)
print("My parent is " + this.Parent.Name)
this.Color = new Color3(0, 0.6, 1)
# Output when attached to a part named "Door" directly inside world:
# I am Door, a Part
# My parent is World
```

Attached to a part named "Door" directly inside `world`, it prints `I am Door, a Part`, then `My parent is World`.

## When this is nil

| Where the code runs | this |
|---|---|
| In a server or client script attached to an instance | `this` is that instance. |
| In a module script loaded with `import()` | `this` is `nil`. |
| In a line typed into the command bar of the Console panel | `this` is `nil`. |

## game and world

[game](api:global/game) is the root of everything: use it to reach the systems, such as `game.Players`, `game.Storage` and `game.Lighting`. [world](api:global/world) is the 3D world, the same object as `game.World`: use it to find and create the things players see and touch.

For the systems under `game`, and finding children, see [the tree under game](../engine/instance-tree.md#the-tree-under-game).

## The other names a script starts with

Every script also starts with [print](api:global/print), [warn](api:global/warn) and [error](api:global/error); [wait](api:global/wait) and [spawn](api:global/spawn); [import](api:global/import); every class you can create with `new`; every data type and enum; and the TruScript standard library, such as [math](api:global/math) and [string](api:global/string).

> [!WARNING]
> A name you assign without `local` is a global of that script and can overwrite a name every script starts with: after `world = 5`, reading `world.Name` is an error in that script, while `game.World` still works and other scripts are not affected. Declare your own variables with `local`.

For `local`, see [Variables and scope](../truscript/variables-and-scope.md).
