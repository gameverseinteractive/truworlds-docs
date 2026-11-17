---
title: Inventory
description: Give, equip and take away tools, and the hotbar that shows them
---

# Inventory

Every player has an [`Inventory`](api:Inventory) inside their [`Player`](api:Player) that holds the tools they own but are not holding. The tool in the character's hand is not in it: see [Where a tool is](creating-tools.md#where-a-tool-is). So "all the tools a player has" means the tools in their `Inventory` plus the one in their hand. The built-in *hotbar* at the bottom of the screen shows the `Inventory`, and the player switches tools with the number keys.

## The server changes the Inventory

Change a player's [`Inventory`](api:Inventory) from server scripts. To add a tool, parent it to the `Inventory` from a server script.

A tool that a client script creates or parents into the `Inventory` exists only on that device: the server does not know it, and it cannot be equipped.

## Giving a tool

For a tool given during play, keep a template in [`game.Storage`](api:Storage) and parent a [`Clone()`](api:Instance.Clone) of it to [`player.Inventory`](api:Player.Inventory).

Adding a tool to the [`Inventory`](api:Inventory) does not put it in the player's hand. To also put an added tool in the hand, call `player.EquipTool(tool)` after parenting it. For what every player starts with, see [Starting tools and values](../players/player-defaults.md#starting-tools-and-values).

## Example: Giving a sword or a shield

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, expects tools named "Sword" and "Shield" inside `game.Storage`. `give_tool` returns the new tool, or `nil` if the player already had one or the template is missing.

```truscript
func give_tool(player, tool_name):
    local template = game.Storage.FindFirstChild(tool_name)
    local inventory = player.Inventory
    if template == nil or inventory == nil:
        return nil
    local character = player.Character
    local in_hand = character != nil and character.FindFirstChild(tool_name) != nil
    if in_hand or inventory.FindFirstChild(tool_name) != nil:
        return nil
    local tool = template.Clone()
    tool.Parent = inventory
    return tool

game.Players.PlayerAdded.Connect(func(player):
    player.CharacterAdded.Connect(func(character):
        give_tool(player, "Sword")
        give_tool(player, "Shield")
    )
)
```

## Pickups

A [`Tool`](api:Tool) left loose in `world` with [`CanPickUp`](api:Tool.CanPickUp) on is a pickup. When a player's character [touches](../physics/touch-and-overlap.md) any part of a pickup tool, the server moves the tool into that player's [`Inventory`](api:Inventory). If the character holds nothing, a picked-up tool is equipped at once; otherwise it waits in the hotbar.

## Equipping

[`EquipTool`](api:Player.EquipTool) makes the player's character hold a tool; passing `nil` puts the held tool away. A character holds at most one tool.

The server refuses to equip a tool that is not in the player's [`Inventory`](api:Inventory) or whose [`Enabled`](api:Tool.Enabled) is `false`, and any tool while the character is dead or seated. It refuses silently, with no error.

From a client script, call `EquipTool` on `game.Players.LocalPlayer`. It asks the server and returns at once; the switch has happened when the character's [`CurrentTool`](api:CharacterController.CurrentTool) changes.

## Taking a tool away

[`Destroy()`](api:Instance.Destroy) removes a tool for good. To take a tool away and keep it, set its [`Parent`](api:Instance.Parent) to [`game.Storage`](api:Storage) instead of destroying it.

## Watching the Inventory

The [`Inventory`](api:Inventory)'s [`ChildAdded`](api:Instance.ChildAdded) fires when a tool arrives: given, picked up, or put away from the hand. Its [`ChildRemoved`](api:Instance.ChildRemoved) fires when a tool leaves: equipped, destroyed, or moved elsewhere. The character's [`Changed`](api:TruWorldsObject.Changed) signal with `"CurrentTool"` tells you the tool in hand changed.

Because equipping moves the tool between the `Inventory` and the character, `ChildAdded` fires for the same tool each time it is put away. Do not treat `ChildAdded` as "the player got a new tool" without checking whether you have seen that tool before.

## What happens on respawn

When a player's character respawns, the new character spawns holding nothing. At every spawn, a starting tool the player no longer has (matched by `Name`) is copied in again, so a tool lost on death comes back: see [Starting tools and values](../players/player-defaults.md#starting-tools-and-values).

A tool given from a script is destroyed at the next respawn unless [`KeepAfterRespawn`](api:Tool.KeepAfterRespawn) is `true`. Either set `KeepAfterRespawn` on a tool you give from a script, or give it from the player's [`CharacterAdded`](api:Player.CharacterAdded) handler so it is given at every spawn.

## When a player leaves

To bring a player's tools back on a later visit, [save their names](../players/saving-data.md) and give them again.

[`player.Inventory`](api:Player.Inventory) is `nil` when there is no [`Inventory`](api:Inventory) to read: on a device before the `Inventory` has arrived there, and on the server once the player has left. `player.Inventory` is already `nil` inside a `game.Players.PlayerRemoved` handler.

> [!WARNING]
> Keep your own list of the player's tool names while they are in the world. Inside [`PlayerRemoved`](api:Players.PlayerRemoved) the Inventory cannot be read and the character no longer holds a tool, so a handler that lists the tools then always saves an empty list.

## The hotbar

The hotbar has 10 slots. To stop players dropping tools with Backspace, set [`CanBeDropped`](api:Tool.CanBeDropped) to `false` on the tools, or turn off the built-in [`DropTool`](input-actions.md#the-built-in-controls) action.

| Key | What it does |
|---|---|
| 1 to 9, then 0 | Hold the tool in hotbar slots 1 to 10. Pressing the key of the tool in hand puts it away. |
| Backspace | Drops the tool in hand, if its [`CanBeDropped`](api:Tool.CanBeDropped) is on. |
| ~ (tilde) | Opens and closes the backpack, which lists tools beyond the tenth. |

## Troubleshooting

| What you see | Fix |
|---|---|
| A tool was given but the player cannot hold it. | To add a tool, parent it to the [`Inventory`](api:Inventory) from a server script. See [The server changes the Inventory](inventory.md#the-server-changes-the-inventory). |
| A "player got a tool" handler runs every time a tool is put away. | Do not treat [`ChildAdded`](api:Instance.ChildAdded) as "the player got a new tool" without checking whether you have seen that tool before. See [Watching the Inventory](inventory.md#watching-the-inventory). |
| The tool vanishes when the player respawns. | Either set [`KeepAfterRespawn`](api:Tool.KeepAfterRespawn) on a tool you give from a script, or give it from the player's [`CharacterAdded`](api:Player.CharacterAdded) handler. See [What happens on respawn](inventory.md#what-happens-on-respawn). |
