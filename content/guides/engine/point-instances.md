---
title: PointInstance
description: Lights, emitters and other objects placed by the part they are in
---

# PointInstance

A [PointInstance](api:PointInstance) has a position but no size or shape of its own: a light, a flame, a source of particles, a floating name tag, the spot where players appear. [PointLight](api:PointLight), [SpotLight](api:SpotLight), [ParticleEmitter](api:ParticleEmitter), [Fire](api:Fire), [Explosion](api:Explosion), [Interaction](api:Interaction), [PlayerStart](api:PlayerStart), [SpeechBubble](api:SpeechBubble) and [BillboardUI](api:BillboardUI) are built on `PointInstance`. It is one of the important base classes that give many engine classes their default behavior.

On top of [CMatrix](cmatrix.md), [Position](api:DynamicInstance.Position), `Rotation`, [Visible](api:VisualInstance.Visible) and [Transparency](api:VisualInstance.Transparency), `PointInstance` adds four properties of its own: [AttachToParent](api:PointInstance.AttachToParent), [Offset](api:PointInstance.Offset), [OffsetPosition](api:PointInstance.OffsetPosition) and [OffsetRotation](api:PointInstance.OffsetRotation).

## Following the part it is inside

Move or turn the part a [PointInstance](api:PointInstance) is inside and the point goes with it, with no script and no weld. With the defaults, a `PointInstance` placed inside a part sits at the part's center, facing the way the part faces, and stays there as the part moves.

To attach a light, effect, prompt or label to a part, use a `PointInstance` inside the part.

## Setting the offset

To put a [PointInstance](api:PointInstance) somewhere other than the center of its part, set its offset.

A [PointInstance](api:PointInstance)'s offset is measured in the part's [own space](cmatrix.md#world-space-and-local-space): an [OffsetPosition](api:PointInstance.OffsetPosition) of `(0, 5.5, 0)` is 5.5 studs along the part's own up. If a lamp post whose light has an `OffsetPosition` of `(0, 5.5, 0)` is knocked over, the light stays at the end of the post, not 5.5 studs above it in the world.

## Example: A light at the top of a lamp post

This server script, attached to a [Part](api:Part) that is a lamp post 10 studs tall, puts the light at the top of the post instead of the middle.

```truscript
local glow = new PointLight() {
    Name = "Glow",
    OffsetPosition = new Vector3(0, 5.5, 0),     # 5.5 studs above the post's center
    Parent = this
}
```

## Which ancestor it follows

A [PointInstance](api:PointInstance) follows its nearest ancestor that has a position: the closest part, [MeshPart](api:MeshPart) or other positioned instance above it in the tree. That is usually its parent, but not always.

A `PointInstance` directly inside a [Model](api:Model), not under any part, follows nothing, because a model has no position of its own: it does not follow the model's parts when they move one by one, but `model.PivotTo(...)` moves it along with everything else in the model.

## Detaching with AttachToParent

Set `AttachToParent = false` to stop a [PointInstance](api:PointInstance) following anything. A `PointInstance` with [AttachToParent](api:PointInstance.AttachToParent) set to false stays in the tree where it is, but keeps its own world pose and ignores the part's movement.

When the part moves, a `PointInstance` with `AttachToParent` true moves with it. With `AttachToParent` false, the point stays put.

## Attachments are different

An [Attachment](api:Attachment) is not a [PointInstance](api:PointInstance). It builds directly on [Instance](api:Instance).

A `PointInstance`'s position properties are [Offset](api:PointInstance.Offset) (relative) and [CMatrix](api:DynamicInstance.CMatrix) (world), kept in step. An `Attachment` has [CMatrix](api:CMatrix) only, and it is relative to the parent part.

For a `PointInstance`'s world position, read `point.Position`. For an `Attachment`'s, work it out: `part.CMatrix * attachment.CMatrix`.

[AttachToParent](api:PointInstance.AttachToParent) does not exist on an attachment. A `PointInstance` has [Visible](api:VisualInstance.Visible) and [Transparency](api:VisualInstance.Transparency). An `Attachment` does not.

For attachments in constraints, see [Constraints](../physics/constraints.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| A light in a model does not move with the model's parts. | Use a [PointInstance](api:PointInstance) inside the part. [Following the part it is inside](#following-the-part-it-is-inside), [Which ancestor it follows](#which-ancestor-it-follows) |
| An error says an [Attachment](api:Attachment) has no member named [Position](api:DynamicInstance.Position): `Attachment has no member named 'Position'. Did you mean 'CMatrix'?` | For a [PointInstance](api:PointInstance)'s world position, read `point.Position`. For an [Attachment](api:Attachment)'s, work it out: `part.CMatrix * attachment.CMatrix`. [Attachments are different](#attachments-are-different) |
