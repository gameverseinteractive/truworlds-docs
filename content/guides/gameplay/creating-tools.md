---
title: Creating tools
description: Build a tool players hold, and how a held tool behaves
---

# Creating tools

A tool is an item a character holds in its hand and uses, such as a sword or a torch. It is a [`Tool`](api:Tool) instance. A `Tool` is a [`Model`](api:Model): a container for parts with a [`PrimaryBody`](api:Model.PrimaryBody), and everything that holds for models applies to it. A `Tool`'s primary body is the handle, the one part the hand holds. Tools are held in the hand automatically. To attach something to a hand for the player to use, make a `Tool`, not an [`AvatarWeld`](api:AvatarWeld).

## Where a tool is

Where a tool is decides what it is doing.

<!-- diagram: How a tool works: four boxes, PlayerDefaults (template), Inventory (owned, hotbar), Character (held, CurrentTool) and World (loose, pickup), with arrows for being copied in, equipping, putting away, dropping and being touched, and Activated and Deactivated firing at the Character -->

The server decides equipping, putting away, dropping and picking up a tool. A player's device only asks.

| Where the Tool is | What it is doing |
|---|---|
| Inside [`game.PlayerDefaults`](api:PlayerDefaults) | A starting tool: a template that each player gets a copy of. The template itself is never held. |
| Inside a player's [`Inventory`](api:Inventory) ([`player.Inventory`](api:Player.Inventory)) | Owned but not held. The player sees its tile in the [hotbar](inventory.md#the-hotbar). |
| Inside a player's character | Held: it is the character's [`CurrentTool`](api:CharacterController.CurrentTool). The player sees it in the hand, and a blue border around its hotbar tile. |
| Loose in `world` | A pickup: a player's character that touches it takes it. |
| Inside [`game.Storage`](api:Storage) | Put away: nothing happens to it until a script copies or moves it. |

## Building a tool

To make a [`Tool`](api:Tool), search for `tool` in the Insert panel and double-click Tool. An empty `Tool` appears inside World in the Explorer.

Decide which part is the handle, the part the hand closes around. Name it `Handle`. In the Explorer, drag the tool's parts onto the `Tool` so they become its children. Select the `Tool`, then in the Properties panel set `PrimaryBody` to the `Handle` part. A `Tool` never picks a primary body for itself.

Leave [`CanCollide`](api:PhysicsInstance.CanCollide) on for at least the handle of a tool: a tool whose parts have `CanCollide` off falls through the floor when dropped.

## Welding the parts

While a tool is held, every part follows the handle rigidly, welded or not. Welding matters when a tool is free: lying in the world as a pickup, and after a player drops it. Unwelded parts of a tool fall and roll separately, and a drop only throws the handle.

For a tool with several parts, weld every part to the handle. The quickest way is one line in the Console panel's command bar, while the [`Tool`](api:Tool) is inside World. It welds every other part of the `Tool` named Sword in `world` to its handle; replace Sword with your tool's name.

```truscript
world.Sword.MakeJointsToPrimaryBody()
```

A tool's welds are saved with the world and copied with the tool, so each player's copy of a starting tool is welded too. See [`Weld`](../physics/welds-and-joints.md).

## Holding a tool

When a tool is [equipped](inventory.md), it moves out of the [`Inventory`](api:Inventory) and into the character: its [`Parent`](api:Instance.Parent) becomes the [`CharacterController`](api:CharacterController). The character's `CurrentTool` becomes the [`Tool`](api:Tool), and [`Equipped`](api:Tool.Equipped) fires.

With [`RequiresHandle`](api:Tool.RequiresHandle) on, a held tool's parts are out of the physics simulation and drawn in the hand, following the hand bone and the [`Grip`](api:Tool.Grip). While held, a tool's parts do not collide, fall or get pushed.

Putting the tool away reverses equipping: the `Tool` moves back into the `Inventory`, `CurrentTool` becomes `nil` and [`Unequipped`](api:Tool.Unequipped) fires.

## The grip

The grip is how the tool sits in the hand: where the handle is relative to the hand, and which way it points. It is the [`Tool`](api:Tool)'s `Grip` property. The position of `Grip` is the offset of the handle's center from the hand bone, along the hand's own axes, in studs. The rotation of `Grip` is how the handle part is turned compared with the hand bone.

A script can read or set `Grip`, and a change takes effect on a held tool at once. This server script, attached to the `Tool`, prints the grip, then holds the tool 0.5 studs further along the hand's own up axis.

```truscript
local grip = this.Grip
print(grip.Position)
this.Grip = new CMatrix(grip.Position + new Vector3(0, 0.5, 0), grip.Quaternion)
```

## Tools with nothing to hold

Set `RequiresHandle` to `false` for something held with no object in the hand, such as a spell or a build mode. A tool with `RequiresHandle` `false` still shows in the hotbar, equips and fires all four signals ([`Equipped`](api:Tool.Equipped), [`Unequipped`](api:Tool.Unequipped), [`Activated`](scripting-tools.md) and [`Deactivated`](api:Tool.Deactivated)), so the hotbar works as an ability bar.

## Troubleshooting

| What you see | Fix |
|---|---|
| The dropped tool falls apart. | For a tool with several parts, weld every part to the handle. See [Welding the parts](creating-tools.md#welding-the-parts). |
| The tool falls through the floor when dropped. | Leave [`CanCollide`](api:PhysicsInstance.CanCollide) on for at least the handle of a tool. See [Building a tool](creating-tools.md#building-a-tool). |
