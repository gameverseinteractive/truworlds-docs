---
title: The instance tree
description: The tree under game, classes and IsA, and finding instances in it
---

# The instance tree

An instance is an object that can live in the tree that the Explorer panel shows: it has a [Name](api:Instance.Name), a [Parent](api:Instance.Parent) and children. Almost every object you work with is an instance. The class all of them build on is called [Instance](api:Instance).

## The tree under game

[game](api:global/game) is the root of the tree. The class of `game` is [DataModel](api:DataModel). There is exactly one, and it has no parent (`game.Parent` is `nil`).

The children of `game` are the systems. You reach a system by name: `game.Players`, `game.Lighting`, and so on. [world](api:global/world) is the same object as `game.World`.

Parenting your own instance directly to `game` is an error. Put it in `world`, `game.Storage` or `game.ScriptSystem` instead.

## Classes and members

A [Part](api:Part) has every member of [TruWorldsObject](api:TruWorldsObject), [Instance](api:Instance), [VisualInstance](api:VisualInstance), [DynamicInstance](api:DynamicInstance), [PhysicsInstance](api:PhysicsInstance) and [Part](api:Part). `part.Name` works because `Name` is listed on `Instance`, which `Part` builds on, not on the `Part` page of the API reference.

`PhysicsInstance` builds on `DynamicInstance`, so every kind of part has [CMatrix](api:DynamicInstance.CMatrix), `Position`, `Rotation` and [Quaternion](api:DynamicInstance.Quaternion) as well as the physics members, which are all on `PhysicsInstance`.

A [Model](api:Model) has no position of its own: it builds on `VisualInstance`, not on `DynamicInstance`, and borrows a position from one of its parts.

## Testing the class

`IsA(className)` is true when the object is a `className` or something built on it.

Write `part.IsA("Part")`, not `part.IsA(Part)`. Passing the class itself to [IsA](api:TruWorldsObject.IsA), instead of its name, is an error.

Class names are case-sensitive. `"part"` never matches. A name that is not a class is not an error: `IsA("Banana")` is `false`, so a typo in the class name makes the test fail quietly.

A [MeshPart](api:MeshPart) is not a `Part`: both build on [PhysicsInstance](api:PhysicsInstance), and `meshPart.IsA("Part")` is `false`. To match "any physical thing", test for `PhysicsInstance`.

Use `IsA` almost always. Use `ClassName ==` only when you need one exact class and nothing built on it. A script that anchors "every part" with `ClassName == "Part"` silently skips every seat, union and mesh.

## Example: A part that turns what touches it red

This server script, attached to a [Part](api:Part), turns whatever touches the part red, but only if it has a color to change.

```truscript
this.Touched.Connect(func(other):
    if other.IsA("Part"):
        other.Color = new Color3(1, 0, 0)
    else:
        print(other.Name + " is a " + other.ClassName + ", which has no Color to set")
)
```

It prints `Avatar is a Avatar, which has no Color to set` when a player's character walks onto the part.

## Where an instance is active

Where an instance sits in the tree decides whether it does anything.

An instance inside [world](api:global/world) is drawn, takes part in physics, and its scripts run. Use it for everything that is part of the playable world.

An instance inside `game.UICanvas` is drawn as on-screen UI, takes no part in physics, and its scripts run. Use it for user interface.

An instance inside `game.ScriptSystem` is not drawn and takes no part in physics, and its scripts run. Use it for game-wide scripts on a [Folder](api:Folder) or [Empty](api:Empty).

An instance with no parent at all (`Parent == nil`) is not drawn, takes no part in physics, and its scripts do not run. That is an instance you just created and have not placed yet.

For templates kept in `game.Storage`, see [Creating and destroying](creating-and-destroying.md#templates-and-clones).

## Finding children

Writing a child's name after a dot gives you that child. The dot shortcut works only with names that are valid TruScript identifiers: letters, digits and underscores, not starting with a digit. `world.Red Door` and `world.2ndFloor` are not valid code. Names are case-sensitive: `door` and `Door` are different names.

With the dot shortcut, a missing child is an error. If there is no member and no child with that name, the line stops the script. When no child with the name a line uses exists at the moment the line runs, check the spelling and capital letters of the name.

With the dot shortcut, members win over children: `parent.Something` gives the parent's property, signal or method called Something, and gives a child with that name only if there is none. Give children specific names: `DisplayName` instead of `Name`, `BodyColor` instead of `Color`, `SpawnPosition` instead of `Position`.

When a child might not be there, use [FindFirstChild](api:Instance.FindFirstChild). `FindFirstChild(name)` finds the first direct child with exactly that name, or nothing when there is none.

This server script, attached to a [Model](api:Model), looks for a child named "Warning Light" with `FindFirstChild` and hides it, or says the model has none.

```truscript
local light = this.FindFirstChild("Warning Light")
if light == nil:
    print(this.Name + " has no warning light")
else:
    light.Visible = false
```

`FindFirstChild` looks at direct children only, not grandchildren.

`WaitForChild(name)` gives the child at once if it exists. If not, it pauses the calling script until a child with that name is added, then gives it. Use [WaitForChild](api:Instance.WaitForChild) whenever something else creates the child: the server, another script, or the gradual arrival of the world on a player's device.

## Everything inside

`GetDescendants()` lists everything below the instance, at every depth. The instance itself is not included. `GetChildren()` and `GetDescendants()` give every kind of instance mixed together. [IsA](api:TruWorldsObject.IsA) picks out the ones you want.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says World has no member named Coin: `World has no member named 'Coin'.` | Check the spelling and capital letters, or use [FindFirstChild](api:Instance.FindFirstChild). [Finding children](#finding-children) |
| A loop over "all parts" misses meshes, seats or unions. | To match any physical thing, test for [PhysicsInstance](api:PhysicsInstance). [Testing the class](#testing-the-class) |
| An error says no overload of [IsA](api:TruWorldsObject.IsA) matches the argument: `No overload of 'IsA' matches the supplied 1 argument(s).` | Write `part.IsA("Part")`, not `part.IsA(Part)`. [Testing the class](#testing-the-class) |
