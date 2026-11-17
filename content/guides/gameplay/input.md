---
title: Input
description: Read the keyboard and mouse in client scripts
---

# Input

[`InputSystem`](api:InputSystem) (`game.InputSystem`) tells a script what the player is doing with the keyboard and mouse. Input exists only on a player's device. Use `game.InputSystem` in client scripts. How input signals behave on each side is in [The same code on each side](../networking/client-server-model.md#the-same-code-on-each-side).

## Signals and checks

Signals ([`KeyPressed`](api:InputSystem.KeyPressed), [`MouseButtonPressed`](api:InputSystem.MouseButtonPressed) and the others) run your function when something happens. Checks ([`IsKeyPressed`](api:InputSystem.IsKeyPressed), [`IsMouseButtonPressed`](api:InputSystem.IsMouseButtonPressed)) ask whether something is held now.

## Keys

`KeyPressed` fires once when a key goes down: holding the key does not repeat it. [`KeyReleased`](api:InputSystem.KeyReleased) fires when a held key comes up. For "while held", use the held-key checks, or start on `KeyPressed` and stop on `KeyReleased`.

Only keys in [`KeyName`](api:KeyName) are reported: function keys, the number pad, Caps Lock and some others are not. `KeyName` has no "Shift+F" value. For a combination, check the modifier inside the handler. Only the focused session hears input: in a playtest with several players, keys go to the tab you are looking at.

> [!WARNING]
> Many keys already do something: `Escape` opens the game menu (`KeyPressed` still fires for it), the digits pick [hotbar](inventory.md#the-hotbar) slots and `Tilde` opens the backpack. Pick free keys, or switch the built-in control off.

To switch a built-in control off, see [The built-in controls](input-actions.md#the-built-in-controls).

## Example: Reacting to the F key

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, prints a line each time the player presses F.

```truscript
game.InputSystem.KeyPressed.Connect(func(key):
    if key == KeyName.F:
        print("F was pressed")
)
# Expected output each time the player presses F:
# F was pressed
```

It prints `F was pressed` each time.

## Labels and positions

`KeyPressed`, `KeyReleased` and `IsKeyPressed` use the label: the letter printed on the key in the player's layout. Use them for keys that stand for a word: **M** for map, **I** for inventory.

[`PhysicalKeyPressed`](api:InputSystem.PhysicalKeyPressed), [`PhysicalKeyReleased`](api:InputSystem.PhysicalKeyReleased) and [`IsPhysicalKeyPressed`](api:InputSystem.IsPhysicalKeyPressed) use the position: `KeyName.W` means the key where W is on a US keyboard, whatever is printed on it. Use the Physical members for keys chosen for where they are, above all a movement cluster.

## Example: WASD on any keyboard layout

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, reads a movement direction from the WASD positions on any keyboard layout.

```truscript
local input = game.InputSystem

func move_direction():
    local x = 0
    local z = 0
    if input.IsPhysicalKeyPressed(KeyName.D): x = x + 1
    if input.IsPhysicalKeyPressed(KeyName.A): x = x - 1
    if input.IsPhysicalKeyPressed(KeyName.W): z = z - 1
    if input.IsPhysicalKeyPressed(KeyName.S): z = z + 1
    return new Vector3(x, 0, z)

game.TimeSystem.FrameStepped.Connect(func(delta):
    local direction = move_direction()
    if direction.Length() > 0:
        print(direction.Normalized())
)
```

## The mouse

`game.InputSystem.Mouse` is a [`Mouse`](api:Mouse): it tells you where the pointer is and controls how it behaves. [`Mouse.IsOverUi`](api:Mouse.IsOverUi) is `true` while the pointer is over on-screen UI that blocks it, built-in or your own.

## What is under the pointer

To find what the player points at, turn the pointer position into a ray with the camera and cast it: see [From the screen into the world](camera.md#from-the-screen-into-the-world). For what is under the pointer, start from `game.InputSystem.Mouse.Position`.

## Telling the server what a player did

When the server needs to know what a player did, the client script tells it with a [`RemoteEvent`](../networking/remote-communication.md). A client script reads the key; the server decides what it means.

## Example: Waving with the G key

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, waits for the `Wave` object in `world` and fires it each time the player presses G.

```truscript
local wave = world.WaitForChild("Wave")

game.InputSystem.KeyPressed.Connect(func(key):
    if key == KeyName.G:
        wave.Fire()
)
```

Players press G to wave. This server script, attached to a `Folder` in `game.ScriptSystem`, announces it, at most once every 3 seconds per player.

```truscript
local wave = new RemoteEvent() {
    Name = "Wave",
    Parent = world
}
local last_wave = {}

wave.Connect(func(player):
    local now = host.time()
    if last_wave[player] != nil and now - last_wave[player] < 3:
        return
    last_wave[player] = now
    game.ChatSystem.SendSystemMessage(player.Name + " waves")
)

game.Players.PlayerRemoved.Connect(func(player):
    table.remove(last_wave, player)
)
```

The server script checks how often the request comes, because [a changed device](../networking/trusting-the-client.md) can fire the event without any key pressed.

## Troubleshooting

| What you see | Fix |
|---|---|
| [`KeyPressed`](api:InputSystem.KeyPressed) never fires. | Use `game.InputSystem` in client scripts. See [Input](input.md). |
| A held key only acts once. | For "while held", use the held-key checks, or start on [`KeyPressed`](api:InputSystem.KeyPressed) and stop on [`KeyReleased`](api:InputSystem.KeyReleased). See [Keys](input.md#keys). |
| WASD controls are wrong on some players' keyboards. | Use the Physical members for keys chosen for where they are. See [Labels and positions](input.md#labels-and-positions). |
