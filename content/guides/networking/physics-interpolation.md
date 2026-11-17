---
title: Physics interpolation
description: Where a moving object is, and where it is drawn
---

# Physics interpolation

A moving object has two positions at any moment: where it physically is, and where it is drawn. They are usually within a fraction of a stud of each other, and identical for an object at rest.

## The physical pose and the drawn pose

A pose is a position and an orientation together: the content of a [CMatrix](api:CMatrix).

The physical pose is read with `part.CMatrix` (and its shortcuts [Position](api:DynamicInstance.Position), [Rotation](api:DynamicInstance.Rotation) and [Quaternion](api:DynamicInstance.Quaternion)). The drawn pose is read with `part.GetRenderingCMatrix()`. You can set the physical pose. You cannot set the drawn pose: it is computed.

[GetRenderingCMatrix](api:DynamicInstance.GetRenderingCMatrix) returns a value: changing what it returned does not move the object. To move the object, set `CMatrix` or `Position`, not the result of `GetRenderingCMatrix()`.

Logic uses `CMatrix`; visuals that follow something every frame, in a client script, use `GetRenderingCMatrix()`.

## Why the physical pose jumps

While physics moves a part, the pose in its [CMatrix](api:DynamicInstance.CMatrix) advances in physics steps. What is drawn on screen is smoothed between the physics steps that move a part. For an object that this computer is simulating, TruWorlds draws it at a pose blended between its last two physics steps, according to how far the current frame is between them.

Scripts run once per frame, not once per physics step, so several physics steps may pass between two runs of your code; see [Frames and physics steps](frames-and-time.md#frames-and-physics-steps).

On a player's device, most moving objects are [simulated somewhere else](../physics/network-ownership.md): unanchored parts by the server, other players' characters by their own devices, by way of the server.

## Following a moving object

Place something at a moving part's position every frame from [FrameStepped](api:TimeSystem.FrameStepped), in a client script.

A model has [CMatrix](api:Model.CMatrix) and [Position](api:Model.Position), but [GetRenderingCMatrix](api:DynamicInstance.GetRenderingCMatrix) belongs to the parts inside it; calling it on a character is an error. When `GetRenderingCMatrix()` is an error on a model or a character, call it on the model's [PrimaryBody](api:Model.PrimaryBody).

## Example: A chase camera

This client script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, is a fixed-angle chase camera behind an unanchored part named `Kart`.

```truscript
local kart = world.WaitForChild("Kart")
local camera = world.CurrentCamera
local BACK = 16
local UP = 7

if kart != nil and camera != nil:
    camera.CameraMode = CameraMode.Custom

    func place(delta):
        if kart.Parent == nil:
            return
        local pose = kart.GetRenderingCMatrix()
        local eye = pose.Position + pose.Backward * BACK + new Vector3(0, UP, 0)
        local at_eye = new CMatrix(eye)
        camera.CMatrix = at_eye.LookingAt(pose.Position, new Vector3(0, 1, 0))

    game.TimeSystem.FrameStepped.Connect(place)
```

## Server scripts use CMatrix

The server draws nothing, so it has no drawn pose. In a server script use [CMatrix](api:DynamicInstance.CMatrix) and [Position](api:DynamicInstance.Position).

## How you move a thing

Move a platform or door that players stand on or collide with on the server, with a mover or a constraint on an unanchored part.

Animate decoration that nothing collides with (a spinning sign, a bobbing pickup) on each device, with a [tween](../animation/tweens.md) or a `FrameStepped` handler in a client script, and leave the server's copy alone.

Do not move an anchored part in a slow server loop and hope interpolation will hide it.

## Troubleshooting

| What you see | Fix |
|---|---|
| `GetRenderingCMatrix` raises an error that it has no member of that name on a model or a character. | Call it on the model's [PrimaryBody](api:Model.PrimaryBody). See [Following a moving object](#following-a-moving-object). |
| Setting the result of `GetRenderingCMatrix()` has no effect. | Set [CMatrix](api:DynamicInstance.CMatrix) or [Position](api:DynamicInstance.Position) instead. See [The physical pose and the drawn pose](#the-physical-pose-and-the-drawn-pose). |
