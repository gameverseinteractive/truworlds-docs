---
title: Building
description: How a world is built from parts, groups of parts and imported shapes
---

# Building

Everything a player can see, stand on or bump into in a TruWorlds world is built from a small set of objects. The most important is the [part](parts.md): a block, sphere, cylinder or wedge that you size, color and place. Walls, floors, ramps, trees, cars and furniture are all made by putting parts together. When the world is played, a part that is [not anchored](anchoring-and-collisions.md) falls, rolls and can be pushed.

## Models and folders

A [Model](models-and-folders.md) is a group of parts and other instances that can be moved as one. A [Folder](api:Folder) is a plain container used only to organize.

## Surfaces and new shapes

- A [Surface](surfaces-and-textures.md) is an image on one face of a part.
- [Solid modeling](solid-modeling.md) makes new shapes out of blocks, spheres, cylinders and wedges by combining parts in three ways: union, negate and intersect. A [UnionPart](api:UnionPart) is a solid made by combining parts.
- A [MeshPart](meshes.md) is a part shaped by an uploaded mesh.
