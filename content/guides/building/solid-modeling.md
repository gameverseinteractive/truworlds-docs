---
title: Solid modeling
description: Join parts, cut holes, and keep overlaps with unions and negatives
---

# Solid modeling

A union joins several parts into one solid. Negate turns a part into a cutter that removes its shape from the others, for windows, doorways, arches and hollow things. An intersect keeps only the space that several parts share.

## Making a union

To union, select two or more parts, then click Union in the Solid Modeling group of the ribbon's Model tab, press Ctrl+Shift+G (Cmd+Shift+G on macOS), or right-click the selection in the Explorer and choose Union. Union replaces the selected parts with a single part named `Union`, which is selected. The part a union makes is a [UnionPart](api:UnionPart), a kind of [Part](api:Part), so it has [Color](api:Part.Color), [Material](api:Part.Material), [Anchored](api:PhysicsInstance.Anchored), [CanCollide](api:PhysicsInstance.CanCollide) and all the rest.

The parts that go into a union are called its operands. A union keeps its operands inside it, hidden, so you can separate it again or change its shape later.

A [MeshPart](api:MeshPart) cannot be unioned. A `UnionPart` is anchored only when every part that went into it was anchored. Anchor every operand before you union if the result should be anchored.

## Cutting a hole

A hole is made in two steps: turn the cutter into a [NegativePart](api:NegativePart), then union it with what it should cut.

To negate, select the cutter and click Negate in the Solid Modeling group of the ribbon's Model tab, or press Ctrl+Shift+N (Cmd+Shift+N on macOS).

Negative parts are subtracted after the ordinary parts are joined, so the order you select them in does not matter.

When the negative parts remove everything, the union fails with the error `Union failed: no geometry remains.`

When a union fails because the negative parts removed everything, make the cutters smaller or move them.

A negative part is a building aid only: you see it in red while you edit, and while the world is played it is not drawn, not solid and fires no touch signals, even if you never unioned it.

## Intersecting

To intersect, select two or more overlapping parts and click Intersect in the Solid Modeling group of the ribbon's Model tab, or press Ctrl+Shift+I (Cmd+Shift+I on macOS). The result of an intersect is a single part named `Intersect` made of only the space that all the ordinary parts share.

## Changing a union

You do not have to separate a union to adjust it. To adjust a union, open it in the Explorer and click an operand there to select it. In TruWorlds Creator, a moment after you stop editing an operand, the union rebuilds itself from its operands.

Do not use the Resize tool or `Size` to scale a union.

To separate, select a union and click Separate in the Solid Modeling group of the ribbon's Model tab, or press Ctrl+Shift+U (Cmd+Shift+U on macOS).

## Color and material

With [UsePartColor](api:UnionPart.UsePartColor) on, the default, a union is one color and one material, set by its own [Color](api:Part.Color) and [Material](api:Part.Material). Turn `UsePartColor` off and each part of the union's surface keeps the color and material of the operand it came from.

## How a union collides

An anchored union that is standing still collides with its real shape: players can walk through a doorway you cut.

A union's convex hull is the shape you would get by shrink-wrapping it. A union that is not anchored, or is being moved, collides as its convex hull, with holes and dents filled in: a loose doughnut behaves like a solid disc. Cut-outs that players must pass through belong in anchored unions.

## Solid modeling from a script

Put the ingredients in a [Model](api:Model) as its direct children, then call one of the `Model`'s solid modeling methods, which [Models and folders](models-and-folders.md#model-or-folder) lists.

## Example: A wall with a doorway

This server script, attached to any instance in the world, builds a brick wall with a doorway cut out of it.

```truscript
local doorway = new Model() { Name = "Doorway", Parent = world }

local wall = new Part() {
    Name = "Wall",
    Size = new Vector3(20, 12, 1),
    Position = new Vector3(0, 6, 0),
    Material = PartMaterial.Brick,
    Color = new Color3(0.6, 0.3, 0.25),
    Anchored = true,
    Parent = doorway
}

local opening = new NegativePart() {
    Name = "Opening",
    Size = new Vector3(5, 8, 2),          # thicker than the wall, so the cut goes right through
    Position = new Vector3(0, 4, 0),
    Anchored = true,                      # every operand must be anchored for the union to be anchored
    Parent = doorway
}

local cut = doorway.UnionChildren()
if cut == nil:
    print("Nothing to union")
else:
    cut.Name = "WallWithDoor"
    print(cut.ClassName + " made from " + cut.OperandCount + " parts")
    # prints: UnionPart made from 2 parts
```

It prints `UnionPart made from 2 parts`.

## Pictures on a union

A [Surface](api:Surface) inside a union shows nothing; see [Which parts show a Surface](surfaces-and-textures.md#which-parts-show-a-surface). To put a picture on a cut wall, place a thin plain part with the `Surface` just in front of it.

## Troubleshooting

| What you see | Fix |
|---|---|
| A union fails because no geometry remains. `Union failed: no geometry remains.` | Make the cutters smaller or move them. See [Cutting a hole](#cutting-a-hole). |
