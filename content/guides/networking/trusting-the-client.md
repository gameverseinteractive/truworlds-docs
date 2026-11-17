---
title: Trusting the client
description: Check everything a player's device sends to the server
---

# Trusting the client

A determined player can change anything on their own device: properties, UI, the camera, the position of their own character. The server becomes unsafe only through the doors you open: the handlers you connect to [RemoteEvent](api:RemoteEvent) objects and bind to [RemoteFunction](api:RemoteFunction) objects, and the reported state you choose to believe.

## Ask, never tell

> [!WARNING]
> The server decides; a device may only ask. Check every request as if a stranger had written the client script.

Design every message as a request to do something, never as a statement of what happened.

Unsafe, the device states a result: `add_coins.Fire(100)`. Safe, the device states an intent: `collect_coin.Fire(coin)`, and the server checks the coin exists, is close, and has not been collected.

Unsafe, the device states a result: `buy.Fire("sword", 0)` (item and price). Safe, the device states an intent: `buy.Fire("sword")`, and the server looks the price up itself.

## Checking arguments

Every argument after `player` was chosen by the player's device and must be checked.

An argument can be missing (`nil`), of the wrong type, out of range, absurdly large, or a valid value this player has no right to use.

Check a handler's arguments in this order, stopping at the first failure: type; range and shape (a sensible number, a short enough string, a known name); existence right now; permission for this player; state at this moment (alive, in range, off cooldown, round running). Only then change the world.

Range matters: a check such as `amount <= coins.Value` passes for `amount = -1000000`, and subtracting a negative amount adds coins.

Check that an instance argument is not `nil`, is of the class you expect ([IsA](api:TruWorldsObject.IsA)), is where you expect ([IsDescendantOf](api:Instance.IsDescendantOf) or [Parent](api:Instance.Parent)), belongs to this player if ownership matters, and is close enough to the character if reach matters.

## Example: Collecting a coin safely

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, collects a coin that a device asks for only after checking it, and adds one to the player's `Coins`. Coins are [Part](api:Part) instances inside a `Folder` named `Coins` in `world`. Each player has `Stats/Coins`.

```truscript
local collect = new RemoteEvent() {
    Name = "CollectCoin",
    Parent = world
}

local coins_folder = world.WaitForChild("Coins")
local REACH = 10

func on_collect(player, coin):
    if coin == nil:
        return
    if coin.Parent != coins_folder:
        return                                   # not one of our coins (or already collected)
    if not coin.IsA("Part"):
        return
    local character = player.Character
    if character == nil or character.Health <= 0:
        return
    if (character.Position - coin.Position).Length() > REACH:
        return                                   # too far away
    local stats = player.FindFirstChild("Stats")
    if stats == nil:
        return
    local wallet = stats.FindFirstChild("Coins")
    if wallet == nil:
        return
    coin.Destroy()                               # destroy first, so a second request finds no coin
    wallet.Value = wallet.Value + 1

collect.Connect(on_collect)
```

## Limiting requests

The limit belongs on the server; a cooldown in a client script only makes the game feel right for honest players.

A cooldown is the simplest limit: at most one accepted request every so many seconds.

Record when a player's cooldown ends (`ready_at` in the cooldown handler) before anything that waits.

## Example: An ability cooldown

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, accepts a player's `UseAbility` request at most once every 3 seconds, and forgets the player when they leave.

```truscript
local use_ability = new RemoteEvent() {
    Name = "UseAbility",
    Parent = world
}

local COOLDOWN = 3
local ready_at = {}

func on_use(player):
    local now = host.time()
    local ready = ready_at[player.UserId]
    if ready != nil and now < ready:
        return                               # still cooling down: ignore
    ready_at[player.UserId] = now + COOLDOWN
    print(player.Name + " used the ability")

func on_leave(player):
    table.remove(ready_at, player.UserId)

use_ability.Connect(on_use)
game.Players.PlayerRemoved.Connect(on_leave)
```

## Where the character is

A modified device can report a dishonest position for [its character](client-server-model.md#characters-are-moved-by-their-own-device): faster than it can run, through a wall, or high in the air. A server script must not assume a character's position is honest.

For anything valuable (a finish line that pays out, a secured area), add a sanity check on the server: has the character moved further than is possible since the last look?

## Keeping secrets

| Where | Who can read it | Use it for |
|---|---|---|
| A variable or table in a server script | Players cannot | Real secrets: keys for web services, answers, the next random outcome, anti-cheat state. |
| Saved data ([DataSystem](api:DataSystem)) | Players cannot | Anything persistent. A device only learns what your scripts choose to send. |
| All of [game.Storage](api:Storage) | Players can, from the moment they join | Templates that are not secret. |
| Values under a [Player](api:Player) | Every player can read every player's | Public per-player state: scores, level, team. |
