---
title: CMatrix
description: Position and orientation in one value, in world and local space
---

# CMatrix

A [CMatrix](api:CMatrix) holds a position, a point in studs, and an orientation: which way the thing's own right, up and forward point.

Every part, light and other positioned instance has a [CMatrix](api:DynamicInstance.CMatrix) property. For properties that are two views of the same stored value, see [Object members](properties-methods-signals.md#properties). On an instance, [Position](api:DynamicInstance.Position) reads and writes the position only. Setting it leaves the orientation alone. [Rotation](api:DynamicInstance.Rotation) reads and writes the orientation only, as three angles in degrees. Setting it leaves the position alone.

For simple jobs, `Position` and `Rotation` are all you need. `CMatrix` is the tool for everything that involves a thing's own directions: "6 studs in front of the player", "turn the turret toward the target", "swing the door around its hinge", "keep this hat on that head".

## Building a CMatrix

- `new CMatrix()` or `CMatrix.Identity` is at `(0, 0, 0)`, facing forward (-Z), upright.
- `new CMatrix(position)` is at `position`, facing forward, upright.
- `new CMatrix(position, new Vector3(pitch, yaw, roll))` is at `position`, turned by the angles in degrees.

## World space and local space

The same point can be described in two ways. World space is measured from the world's origin along the world's axes, as in "20 studs east of the origin".

Local space, or own space, is measured from a particular thing, along that thing's own axes, as in "2 studs in front of the cannon and 1 stud above it". The description stays true however the cannon is moved and turned.

A [CMatrix](api:CMatrix) is the translator between world space and local space.

## A thing's own directions

A [CMatrix](api:CMatrix)'s [Forward](api:CMatrix.Forward) is the direction it faces (its own -Z) and [Backward](api:CMatrix.Backward) the opposite, as length-1 vectors in world space; [Up](api:CMatrix.Up) is its own +Y and [Down](api:CMatrix.Down) the opposite; [Right](api:CMatrix.Right) is its own +X and [Left](api:CMatrix.Left) the opposite. These directions are read-only: setting `Forward` or another direction is an error.

[LookingAt](api:CMatrix.LookingAt) builds a rotation whose front (-Z) points at the target.

For the world's directions, see [Coordinates and units](coordinates-and-units.md#forward-is--z).

## Assign a whole matrix

Always assign a whole matrix: `part.CMatrix = ...`. [A property gives you a copy](data-types.md#a-property-gives-you-a-copy).

## Placing relative to a thing

Multiplying two [CMatrix](api:CMatrix) values combines them: in `a * b`, `b` is applied inside `a`'s own space. `base * new CMatrix(new Vector3(0, 0, -6))` is the place 6 studs in front of `base`, with `base`'s rotation.

Moving along the world's axes is `m + offset`; moving along the thing's own axes is `m * new CMatrix(offset)`. `matrix + offset` is the matrix moved by a [Vector3](api:Vector3) in world space, with its rotation unchanged. Order matters when you combine matrices: `a * b` and `b * a` are different.

`matrix * point` converts the point from the matrix's own space to world space. `character.BodyCMatrix * new Vector3(3, 3, 0)` is the point 3 studs to the character's right and 3 studs above its middle.

A local point's axes are `(right, up, -forward)`, so `new Vector3(2, 0, -5)` in a thing's local space is "2 to its right and 5 in front".

To convert a world point to a local point, use `m.XFormInv(point)`, for questions such as "Is this world position in front of me or behind me, and how far to my side?"

## Example: A crate in front of each player

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, drops a crate 6 studs in front of each player's character, 4 studs up, turned the same way they face.

```truscript
func drop_crate_for(character):
    local spot = character.CMatrix * new CMatrix(new Vector3(0, 4, -6))
    local crate = new Part() {
        Name = "Crate",
        Size = new Vector3(3, 3, 3),
        CMatrix = spot,
        Parent = world
    }

for player in game.Players.GetPlayers():
    if player.Character != nil:
        drop_crate_for(player.Character)
```

## Turning

Which side you multiply a rotation-only matrix on decides what the thing turns around. `m * new CMatrix(Vector3.Zero, angles)` turns the thing on the spot, around its own axes. Its position does not change.

`new CMatrix(Vector3.Zero, angles) * m` swings the thing around the world origin `(0, 0, 0)`, around the world's axes. Its position changes unless it is on the axis.

## Example: A part that spins on the spot

This server script, attached to an anchored [Part](api:Part), spins the part on the spot around its own up axis, a quarter turn per second.

```truscript
game.TimeSystem.FrameStepped.Connect(func(dt):
    this.CMatrix = this.CMatrix * new CMatrix(Vector3.Zero, new Vector3(0, 90 * dt, 0))
)
```

## Keeping one thing attached to another

`m.Inverse()` is the matrix that undoes `m`. `m * m.Inverse()` is the identity (allowing for rounding).

`relative = a.Inverse() * b` finds a relative matrix: `b` as seen from `a`. `b = a * relative` puts the relative matrix back.

For unanchored parts that should stay together physically, use a weld instead of keeping one attached to the other with a relative matrix; the weld does this for you.

## Moving a model

A [model](instance-tree.md#classes-and-members)'s [PrimaryBody](api:Model.PrimaryBody) is the part the model is moved by. You must set it; a model never picks one for itself.

`model.PivotTo(matrix)` moves and turns the whole model so the `PrimaryBody` lands exactly on `matrix`. Every other positioned instance inside keeps its place relative to it. Anchored and unanchored parts both move.

This server script, attached to a [Model](api:Model) whose `PrimaryBody` is set, moves the whole model 20 studs up and turns it a quarter turn, in one step.

```truscript
local now = this.CMatrix
this.PivotTo(now * new CMatrix(new Vector3(0, 20, 0), new Vector3(0, 90, 0)))
```

If a model's `PrimaryBody` is not set to a part, [PivotTo](api:Model.PivotTo) and the setters (`model.CMatrix = ...`, `model.Position = ...`) do nothing, without an error.

A model has no `Rotation` and no [Quaternion](api:Quaternion) property. Turn a model with `PivotTo` and a matrix.

## Parts inside parts

Nesting a part inside a part does not make them move together. To make parts move together, put them side by side in a [Model](api:Model) and weld them, or move them with `PivotTo`.

## Smooth motion

Setting a position is a teleport, not a push; see [Forces and movers](../physics/forces-and-movers.md#teleporting-or-pushing).

For smooth motion, step it yourself: change the matrix a little each frame in a [FrameStepped](api:TimeSystem.FrameStepped) handler, scaled by `dt`. This is good for continuous motion: spinning, orbiting, following. Or let physics do it: leave the part unanchored and use a mover or constraint. This is good for things that should push and be pushed.

## The math

[Row0](api:CMatrix.Row0), [Row1](api:CMatrix.Row1) and [Row2](api:CMatrix.Row2) hold a [CMatrix](api:CMatrix)'s orientation as a 3-by-3 rotation matrix, one row each, and [Row3](api:CMatrix.Row3) holds its position. The columns of that rotation matrix are the `CMatrix`'s `Right`, `Up` and `Backward`.

`m * p` is `m.Position + m.Right * p.X + m.Up * p.Y + m.Backward * p.Z`: the rotation applied to the point, then the position added.

`(a * b) * p` equals `a * (b * p)`: the matrix `a * b` applies `b` first, then `a`.

`m.XFormInv(p)` is `m.Inverse() * p`.

## Troubleshooting

| What you see | Fix |
|---|---|
| `part.CMatrix.Position = ...` does nothing. | Assign a whole matrix: `part.CMatrix = ...`. [Assign a whole matrix](#assign-a-whole-matrix), [A property gives you a copy](data-types.md#a-property-gives-you-a-copy) |
| An error says a [Model](api:Model) has no member named Rotation: `Model has no member named 'Rotation'.` | Turn a model with [PivotTo](api:Model.PivotTo) and a matrix. [Moving a model](#moving-a-model) |
