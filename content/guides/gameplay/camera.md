---
title: Camera
description: How the player's camera works, and how to script it
---

# Camera

A [`Camera`](api:Camera) is the view the player sees the world through. Every player's device has its own camera. [`world.CurrentCamera`](api:World.CurrentCamera) is the camera the device is looking through, and it is available as soon as a client script starts.

## Client scripts own the camera

Read `world.CurrentCamera` in client scripts. Put camera scripts on a [`Folder`](api:Folder) in `game.ScriptSystem`. Changing the camera in a client script affects that player only; nothing is sent to the server or to other players. To move everyone's camera, tell each device with a [`RemoteEvent`](../networking/remote-communication.md).

The server has no player's camera. Do not use `world.CurrentCamera` in server scripts: it is never what a player sees, and nothing done to it reaches a player's screen.

## Camera modes

A camera's [`CameraMode`](api:Camera.CameraMode) chooses who moves the camera. A player's camera starts in `OrbitTarget` mode, following that player's own character. Compare the camera's mode with the name, not the number: `if camera.CameraMode == CameraMode.OrbitTarget:`.

| CameraMode | Who moves the camera |
|---|---|
| `OrbitTarget` | The player moves the camera around a target. It is the default for players, for normal third-person and first-person play. |
| `Follow` | TruWorlds keeps the camera behind a target as it turns, typically for driving and flying. |
| `Custom` | Your script moves the camera and TruWorlds does not, typically for cutscenes, top-down and side-on games, and fixed cameras. |

## Adjusting the built-in camera

Adjusting the built-in camera (its follow distances, [`CameraOffset`](api:Camera.CameraOffset), [`OrbitFirstPersonAllowed`](api:Camera.OrbitFirstPersonAllowed), [`Fov`](api:Camera.Fov) or [`FollowTarget`](api:Camera.FollowTarget)) changes how it feels and keeps the player in control. While `FollowTarget` is `nil`, the camera orbits the local player's own character. The camera moves in front of anything that would block the view of the target, but never closer than [`MinFollowDistance`](api:Camera.MinFollowDistance).

A player's own camera takes `MinFollowDistance`, [`MaxFollowDistance`](api:Camera.MaxFollowDistance) and `CameraOffset` from `game.PlayerDefaults`, not from a new [`Camera`](api:Camera)'s defaults. See [`PlayerDefaults`](../players/player-defaults.md#camera-and-ctrl-lock).

## Example: An over-the-shoulder camera

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, gives an over-the-shoulder view: closer, raised and shifted, with no first person.

```truscript
local camera = world.CurrentCamera

camera.OrbitFirstPersonAllowed = false
camera.MinFollowDistance = 6
camera.MaxFollowDistance = 14
camera.FollowDistance = 9
camera.CameraOffset = new Vector3(0, 1.5, 0)
```

## Example: A camera that follows a vehicle

`FollowTarget` must be something with a position, such as a part or a character's [`PrimaryBody`](api:Model.PrimaryBody).

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, expects a [`Model`](api:Model) named "Car" in `world` with a part named "Body". It chases the car from 24 studs behind.

```truscript
local camera = world.CurrentCamera
local car = world.WaitForChild("Car")

camera.FollowTarget = car.WaitForChild("Body")
camera.CameraMode = CameraMode.Follow
camera.FollowDistance = 24
```

## Scripting the camera

To script the camera, set `camera.CameraMode = CameraMode.Custom`. In `Custom` mode your script owns the camera: nothing moves it unless your script does. Then set `camera.CMatrix` whenever the view should change, usually in a [`TimeSystem.FrameStepped`](api:TimeSystem.FrameStepped) handler.

> [!WARNING]
> In `OrbitTarget` and `Follow` modes TruWorlds sets the camera's [`CMatrix`](api:CMatrix) every frame, overwriting what your script writes. Only in `Custom` mode does a script's `CMatrix` stay.

To aim a `Custom` camera, build a `CMatrix` at the camera's position, then turn it to face a point with [`LookingAt`](../engine/cmatrix.md).

When you are done with a `Custom` camera, set `camera.CameraMode` back to `CameraMode.OrbitTarget` and `FollowTarget` to `nil`.

## Example: A five-second overhead shot

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, looks down at the middle of the world from above and behind for 5 seconds, then gives the camera back.

```truscript
local camera = world.CurrentCamera

camera.CameraMode = CameraMode.Custom
camera.CMatrix = new CMatrix(new Vector3(0, 60, 60)).LookingAt(new Vector3(0, 0, 0), Vector3.Up)
wait(5)
camera.CameraMode = CameraMode.OrbitTarget
camera.FollowTarget = nil
```

## From the screen into the world

The camera can turn a screen position into points in the world. Call [`ProjectScreenPoint`](api:Camera.ProjectScreenPoint) twice, at distance 0 and at a large distance, to get a ray you can [cast](../physics/raycasting.md).

## Troubleshooting

| What you see | Fix |
|---|---|
| A camera change in a server script does nothing for players. | Use `world.CurrentCamera` in client scripts, not server scripts. See [The camera](camera.md) and [Client scripts own the camera](camera.md#client-scripts-own-the-camera). |
| A camera change is not seen by other players. | To move everyone's camera, tell each device with a [`RemoteEvent`](api:RemoteEvent). See [Client scripts own the camera](camera.md#client-scripts-own-the-camera). |
| Setting the camera's [`CMatrix`](api:CMatrix) does nothing. | Set `camera.CameraMode = CameraMode.Custom`. See [Scripting the camera](camera.md#scripting-the-camera). |
| The camera stays frozen after a cutscene. | Set `camera.CameraMode` back to `CameraMode.OrbitTarget` and [`FollowTarget`](api:Camera.FollowTarget) to `nil`. See [Scripting the camera](camera.md#scripting-the-camera). |
