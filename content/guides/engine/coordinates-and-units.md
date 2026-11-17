---
title: Coordinates and units
description: Studs, Y up, forward along -Z, angles, time and color ranges
---

# Coordinates and units

## Units at a glance

| What | Unit or direction |
|---|---|
| Distance, position and size | Studs |
| Up | +Y |
| Forward | -Z: [Vector3.Forward](api:Vector3.Forward) is `(0, 0, -1)` |
| Right | +X. [Vector3.Right](api:Vector3.Right) is `(1, 0, 0)` |
| Angles in properties | Degrees ([Rotation](api:DynamicInstance.Rotation), [OffsetRotation](api:PointInstance.OffsetRotation), [AimYaw](api:CharacterController.AimYaw), [Lighting.SunAngle](api:Lighting.SunAngle)) |
| Angles in `math` functions | Radians ([math.sin](api:global/math.sin), [math.cos](api:global/math.cos), [math.atan2](api:global/math.atan2)), and so are angles in [Quaternion.FromAxisAngle](api:Quaternion.FromAxisAngle) |
| Time | Seconds: `wait(seconds)`, `DestroyAfter(seconds)`, [WaitForChild](api:Instance.WaitForChild) timeouts, [TweenParams](api:TweenParams) time and delay, and the `dt` passed to [FrameStepped](api:TimeSystem.FrameStepped) |
| Speed | Studs per second ([LinearVelocity](api:PhysicsInstance.LinearVelocity), [MoveSpeed](api:CharacterController.MoveSpeed)) |
| Color channels and transparency | 0 to 1 |

## Studs and the avatar

A [stud](index.md) is a quarter of a meter (0.25 m). What gives a stud meaning is the avatar: everything in your world is experienced by a character 6.6 studs tall. See the [avatar's size](../players/avatars.md#size).

## Forward is -Z

Forward being negative Z surprises people who expect +Z. With +X to the right and +Y up, TruWorlds uses a right-handed coordinate system, so +Z points back toward the viewer and forward is -Z.

To move something forward in the world, subtract from Z: `position + new Vector3(0, 0, -10)` is 10 studs forward. Better, use the name and avoid the sign: `position + Vector3.Forward * 10`.

For the way a thing is facing, use `thing.CMatrix.Forward`, `.Right`, `.Up` and the others. For example, a cannonball leaves along `cannon.CMatrix.Forward`.

This server script, attached to a [Part](api:Part) that has been rotated 90 degrees around Y, prints the world's forward and this part's own forward.

```truscript
print(Vector3.Forward)         # Vector3(0, 0, -1): the world's forward, always
print(this.CMatrix.Forward)    # about Vector3(-1, 0, 0): this part's own forward
```

The front of a build should face -Z.

## Where Position is measured

A part's [Position](api:DynamicInstance.Position) is its center. A 4-stud-tall part resting on the ground at Y = 0 has a `Position.Y` of 2. To rest a part on top of another, add half of each height.

A character's `Position` is the point it stands on, at its feet. `character.BodyCMatrix` is the middle of its body, 3.2 studs higher for the default avatar. A character standing on ground whose top is at Y = 0 reads a `Position.Y` of 0, give or take a thousandth of a stud.

## Degrees and radians

`math.deg(radians)` converts radians to degrees. `math.deg(math.pi)` is `180`. When a [Rotation](api:DynamicInstance.Rotation) of 1.57 barely turns the part because `Rotation` is in degrees, use 90, or `math.deg(1.57)`.

`Rotation`'s `Y` component is yaw. A positive value turns the object to its left: its front swings from -Z toward -X, counter-clockwise seen from above.

Mixing up degrees and radians in [AngularVelocity](api:PhysicsInstance.AngularVelocity): see [Forces and movers](../physics/forces-and-movers.md#velocity).

## Per second, not per frame

Movement written per frame runs at different speeds on different devices. Multiply by the frame time to get "per second".

## Example: A part that moves at a steady speed

This server script, attached to an anchored [Part](api:Part), moves it forward at exactly 8 studs per second, whatever the frame rate.

```truscript
local speed = 8
game.TimeSystem.FrameStepped.Connect(func(dt):
    this.Position = this.Position + this.CMatrix.Forward * speed * dt
)
```

## Transparency and alpha

[Transparency](api:VisualInstance.Transparency) and alpha run in opposite directions. A panel with `Color = new Color4(0, 0, 0, 0.25)` is mostly see-through; a part with `Transparency = 0.25` is mostly solid.

## Troubleshooting

| What you see | Fix |
|---|---|
| Things appear behind where you expected. | Subtract from Z, or better, use [Vector3.Forward](api:Vector3.Forward) times the distance. For the way a thing is facing, use `thing.CMatrix.Forward`. [Forward is -Z](#forward-is--z), [Placing relative to a thing](cmatrix.md#placing-relative-to-a-thing) |
| A part is half sunk into the floor. | Rest a part on top of another by adding half of each height. [Where Position is measured](#where-position-is-measured) |
| A rotation of 1.57 barely turns the part. | Use 90, or `math.deg(1.57)`. [Degrees and radians](#degrees-and-radians), [Forces and movers](../physics/forces-and-movers.md#velocity) |
| Movement is faster on a faster computer. | Multiply by the frame time to get "per second". [Per second, not per frame](#per-second-not-per-frame), [Units at a glance](#units-at-a-glance) |
