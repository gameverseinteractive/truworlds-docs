---
title: Particles and fire
description: Smoke, sparks, rain, magic and ready-made flames
---

# Particles and fire

A [`ParticleEmitter`](api:ParticleEmitter) sprays many small pictures, called particles, from a point, and moves, resizes, recolors and fades each one over its life. A [`Fire`](api:Fire) is a ready-made flame with four settings.

## Effects are visual only

[`ParticleEmitter`](api:ParticleEmitter), [`Fire`](api:Fire) and [`Trail`](trails.md) are visual only: they do not collide with anything, give off light or hurt players. If your fire should hurt, write that yourself.

## Where effects go

A [`ParticleEmitter`](api:ParticleEmitter) and a [`Fire`](api:Fire) are built on [`PointInstance`](../engine/point-instances.md), like [lights](lights.md).

> [!WARNING]
> An emitter or a fire placed inside a part sits at the center of that part and moves and turns with it.

This server script, attached to a part, is the simplest emitter: default sparkles rising from the part.

```truscript
local sparkles = new ParticleEmitter() {
    Parent = this
}
```

Use [`OffsetPosition`](api:PointInstance.OffsetPosition) (studs) and [`OffsetRotation`](api:PointInstance.OffsetRotation) (degrees) to shift and turn an emitter or a fire relative to its part.

## Effects in invisible parts

> [!WARNING]
> An effect inside an invisible part is invisible too: an emitter mounted on an invisible part (`Transparency = 1`) adds the part's transparency to its own and shows nothing.

When an effect is inside an invisible part, set the effect's [`IgnoreParent`](../engine/visual-instances.md) to `true`.

## How an emitter works

A new emitter, with every property at its default, emits 20 white sparkles a second straight up at 5 studs per second, each living 5 to 10 seconds.

While [`Enabled`](api:ParticleEmitter.Enabled) is true, the emitter creates [`Rate`](api:ParticleEmitter.Rate) particles per second. Turning it off stops new particles; those already in the air live out their lives.

For a one-off puff of particles, such as an impact or a pickup, use [`Emit`](api:ParticleEmitter.Emit).

When an emitter that is not inside an invisible part shows nothing, check `Enabled`, `Rate`, and that [`LifetimeTransparency`](api:ParticleEmitter.LifetimeTransparency) is not `1` throughout.

## Values that change over a particle's life

Many emitter properties are not plain numbers. They use three small [data types](../engine/data-types.md): [`NumberRange`](api:NumberRange), [`NumberSequence`](api:NumberSequence) and [`ColorSequence`](api:ColorSequence). In a sequence, time is not in seconds: it runs from `0`, when the particle appears, to `1`, when it disappears.

| Type | What it means |
|---|---|
| [`NumberRange`](api:NumberRange) | Pick a random number between a minimum and a maximum for each particle. |
| [`NumberSequence`](api:NumberSequence) | A number that changes over each particle's life. |
| [`ColorSequence`](api:ColorSequence) | A color that changes over each particle's life. |

## Shape and direction

Particles appear inside a shape centered on the emitter and lined up with the emitter's own axes.

With [`ShapeInOut`](api:ParticleEmitter.ShapeInOut) `Outward`, particles fly away from the shape. `Inward` is the reverse. With `Both`, each particle picks one at random.

With [`Shape`](api:ParticleEmitter.Shape) `Box`, particles start anywhere in the [`ShapeSize`](api:ParticleEmitter.ShapeSize) box. With `Outward` they fly along the emitter's up axis (+Y); `Inward` sends them down it.

> [!WARNING]
> A `Box` emitter fires along the emitter's own up axis.

To aim a `Box` emitter, turn the emitter: set [`OffsetRotation`](api:PointInstance.OffsetRotation) when it is inside a part, or [`Rotation`](api:DynamicInstance.Rotation) when it stands alone.

## Example: A jet that sprays downward

This server script, attached to a part such as the underside of a hovering platform, is a jet that sprays downward. `OffsetRotation` turns the emitter over, so its up axis points down.

```truscript
local jet = new ParticleEmitter() {
    Name = "Jet",
    OffsetPosition = new Vector3(0, -1, 0),
    OffsetRotation = new Vector3(180, 0, 0),
    ShapeSize = new Vector3(0.5, 0, 0.5),
    Speed = new NumberRange(8, 12),
    Lifetime = new NumberRange(0.5, 1),
    Parent = this
}
```

## How particles move

[`Acceleration`](api:ParticleEmitter.Acceleration) is a constant push on every particle, in studs per second, per second: `(0, -30, 0)` is gravity-like, and a sideways value is wind. It is in world space, or in the emitter's own space while [`LocalSpace`](api:ParticleEmitter.LocalSpace) is true.

With `LocalSpace` false, a particle stays where it was created, so a moving emitter leaves particles behind it. With `LocalSpace` true, particles move and turn with the emitter.

## What particles look like

| Property | What it does |
|---|---|
| [`Texture`](api:ParticleEmitter.Texture) | The picture drawn for each particle. |
| [`LifetimeColor`](api:ParticleEmitter.LifetimeColor) | Each particle's color over its life. It tints the texture. |
| [`LifetimeSize`](api:ParticleEmitter.LifetimeSize) | Each particle's size over its life. A particle is drawn twice this many studs across, so `1` is a 2-stud particle. |
| [`LifetimeTransparency`](api:ParticleEmitter.LifetimeTransparency) | Each particle's transparency over its life, from `0` (solid) to `1` (invisible). The emitter's own [`Transparency`](api:VisualInstance.Transparency) is applied on top. |

## Size and fading out

When particles are twice the size you asked for, halve the [`LifetimeSize`](api:ParticleEmitter.LifetimeSize) number.

A particle that is solid until the instant it dies visibly pops out of existence. Fade your particles out: end [`LifetimeTransparency`](api:ParticleEmitter.LifetimeTransparency) at `1`, or `LifetimeSize` at `0`.

## Particle pictures

An emitter's [`Texture`](api:ParticleEmitter.Texture) is an asset id, not a file path on your computer. To use your own particle picture, [upload an image](../creator/asset-library.md) and use its asset id, which looks like `asset://123456`.

## Fire

Put a [`Fire`](api:Fire) in a part and the part is on fire.

This server script, attached to a part, sets the part on fire.

```truscript
local flames = new Fire() {
    Parent = this
}
```

Only a `Fire`'s position is used: the flames always rise straight up in the world, however the part or the fire is turned. Add a warm [`PointLight`](lights.md) beside a `Fire`.

| Property | What it does |
|---|---|
| [`RootColor`](api:Fire.RootColor) | The color at the base of the flames. |
| [`TipColor`](api:Fire.TipColor) | The color at the tips of the flames. |
| [`EffectScale`](api:Fire.EffectScale) | The size of the flames, as a multiplier. A value below `0.05` draws as `0.05`. |
| [`EffectSpeed`](api:Fire.EffectSpeed) | How fast the flames move, as a multiplier. A value below `0.05` plays as `0.05`. |

## Troubleshooting

| What you see | Fix |
|---|---|
| An emitter shows nothing. | Set the effect's [`IgnoreParent`](../engine/visual-instances.md) to `true` if it is inside an invisible part; otherwise check [`Enabled`](api:ParticleEmitter.Enabled), [`Rate`](api:ParticleEmitter.Rate), and that [`LifetimeTransparency`](api:ParticleEmitter.LifetimeTransparency) is not `1` throughout. See [Effects in invisible parts](#effects-in-invisible-parts) and [How an emitter works](#how-an-emitter-works). |
| Particles are twice the size you asked for. | Halve the [`LifetimeSize`](api:ParticleEmitter.LifetimeSize) number. See [What particles look like](#what-particles-look-like) and [Size and fading out](#size-and-fading-out). |
| Particles go up, and you want them to go sideways or down. | Turn the emitter: set [`OffsetRotation`](api:PointInstance.OffsetRotation) when it is inside a part, or [`Rotation`](api:DynamicInstance.Rotation) when it stands alone. See [Shape and direction](#shape-and-direction). |
| A fire does not light the room or hurt anyone. | Add a warm [`PointLight`](api:PointLight) beside the [`Fire`](api:Fire), and write any damage yourself. See [Effects are visual only](#effects-are-visual-only) and [Fire](#fire). |
