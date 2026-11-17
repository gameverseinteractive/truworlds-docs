---
title: Physics
description: How parts move, collide, join and push each other while a world runs
---

# Physics

TruWorlds uses a rigid-body physics system that works over the network. Physics runs only while a world is played: in a playtest in TruWorlds Creator, or live with players. While you edit, nothing falls, collides, touches, swings or explodes. When [`Anchored`](api:PhysicsInstance.Anchored) is true, gravity and collisions do not move the part. When [`CanCollide`](api:PhysicsInstance.CanCollide) is false, characters and other parts pass straight through the part (see [Anchoring and collisions](../building/anchoring-and-collisions.md)).

## Touches, regions and raycasts

- The [`Touched`](touch-and-overlap.md) signal reacts when parts touch.
- A region query finds the parts in a volume.
- A [raycast](raycasting.md) asks what lies along a line.

## Joints, constraints and movers

- [Joints](welds-and-joints.md) tell physics that parts belong together.
- [Constraints](constraints.md) leave parts free to move in one particular way.
- [Movers](forces-and-movers.md) push parts.

## Seats, explosions and ownership

- Characters sit on a [`Seat`](seats-and-vehicles.md), and a [VehicleSeat](api:VehicleSeat) turns the rider's keys into driving.
- An [`Explosion`](explosions.md) is a one-off blast.
- Each loose part has a [network owner](network-ownership.md), the one machine that runs its physics.
