---
title: Forces and movers
description: Move parts with velocity, conveyors and movers instead of teleporting them
---

# Forces and movers

A mover moves a part by pushing on it.

## Gravity and falling

A part made with `new Part()` is not anchored, so it falls as soon as it is in [`world`](api:global/world). A part inserted from the ribbon in TruWorlds Creator is anchored.

Parts simulate only inside `world`. A part with no parent, or in `game.Storage`, does not collide, fall or fire touch events until it is moved into `world`.

[`world.Gravity`](api:World.Gravity) is the strength of gravity on unanchored parts, in studs per second squared. An unanchored part that drops below [`world.VoidHeight`](api:World.VoidHeight) is destroyed. Anchored parts never are, however low.

## Teleporting or pushing

Setting a position is a teleport, not a push. An anchored part moved by a script can serve as a simple lift or moving floor for characters, but loose parts do not ride it sideways.

## Velocity

[`LinearVelocity`](api:PhysicsInstance.LinearVelocity) is a part's velocity in studs per second, in world axes. On an unanchored part, scripts can read it for the part's speed and set it to launch the part.

[`AngularVelocity`](api:PhysicsInstance.AngularVelocity) is a part's spin around each world axis, in radians per second: `new Vector3(0, 6.28, 0)` is one turn per second around the vertical axis. A part's [`Rotation`](api:DynamicInstance.Rotation) is in degrees. Mixing it up with [AngularVelocity](api:AngularVelocity) makes things spin about 57 times faster or slower than you meant. Use `math.rad(degrees)` to convert degrees to radians.

> [!WARNING]
> [LinearVelocity](api:LinearVelocity) and `AngularVelocity` update only while a part moves. At rest, both keep their last value instead of dropping to zero.

## Example: A cannonball

This server script fires a cannonball forward (-Z) and upward.

```truscript
local ball = new Part() {
    Name = "Cannonball",
    Shape = PartShape.Ball,
    Size = new Vector3(2, 2, 2),
    Position = new Vector3(0, 4, 0),
    Material = PartMaterial.Metal,
    Parent = world
}
ball.LinearVelocity = new Vector3(0, 60, -80)

wait(0.5)
print("Speed now: " + math.round(ball.LinearVelocity.Length()))   # prints: Speed now: 83
```

It prints `Speed now: 83`.

## Example: Conveyors

On an anchored part, [`LinearVelocity`](api:PhysicsInstance.LinearVelocity) does not move the part: it carries anything loose resting on it, and characters standing on it, at that velocity.

This server script builds a belt that carries crates and players toward its front (-Z) at 8 studs per second.

```truscript
local belt = new Part() {
    Name = "Conveyor",
    Size = new Vector3(6, 1, 30),
    Position = new Vector3(0, 0.5, 0),
    Material = PartMaterial.DiamondPlate,
    Anchored = true,
    LinearVelocity = new Vector3(0, 0, -8),
    Parent = world
}

# Drop a crate on it every 3 seconds.
while true:
    new Part() {
        Name = "Crate",
        Size = new Vector3(2, 2, 2),
        Position = new Vector3(0, 4, 12),
        Material = PartMaterial.Wood,
        Parent = world
    }
    wait(3)
```

On an anchored part, [LinearVelocity](api:LinearVelocity) is in the part's own axes: `(0, 0, -8)` always carries things toward the part's front, however the part is turned.

## Movers

[`AlignPosition`](api:AlignPosition), [`AlignOrientation`](api:AlignOrientation), [`LinearVelocity`](api:LinearVelocity) and [`AngularVelocity`](api:AngularVelocity) use as much force as they need, up to a limit, to reach a goal: a place, an angle or a speed. [`VectorForce`](api:VectorForce), [`LineForce`](api:LineForce) and [`Torque`](api:Torque) apply a fixed push. Set `LinearVelocity` for an instant launch, or use a `VectorForce` for a push that lasts.

| You want | Use |
|---|---|
| A part to go to a place and stay there | [`AlignPosition`](api:AlignPosition) |
| A part to travel at a constant speed | [`LinearVelocity`](api:LinearVelocity) |
| Lighter gravity, lift, wind or thrust | [`VectorForce`](api:VectorForce) |

## Mover names

[`LinearVelocity`](api:PhysicsInstance.LinearVelocity) and [`AngularVelocity`](api:PhysicsInstance.AngularVelocity) are also property names on every part, so `part.LinearVelocity` is always the part's velocity property, never a child mover of that name. Keep the mover in a variable, or give it another [`Name`](api:Instance.Name) and find it with [`FindFirstChild`](api:Instance.FindFirstChild).

## Where a mover acts

[`AlignPosition`](api:AlignPosition), [`AlignOrientation`](api:AlignOrientation), [`LinearVelocity`](api:LinearVelocity) and [`AngularVelocity`](api:AngularVelocity) act on their parent. Under a [`Model`](api:Model), a [`Folder`](api:Folder) or an [`Attachment`](api:Attachment) they do nothing. [`VectorForce`](api:VectorForce), [`LineForce`](api:LineForce) and [`Torque`](api:Torque) act on the part that holds their [`Attachment0`](api:VectorForce.Attachment0), as [Constraints](constraints.md#attachments) showed.

On an anchored part, an [`AlignPosition`](api:AlignPosition), [`AlignOrientation`](api:AlignOrientation), [`VectorForce`](api:VectorForce), [`LineForce`](api:LineForce) or [`Torque`](api:Torque) overrides the anchor: while it is active, the part simulates as unanchored, gravity included. Disable or remove the mover and the part freezes where it is. A `LinearVelocity` mover parented to an anchored part does nothing.

## AlignPosition

[`AlignPosition`](api:AlignPosition) pulls its parent part toward a point in the world.

> [!WARNING]
> An `AlignPosition` added without setting [`Position`](api:AlignPosition.Position) drags its part to the world origin. Always set `Position` before, or in the same statement as, parenting.

An `AlignPosition`'s [`MaxForce`](api:AlignPosition.MaxForce) must be comfortably above the weight of everything it carries, passengers included.

## Example: A hovering platform

This server script builds a platform that hovers in place. Jump on it and it dips, then recovers.

```truscript
local platform = new Part() {
    Name = "HoverPlatform",
    Size = new Vector3(8, 1, 8),
    Position = new Vector3(0, 10, 0),
    Parent = world
}
new AlignPosition() {
    Position = new Vector3(0, 10, 0),
    MaxForce = 200000,
    Responsiveness = 40,
    Parent = platform
}
new AlignOrientation() {
    MaxTorque = 200000,
    Responsiveness = 40,
    Parent = platform
}
```

## Moving platforms

To make a platform travel dependably, walk the goal: move the [`AlignPosition`](api:AlignPosition)'s [`Position`](api:AlignPosition.Position) a small step toward the destination every frame.

An `AlignPosition` whose `Position` is set far away in one go closes the gap as fast as [`MaxForce`](api:AlignPosition.MaxForce) allows: a platform asked to move 80 studs is there in under a second, and its riders are thrown off.

## Troubleshooting

| What you see | Fix |
|---|---|
| `part.LinearVelocity.Velocity` is nil or an error. | Keep the mover in a variable, or give it another [`Name`](api:Instance.Name) and find it with [`FindFirstChild`](api:Instance.FindFirstChild). See [Mover names](forces-and-movers.md#mover-names). |
