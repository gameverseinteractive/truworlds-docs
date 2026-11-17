---
title: Parts
description: Create parts, and set their shape, size, color, material and other properties
---

# Parts

In scripts and in the Explorer, a part is an instance of the class [Part](api:Part). A part has three jobs at once: it is [drawn](../engine/visual-instances.md), it is solid, and it is [simulated](anchoring-and-collisions.md).

## Inserting a part

To insert a part in TruWorlds Creator, click Part in the Insert group of the ribbon's Home tab, or in the Part group of its Model tab. A part inserted from the ribbon is the default light gray `Plastic`.

## Creating a part from a script

In TruScript you create a part with `new Part()`, set its properties, then set its [Parent](api:Instance.Parent) to put it in the world.

This server script, attached to any instance in the world (for example a [Folder](api:Folder) in `world`), creates an anchored orange `Wood` part named `MyFirstPart` in `world` and prints how wide it is.

```truscript
local block = new Part()
block.Name = "MyFirstPart"
block.Size = new Vector3(4, 1, 4)
block.Position = new Vector3(0, 5, 0)
block.Color = new Color3(1, 0.5, 0)       # orange
block.Material = PartMaterial.Wood
block.Anchored = true                     # without this line the part falls
block.Parent = world

print(block.Name + " is " + block.Size.X + " studs wide")
# prints: MyFirstPart is 4 studs wide
```

It prints `MyFirstPart is 4 studs wide`.

A part made with `new Part()` is not anchored; see [Gravity and falling](../physics/forces-and-movers.md#gravity-and-falling).

## Size

[Size](api:Part.Size) is a [Vector3](api:Vector3) of the part's width (X), height (Y) and depth (Z), along the part's own axes, in [studs](../engine/coordinates-and-units.md). Rotating a part does not change its `Size`.

A `Size` value outside the allowed range is not an error: it is moved to the nearest limit.

This server script, attached to any instance in the world, sets a new part's `Size` to numbers outside the allowed range and prints what each axis reads back.

```truscript
local p = new Part()
p.Size = new Vector3(5000, 0, -3)
print(p.Size.X)   # prints: 2048
print(p.Size.Y)   # prints: 0.009999999776482582
print(p.Size.Z)   # prints: 0.009999999776482582
```

It prints `2048`, then `0.009999999776482582`, then `0.009999999776482582`.

Numbers stored inside a `Vector3` carry a small rounding error, so the lower limit of a part's `Size` reads back as `0.009999999776482582`.

To change one axis of `Size`, assign a whole new `Vector3`: `part.Size = new Vector3(10, part.Size.Y, part.Size.Z)`. A property gives you a copy of its data type; see [A property gives you a copy](../engine/data-types.md#a-property-gives-you-a-copy).

## Shapes

The [Shape](api:Part.Shape) property picks one of four shapes from the [PartShape](api:PartShape) enum: `Block`, `Ball`, `Cylinder` and `Wedge`.

A sphere's diameter is the smallest of `Size.X`, `Size.Y` and `Size.Z`: `Size` `(10, 2, 10)` gives a sphere 2 studs across, not a flattened disc. When a sphere is tiny although its `Size` is huge, make all three `Size` numbers the same.

A cylinder part stands upright: its round faces are its top and bottom. A cylinder's height is `Size.Y` and its diameter is the smaller of `Size.X` and `Size.Z`: `Size` `(6, 1, 2)` gives a cylinder 1 stud tall and 2 studs across. To lay a cylinder on its side, for a log, a pipe or a wheel, rotate the part, for example to [Rotation](api:DynamicInstance.Rotation) `(0, 0, 90)`.

`Size` keeps the numbers you typed; only the drawn and colliding shape uses the reduced ones, so switching `Shape` back to `Block` gives the full-size box again.

In a wedge's own axes, the bottom is a full `Size.X` by `Size.Z` rectangle, the tall vertical face is at the back (+Z), and the slope rises from the bottom front edge (-Z) to the top back edge. The left and right sides are triangles.

## Color

> [!WARNING]
> A part's [Color](api:Part.Color) numbers run from 0 to 1, not 0 to 255. Values outside the range are clamped, so `new Color3(200, 120, 40)` is white, not orange. Divide 0 to 255 numbers by 255, or use a hex code with [Color3.FromHex](api:Color3.FromHex).

This server script, attached to a [Part](api:Part), sets its `Color` five ways: from red, green and blue, from a hex code, from hue, saturation and value, and at random.

```truscript
this.Color = new Color3(1, 0, 0)               # pure red
this.Color = new Color3(0.2, 0.6, 1)           # sky blue
this.Color = Color3.FromHex("#8B5A2B")         # brown, from a hex code
this.Color = Color3.FromHsv(0.33, 1, 1)        # green, from hue / saturation / value
this.Color = Color3.Random()                   # any color
```

The Properties panel shows a color as three numbers from 0 to 255 (a part's default gray reads 200, 200, 200); scripts use 0 to 1 for the same color.

## Material

[Material](api:Part.Material) picks one of nineteen looks from the [PartMaterial](api:PartMaterial) enum. A material sets how the part's surface is drawn and, for a [Part](api:Part), how heavy the part is, because each material has a density.

A part's color tints its material: a red `Brick` part looks like red brick. The material decides the texture and how shiny the part is.

A material is a look, not a behavior: a `Water` part does not make players swim and a `Lava` part does not hurt them.

## CastShadow

[CastShadow](api:Part.CastShadow) decides whether a part casts a shadow. Turn `CastShadow` off for tiny decorative parts and for see-through parts whose shadow would look wrong.

## Climbable

When [Climbable](api:Part.Climbable) is on, characters can climb the part like a ladder. Use `Climbable` on a ladder, a vine wall or a climbing net.

Only a [Part](api:Part) has `Climbable`. A [MeshPart](api:MeshPart) cannot be made climbable.

## Properties from other classes

A part's three jobs come from the [classes](../engine/instance-tree.md) [Part](api:Part) is built on, which is why a part has so many [properties](../engine/properties-methods-signals.md) and why other objects [share](../creator/properties-panel.md) some of them.

Use `IsA("PhysicsInstance")` to match a `Part`, a [MeshPart](api:MeshPart) and a [UnionPart](api:UnionPart) alike.

A `MeshPart` is not a `Part`; see [Testing the class](../engine/instance-tree.md#testing-the-class).

## Troubleshooting

| What you see | Fix |
|---|---|
| Your sphere is tiny even though its [Size](api:Part.Size) is huge. | Make all three `Size` numbers the same. See [Shapes](#shapes). |
| `part.Size.X = 10` does nothing. | Assign a whole new [Vector3](api:Vector3): `part.Size = new Vector3(10, part.Size.Y, part.Size.Z)`. See [Size](#size) and [A property gives you a copy](../engine/data-types.md#a-property-gives-you-a-copy). |
| `part.IsA("Part")` is false for your mesh. | Use `IsA("PhysicsInstance")` to match a [Part](api:Part), a [MeshPart](api:MeshPart) and a [UnionPart](api:UnionPart) alike. See [Properties from other classes](#properties-from-other-classes) and [Testing the class](../engine/instance-tree.md#testing-the-class). |
