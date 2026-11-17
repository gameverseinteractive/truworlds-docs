---
title: Client-server boundary
description: How a running world is split between the server and players' devices
---

# Client-server boundary

The server is the computer that runs the real copy of a world and its server scripts. A device is a player's computer, phone or tablet running the TruWorlds App. It shows the world to one player and runs client scripts. Client is another name for it. The line between the server and the clients is the client-server boundary. A side is either the server or a device, and a script runs on exactly one side.

You do not set up the client-server boundary: every world runs this way, even with a single player and in a playtest in TruWorlds Creator.

## The server's world is the real one

The world on the server is the real one. What a device shows is a copy.

Changes made on a device stay on that device. A client script that sets `door.Transparency = 0.5` changes only that player's copy; the server does not know, and no other player sees it.

A device asks and the server decides: to change the real world, a client script sends a request with a [RemoteEvent](api:RemoteEvent), and a server script checks it and makes the change itself.

## Example: A lamp painted on each side

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, makes every player see the lamp turn red three seconds after the server starts. It needs a part named `Lamp` directly in [world](api:global/world).

```truscript
wait(3)
local lamp = world.FindFirstChild("Lamp")
if lamp != nil:
    lamp.Color = new Color3(1, 0, 0)
    print("The server painted the lamp red")
# Output in the server's console:
# The server painted the lamp red
```

It prints `The server painted the lamp red` in the server's console.

This client script, attached to a `Folder` in `game.ScriptSystem`, makes only this player see the lamp turn blue when they press E. It needs a part named `Lamp` directly in `world`.

```truscript
local lamp = world.WaitForChild("Lamp")

func on_key(key):
    if key == KeyName.E and lamp != nil:
        lamp.Color = new Color3(0, 0, 1)
        print("Painted my own copy of the lamp blue")

game.InputSystem.KeyPressed.Connect(on_key)
# Output in the console of the player who pressed E, and nowhere else:
# Painted my own copy of the lamp blue
```

It prints `Painted my own copy of the lamp blue` in the console of the player who pressed E, and nowhere else.

## Which side code belongs on

| Code | Side | Why |
|---|---|---|
| Game rules (who scored, who won, when a round ends) | Server | There must be one answer, and players must not be able to change it. |
| Giving, taking or checking coins, items, health and scores | Server | The server is where the player cannot reach. |
| Creating, destroying or moving things every player should see | Server | Only server changes are sent to everyone. |
| Reading keys, mouse buttons and touches | Client | Only the device has them. |

## One feature, both sides

Almost every feature follows five steps. For a button that buys a speed boost for 10 coins: the player clicks, which only the device knows; the client script [sends a request](remote-communication.md) to the server; the server script checks it against the real world (does this player have 10 coins?); the server script takes the coins and raises the character's speed; and replication carries the changes to every device, with no more code.

## The same code on each side

`game.Players.LocalPlayer` is `nil` on the server, and this device's player on a device. In a server script, use the Player that the signal or remote event hands you, not [LocalPlayer](api:Players.LocalPlayer); see [The local player](../players/players-and-characters.md#the-local-player).

Input signals such as [InputSystem.KeyPressed](api:InputSystem.KeyPressed) and [UIButton.Pressed](api:UIButton.Pressed) never fire on the server, and fire for this player on a device. A key press or button click handler connected in a server script never runs.

## Characters are moved by their own device

Each device moves its own player's character itself, so that movement responds the instant a key is pressed. It reports the character's position to the server many times per second, and the server passes it on to the other devices. This is the one deliberate exception to the device only showing a copy.

A character's [Position](api:DynamicInstance.Position) read in a server script is the position its device most recently reported, slightly behind what that player sees. See [where the character is](trusting-the-client.md#where-the-character-is).

## Testing both sides

A playtest in TruWorlds Creator runs both sides of the client-server boundary on your computer. Test with at least two players before you publish.

## Troubleshooting

| What you see | Fix |
|---|---|
| Only one player sees a change. | Make the change in a server script. See [The server's world is the real one](#the-servers-world-is-the-real-one) and [Which side code belongs on](#which-side-code-belongs-on). |
| `game.Players.LocalPlayer` is `nil`. | In a server script, use the Player that the signal or remote event hands you, not [LocalPlayer](api:Players.LocalPlayer). See [The local player](../players/players-and-characters.md#the-local-player) and [The same code on each side](#the-same-code-on-each-side). |
| A key press or button click handler never runs. | Read keys, mouse buttons and touches in a client script. See [The same code on each side](#the-same-code-on-each-side) and [Which side code belongs on](#which-side-code-belongs-on). |
