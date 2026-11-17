---
title: Meshes
description: Import a custom 3D mesh and use it as a MeshPart
---

# Meshes

A shape made in a 3D modeling program is called a mesh: a surface built from many small triangles. You export a mesh to a file, upload the file to TruWorlds, and show it in your world with a [MeshPart](api:MeshPart).

## Uploading a mesh

Uploading a mesh gives it an asset id. You [upload](../creator/asset-library.md) a mesh once, then use it as often as you like in any of your worlds: each use is a [MeshPart](api:MeshPart) pointing at the same asset id.

## Scale and origin

One unit in a mesh file, which 3D programs treat as one meter, becomes 4 studs. When a mesh comes in tiny or enormous because the file was made at a different scale, change [MeshScale](api:MeshPart.MeshScale), or fix the scale at the source and upload again.

A mesh keeps the origin it had in your modeling program. The [MeshPart](api:MeshPart)'s [Position](api:DynamicInstance.Position) is where that origin goes. To make a mesh stand on the ground when its position is on the ground, put its origin at its base before exporting.

## MeshPart properties

A [MeshPart](api:MeshPart) has three properties of its own. What players see and what they bump into are two different shapes.

| Property | What it does |
|---|---|
| [MeshId](api:MeshPart.MeshId) | The asset id of the mesh to show. |
| [MeshScale](api:MeshPart.MeshScale) | Multiplies the mesh's size on each axis. |
| [CollisionFidelity](api:MeshPart.CollisionFidelity) | Sets how closely the solid shape follows the mesh. |

A `MeshPart` has no [Size](api:Part.Size), no [Shape](api:Part.Shape), no [Color](api:Part.Color), no [Material](api:Part.Material), no [CastShadow](api:Part.CastShadow) and no [Climbable](api:Part.Climbable).

A `MeshPart` is not a [Part](api:Part); see [Testing the class](../engine/instance-tree.md#testing-the-class).

A `MeshId` is not a file path; a mesh on your computer has to be uploaded first.

## Resizing with MeshScale

Because a [MeshPart](api:MeshPart) has no `Size`, `MeshScale` is how you resize it. It is three multipliers, one per axis, of the uploaded size: `(1, 1, 1)` is the uploaded size, `(2, 2, 2)` twice as big, and `(1, 3, 1)` three times as tall.

Uneven scaling stretches the mesh, and its textures with it.

## Example: A rock at twice its size

This server script, attached to any instance in the world, makes an anchored `MeshPart` named Rock from an uploaded mesh, at twice its uploaded size, with hull collision.

```truscript
local rock = new MeshPart() {
    Name = "Rock",
    MeshId = "asset://123456",              # replace with the id of your own mesh
    MeshScale = new Vector3(2, 2, 2),       # twice the size it was uploaded at
    CollisionFidelity = CollisionFidelity.Hull,
    Position = new Vector3(0, 2, -15),
    Anchored = true,                        # like any part made by a script, it falls unless anchored
    Parent = world
}
```

## How a mesh looks

A mesh's colors, materials and textures come from the uploaded file and cannot be changed with properties. To have the same shape in two colors, upload two versions.

A [Surface](api:Surface) inside a [MeshPart](api:MeshPart) does nothing; see [Which parts show a Surface](surfaces-and-textures.md#which-parts-show-a-surface).

## A MeshPart in the world

A [MeshPart](api:MeshPart) is a physical object exactly like a part: unanchored, it falls and can be pushed; anchored, it stays put. A part made with `new Part()` is not anchored; see [Gravity and falling](../physics/forces-and-movers.md#gravity-and-falling).

A `MeshPart` cannot be unioned; see [Making a union](solid-modeling.md#making-a-union). For a mesh with a skeleton, see [Animating MeshParts](../animation/animating-meshparts.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| Your mesh is tiny, or enormous. | Change `MeshScale`, or fix the scale at the source and upload again. See [Scale and origin](#scale-and-origin). |
