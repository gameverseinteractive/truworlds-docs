---
title: Anchoring and collisions
description: Why parts fall or stay put, and which parts collide
---

# Anchoring and collisions

[Anchored](api:PhysicsInstance.Anchored) and [CanCollide](api:PhysicsInstance.CanCollide) belong to [PhysicsInstance](api:PhysicsInstance), so they work the same on a [Part](api:Part), a [UnionPart](api:UnionPart) and a [MeshPart](api:MeshPart). For what each does, see [Physics](../physics/index.md).

## Editing and playing

While you edit, an unanchored part hanging in mid-air stays there. Anchoring problems show up only when you press play, because [physics runs only while a world is played](../physics/index.md). Start a playtest often.

## Anchoring parts

Floors, walls, buildings, trees and most scenery should be anchored.

An unanchored part is a loose object. When the world runs it falls until something solid stops it, and anything that hits it can push it or knock it over. Crates, balls, dominoes and vehicle bodies are unanchored. A crate built from six loose boards [falls apart](../physics/welds-and-joints.md).

To anchor parts in TruWorlds Creator, select them and click Anchor in the Edit group of the ribbon's Home or Model tab. Anchor works on every part inside the selection: click it with a [Model](api:Model) selected and every part in it is anchored.

A part made with `new Part()` is [not anchored](../physics/forces-and-movers.md#gravity-and-falling). For moving an anchored part as a lift, see [Teleporting or pushing](../physics/forces-and-movers.md#teleporting-or-pushing).

## The four combinations

<!-- diagram: A 2 x 2 grid matching the table: a character on a floating platform, a character walking through a hologram, a crate resting on the ground, a part falling past a VoidHeight line -->

| [Anchored](api:PhysicsInstance.Anchored) and [CanCollide](api:PhysicsInstance.CanCollide) | What the part is |
|---|---|
| On, on | Scenery: solid and fixed. Floors, walls, buildings. |
| On, off | A ghost that stays put: decoration players can walk through (grass, light beams, holograms), and, when invisible, [trigger zones](../physics/touch-and-overlap.md). |
| Off, on | A loose object: it falls, lands, can be pushed and stacked. Crates, balls, debris. |
| Off, off | Almost always a mistake: it falls through everything and is destroyed when it passes [VoidHeight](api:World.VoidHeight). |

## Neither anchored nor solid

When a part vanishes shortly after play starts because it is neither anchored nor collidable and fell below [VoidHeight](api:World.VoidHeight), anchor it. See [Gravity and falling](../physics/forces-and-movers.md#gravity-and-falling).

## Invisible walls

To keep players inside the map, ring it with tall anchored parts that are solid but not drawn. A [hidden part still collides](../engine/visual-instances.md#hidden-is-still-there).

## Example: A door that stops being solid

A door does not have to swing. The simplest door stays where it is and stops being solid.

This server script, on an anchored [Part](api:Part) used as a door, fades it when touched and lets players through for 3 seconds.

```truscript
local busy = false

this.Touched.Connect(func(other):
    if busy:
        return
    busy = true
    this.CanCollide = false
    this.Transparency = 0.7
    wait(3)
    this.CanCollide = true
    this.Transparency = 0
    busy = false
)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| A part vanishes shortly after play starts. | Anchor it. See [Neither anchored nor solid](#neither-anchored-nor-solid). |
| A model is stuck to the ground. | See [Welding a whole model](../physics/welds-and-joints.md#welding-a-whole-model). |
