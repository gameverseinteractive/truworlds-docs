---
title: Input actions
description: Named inputs bound to keys and buttons, and the built-in controls
---

# Input actions

An input action is a named input a world reacts to, such as "Jump". It is an [`InputAction`](api:InputAction) instance under `game.InputSystem`. A bind is one way of triggering an action: an action's binds say which keys and mouse buttons trigger it. A script can also push an action directly, as an on-screen button does. Use an action when a control should be rebindable, work from more than one key or an on-screen button, or be read as a value from 0 to 1.

## Paths

An action's path is the names of the [`Folder`](api:Folder)s between it and `game.InputSystem`, then its own name, joined by `/`: `Actions/Dash`. An action directly under [`InputSystem`](api:InputSystem) has just its name as its path.

An action works only while it is registered: its name is not empty and has no `/`, everything between it and `InputSystem` is a `Folder`, and its path leads to it (when two siblings share a name, only the first is registered).

## Making an action

`game.InputSystem.RegisterAction(path)` creates an action at `path`, and any missing [`Folder`](api:Folder)s on the way. It is an error if anything is already there.

| Made by | Which devices have it |
|---|---|
| A client script | Only that player's device has an action made by a client script. |
| A server script | Every player's device has an action made by a server script, and each device evaluates its own copy. |
| TruWorlds (the built-in actions, under `CoreActions/`) | Every player's device has the built-in actions. |

## Reading an action

[`Value`](api:InputAction.Value) is how far the action is pushed, from 0 to 1. A held key or button gives 1. [`Pressed`](api:InputAction.Pressed) fires when the action becomes pressed. [`Released`](api:InputAction.Released) fires when the action stops being pressed. [`ValueChanged`](api:InputAction.ValueChanged) fires when `Value` changes.

`game.InputSystem.GetVector2(upPath, downPath, leftPath, rightPath)` gives `X` as right minus left and `Y` as up minus down, each from -1 to 1.

## Example: Reading the movement direction

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, reads the player's movement input as a direction, from the keys or the on-screen thumbstick.

```truscript
local input = game.InputSystem

game.TimeSystem.FrameStepped.Connect(func(delta):
    local move = input.GetVector2("CoreActions/MoveForward", "CoreActions/MoveBackward",
        "CoreActions/MoveLeft", "CoreActions/MoveRight")
    if move.X != 0 or move.Y != 0:
        print("right " + tostring(move.X) + ", forward " + tostring(move.Y))
)
# Expected output each frame while the player holds only the W position:
# right 0, forward 1
```

It prints `right 0, forward 1` each frame while the player holds only the W position.

## Pushing an action from a script

`SetEmulatedValue(value)` pushes the action from a script. The value holds until set again; 0 lets go.

## Switching an action off

[`Enabled`](api:InputAction.Enabled) is whether the action responds. A disabled action reads 0 and is never pressed, whatever its binds or emulated value.

## Actions live on the device

Actions are evaluated on each player's device. On the server an action always reads 0 and never fires [`Pressed`](api:InputAction.Pressed), [`Released`](api:InputAction.Released) or [`ValueChanged`](api:InputAction.ValueChanged). Listen to actions in client scripts, and tell the server what the player did with a [`RemoteEvent`](../networking/remote-communication.md).

## The built-in controls

TruWorlds registers the controls every world has as actions on each player's device, in the folder `CoreActions` under [`InputSystem`](api:InputSystem). The built-in actions are the four `Move` actions, `Jump`, `Sprint`, `ActivateTool`, `DropTool`, the camera and zoom actions, `LiftUp` and `LiftDown` for vehicles, `OpenChat` and `Interact`, at paths such as `CoreActions/Jump`. Reach a built-in action with `game.InputSystem.GetAction("CoreActions/Jump")`.

Disabling `Jump` stops jumping, disabling the four `Move` actions stops walking, and disabling `ActivateTool` stops the left mouse button using tools.

To give a built-in control a different key, change its binds: [`ClearBinds()`](api:InputAction.ClearBinds) removes its keys, and `AddKeyBind(key)` or `AddMouseBind(button)` adds new ones.

An [`InputAction`](api:InputAction)'s [`Enabled`](api:InputAction.Enabled) is per device. It is not saved and not sent to the server. A new player starts with every built-in control enabled. Apply your changes to the built-in controls from a client script each time a player joins.

> [!WARNING]
> Switching controls off in a client script is a convenience, not a rule the player cannot break. For anything that matters, also enforce it on the server, for example by setting the character's [`MoveSpeed`](api:CharacterController.MoveSpeed) to 0.

To enforce it on the server, see [Trusting the client](../networking/trusting-the-client.md).

## Example: Turning a built-in control off

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, gives you `set_control`: `set_control("Jump", false)` stops the player jumping, and `set_control("Jump", true)` allows it again.

```truscript
func set_control(action_name, enabled):
    for item in game.InputSystem.GetDescendants():
        if item.IsA("InputAction") and item.Name == action_name:
            item.Enabled = enabled
            return true
    return false

set_control("Jump", false)
set_control("DropTool", false)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| Disabling a control had no effect on other players. | Apply your changes to the built-in controls from a client script each time a player joins. See [The built-in controls](input-actions.md#the-built-in-controls). |
