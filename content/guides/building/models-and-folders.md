---
title: Models and folders
description: Group parts, and move and measure the group
---

# Models and folders

TruWorlds gives you two containers for grouping things: the [Model](api:Model) and the [Folder](api:Folder). A `Model` and a `Folder` differ in what they do with their contents.

## Model or Folder

If you would point at it and call it one object, make it a [Model](api:Model). If it is a category, make it a [Folder](api:Folder).

Neither a `Model` nor a `Folder` [joins its parts](../physics/welds-and-joints.md) physically: loose, unanchored parts in a `Model` do not stick together when the world is played. A `Folder` inside a `Model` is fine for sorting the model's pieces, with the one catch that the `Model`'s [Visible](api:VisualInstance.Visible) and [Transparency](api:VisualInstance.Transparency) do not reach through it; see how [values pass down](../engine/visual-instances.md#only-visualinstance-parents-pass-it-on).

| What differs | Model and Folder |
|---|---|
| Purpose | A [Model](api:Model) is for a thing made of several parts that belongs together: a house, a car, a tree, a door with its frame. A [Folder](api:Folder) is a drawer for sorting: all the trees, all the coins, all the lamps in zone 2. |
| Moving | A [Model](api:Model) can be moved as one from a script once it has a [primary body](#the-primary-body) ([PivotTo](api:Model.PivotTo), [Position](api:Model.Position), [CMatrix](api:Model.CMatrix)). A [Folder](api:Folder) cannot: a folder has no position. |
| Welding | A [Model](api:Model) has welding helpers: [MakeJoints](api:Model.MakeJoints), [MakeJointsToPrimaryBody](api:Model.MakeJointsToPrimaryBody) and [RemoveJoints](api:Model.RemoveJoints). A [Folder](api:Folder) has none. |
| Solid modeling | A [Model](api:Model) has solid modeling helpers: [UnionChildren](api:Model.UnionChildren), [IntersectChildren](api:Model.IntersectChildren) and others. A [Folder](api:Folder) has none. |

## Grouping and ungrouping

To group, select the instances and press Ctrl+G (Cmd+G on macOS), click Group in the Edit group of the ribbon's Home or Model tab, or right-click the selection in the Explorer and choose Group. Grouping creates a [Model](api:Model) named `Model` in the parent of the first selected instance, after that parent's other children, moves the selection into it, and selects it.

Grouping does not move, anchor or weld anything. The parts stay exactly where they were.

To ungroup, select `Model` or [Folder](api:Folder) instances and press Ctrl+Backspace (Cmd+Backspace on macOS), choose Ungroup from the arrow next to Group on the ribbon, or right-click in the Explorer and choose Ungroup. Ungrouping moves the contents up into the container's parent, removes the empty container, and selects the former contents.

## The primary body

The primary body is the one part of a [Model](api:Model) that you choose to give the model a place in the world. Grouping does not choose a primary body.

The primary body must be a physical part: a [Part](api:Part), [MeshPart](api:MeshPart) or [UnionPart](api:UnionPart).

To set the primary body in TruWorlds Creator, select the `Model` and choose the part in [PrimaryBody](api:Model.PrimaryBody) in the Properties panel.

This server script, attached to a `Model` that contains a `Part` named "Floor", sets the model's `PrimaryBody` to its part named Floor and prints the model's Y position.

```truscript
this.PrimaryBody = this.FindFirstChild("Floor")
print(this.Position.Y)       # prints the Y position of Floor
```

For moving a model that has no `PrimaryBody`, see [Moving a model](../engine/cmatrix.md#moving-a-model).

## Measuring a group

[GetContentsGlobalBoundsBox](api:Instance.GetContentsGlobalBoundsBox) gives the smallest upright box that contains the instance and everything inside it that has a position. It works on a [Model](api:Model), a [Folder](api:Folder) or a single part alike.

The box is aligned with the world's axes, so a model turned 45 degrees reports a box larger than the model.

## Organizing a world

As a world grows, make one [Model](api:Model) per object (a lamp post, a bench, a house), and [name](../engine/instance-tree.md) it for what it is. Use [Folder](api:Folder) instances for categories and zones (`Scenery`, `Coins`, `Zone1`, `Zone2`), and put the `Model` instances inside.

Keep things scripts need in predictable places: if a script collects every coin, keep all coins in one `Folder` and loop over that `Folder`'s children.

To spawn things, build one example in TruWorlds Creator, keep it switched off in `game.Storage`, and clone it when needed; see [Templates and clones](../engine/creating-and-destroying.md#templates-and-clones).

## Example: Spinning every coin in a folder

This server script, attached to the `Folder` world > Gameplay > Coins, makes every part in the folder spin and reports how many there are.

```truscript
local coins = this.GetChildren()
print("There are " + coins.length + " coins")

game.TimeSystem.FrameStepped.Connect(func(deltaTime):
    for coin in coins:
        if coin.IsA("Part") and coin.Parent != nil:
            coin.Rotation = coin.Rotation + new Vector3(0, 180 * deltaTime, 0)
)
```
