---
title: Data types
description: Vector3, Color3 and the other data types, and how they copy and compare
---

# Data types

A data type, such as the position `new Vector3(0, 5, 0)` or the color `new Color3(1, 0, 0)`, is a small value with no name, no parent and no place in [the tree](instance-tree.md).

## The common data types

| Data type | Holds and is used for |
|---|---|
| [Vector3](api:Vector3) | Three numbers, [X](api:Vector3.X), [Y](api:Vector3.Y) and [Z](api:Vector3.Z). Used for positions, sizes, directions, velocities, and rotations in degrees. |
| [Vector2](api:Vector2) | Two numbers, [X](api:Vector2.X) and [Y](api:Vector2.Y). Used for UI positions and sizes, and texture tiling. |
| [Color3](api:Color3) | Red, green and blue. Used for the colors of parts and lights. |
| [Color4](api:Color4) | A color with a fourth channel, alpha, for opacity. |
| [Quaternion](api:Quaternion) | A rotation as four numbers. Used for rotation around any axis. |
| [CMatrix](api:CMatrix) | A position and a rotation together. Used for where something is and which way it faces. |
| [BoundsBox](api:BoundsBox) | A 3D box aligned to the world axes. Used for regions of space and measuring builds. |

For placing and turning things with a `CMatrix`, see [CMatrix](cmatrix.md).

## A property gives you a copy

A property such as [Size](api:Part.Size), [Color](api:Part.Color) or [CMatrix](api:DynamicInstance.CMatrix) holds a data type. Reading it gives you a copy, and changing a member of that copy does not change the object. `this.Position` gives a copy.

This server script, attached to a [Part](api:Part), sets the Y of the part's `Size` directly, then assigns a whole new `Size` with Y set to 10.

```truscript
this.Size.Y = 10                                        # no effect on the part
this.Size = new Vector3(this.Size.X, 10, this.Size.Z)   # correct: assign a whole new value
```

`this.Position.Y = 20` never writes the part's own position, and gives no error. The trap of `this.Position.Y = 20` exists for every data-type property.

When `part.Position.Y = 20` does nothing because it changed a copy, assign a whole value: `part.Position = new Vector3(x, 20, z)`.

`this.Position += offset` is safe because it means `this.Position = this.Position + offset`: read, add, and assign the property.

## Values in variables are shared

Inside your script, a data-type value you hold in a variable is shared when you assign it, exactly like an instance.

Treat every data-type value as if it could not be changed. Never assign to `.X`, `.Y`, `.R`, `.Position` or any other member of a vector, color or matrix. Always make a new value, with `new` or with arithmetic, and assign that.

## Arithmetic

Multiplying or dividing two vectors works component by component: `new Vector3(1, 2, 3) * new Vector3(2, 2, 0)` is `(2, 4, 0)`.

Adding a number to a vector or subtracting one from it (`vector + 1`, `vector - 1`) is an error. Instead of adding a number to a vector, add a vector: `vector + new Vector3(1, 1, 1)`.

## Comparing data types

`==` and `!=` ask the same question for instances and for data types: are these the very same object?

Because reading a property gives a fresh copy each time, a data-type property never equals itself: in a script on a part, `this.Position == this.Position` is `false`. Compare [Vector3](api:Vector3) or [Vector2](api:Vector2) values by content with `(a - b).Length() < 0.001`, or compare single components.

The identity rule of `==` applies wherever TruScript matches values: `list.contains(v)`, `list.index_of(v)` and table keys. A `Vector3` used as a key can only be found again with that same object, not with an equal-looking new one. To key data by position, build a string.

## Troubleshooting

| What you see | Fix |
|---|---|
| Nothing happens after `part.Position.Y = 20`. | Assign a whole value: `part.Position = new Vector3(x, 20, z)`. [A property gives you a copy](#a-property-gives-you-a-copy) |
| Changing one vector changes "another" one. | Treat every data-type value as unchangeable, and make a new value with `new` or arithmetic instead of assigning to a member. [Values in variables are shared](#values-in-variables-are-shared) |
| `if part.Position == target.Position:` is never true. | Compare [Vector3](api:Vector3) or [Vector2](api:Vector2) values by content with `(a - b).Length() < 0.001`, or compare single components. [Comparing data types](#comparing-data-types) |
| A table lookup with a [`Vector3`](api:Vector3) key returns `nil`. | To key data by position, build a string. [Comparing data types](#comparing-data-types) |
| An error says addition is not supported between a [Vector3](api:Vector3) and a number: `Addition is not supported between types 'Vector3' and 'number'.` | Instead of adding a number to a vector, add a vector: `vector + new Vector3(1, 1, 1)`. [Arithmetic](#arithmetic) |
