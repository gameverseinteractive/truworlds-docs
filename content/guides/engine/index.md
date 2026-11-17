---
title: Engine concepts
description: How a world is made of instances, their members and data types
---

# Engine concepts

A world is a [tree of instances](instance-tree.md). A part, a light, a button and a player are all instances, and you work with all of them in the same way. Each instance has [properties you can read and change, methods you can call and signals you can listen to](properties-methods-signals.md). `new ClassName()` [creates](creating-and-destroying.md) one instance of a class and gives you that instance.

## Values and units

- Positions, sizes, rotations and colors are described by small values called [data types](data-types.md).
- Positions, sizes, distances and offsets are all in [studs](coordinates-and-units.md).
- A [`CMatrix`](cmatrix.md) is a position and an orientation in one value.

## Kinds of instances

- A [`VisualInstance`](visual-instances.md) is any instance that can be seen.
- A [`PointInstance`](point-instances.md) has a position but no size or shape of its own: a light, a flame, a source of particles, a floating name tag, the spot where players appear.
- A [value object](value-objects.md) is an instance whose whole job is to hold one value.
