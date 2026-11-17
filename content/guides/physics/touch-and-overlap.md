---
title: Touch and overlap
description: React when parts touch, and find the parts in a region
---

# Touch and overlap

[`Touched`](api:PhysicsInstance.Touched), a signal on every part, fires when another part starts touching the part, and passes that other part to your function. A region query finds every part in a volume, right now.

## Touched

The function connected to [`Touched`](api:PhysicsInstance.Touched) receives the other part, not a player and not a model. Pass the character, not the body part it touched, to [`GetPlayerFromCharacter`](api:Players.GetPlayerFromCharacter): `GetPlayerFromCharacter(other.Parent)`. `Touched` fires once when contact starts, not continuously.

## Example: A lava floor

This server script, attached to a part such as a lava floor, kills any player's character that touches it.

```truscript
func on_touch(other):
    local player = game.Players.GetPlayerFromCharacter(other.Parent)
    if player != nil:
        player.Character.Kill()

this.Touched.Connect(on_touch)
```

## Cooldown (debounce)

A character can leave and re-enter quickly, firing [`Touched`](api:PhysicsInstance.Touched) again, and a model of several loose parts fires it once per part. A cooldown ignores repeats for a while.

When the handler runs several times for one player, add a cooldown.

## Example: A healing pad

This server script, attached to a healing pad, heals a character by 25, at most once every 3 seconds per player.

```truscript
local COOLDOWN = 3
local next_allowed = {}

func on_touch(other):
    local player = game.Players.GetPlayerFromCharacter(other.Parent)
    if player == nil:
        return
    local now = host.time()
    if table.has(next_allowed, player.UserId) and now < next_allowed[player.UserId]:
        return
    next_allowed[player.UserId] = now + COOLDOWN
    player.Character.Damage(-25)        # a negative amount heals
    print(player.Name + " healed")

this.Touched.Connect(on_touch)
```

## When touching stops

[`TouchEnded`](api:PhysicsInstance.TouchEnded) fires when another part stops touching the part, and passes that part. It fires a little late, on purpose, so parts settling against each other do not fire it every time contact flickers.

## Server and client scripts

In a server script, [`Touched`](api:PhysicsInstance.Touched) fires for everyone and your handler can change the game. In a client script, `Touched` fires on that player's device only. A server script is where game rules belong.

## Trigger zones

A trigger zone is an invisible, non-solid part that only exists to notice things entering it. It is a part with `Anchored = true`, `CanCollide = false` and `Transparency = 1`. [`Touched`](api:PhysicsInstance.Touched) and [`TouchEnded`](api:PhysicsInstance.TouchEnded) fire for parts with [`CanCollide`](api:PhysicsInstance.CanCollide) set to false too.

There are no collision groups: a part is solid to everything or to nothing.

## What is touching now

[`GetTouching()`](api:PhysicsInstance.GetTouching) lists the parts touching the part at this moment.

> [!WARNING]
> A part tracks what touches it only while a function is connected to its [`Touched`](api:PhysicsInstance.Touched) or [`TouchEnded`](api:PhysicsInstance.TouchEnded); without one, `GetTouching()` is always empty. Connect a function first, even an empty one.

## Example: Listing what stands on a platform

This server script, attached to an anchored part such as a lift platform, prints what is standing on it every 2 seconds.

```truscript
func ignore(other):
    pass

this.Touched.Connect(ignore)            # needed: touches are only tracked while something listens

while true:
    wait(2)
    local touching = this.GetTouching()
    print(touching.length + " thing(s) on the platform")
    for part in touching:
        print("  " + part.Name)
```

## Region queries

An [`OverlapParams`](api:OverlapParams) holds the filters for a region query. Pass `new OverlapParams()` to a region query when you have nothing to filter.

| Call | Finds |
|---|---|
| `world.GetPhysicsInstancesInBox(bounds, overlapParams)` | The parts overlapping a box. |
| `world.GetPhysicsInstancesInRadius(center, radius, overlapParams)` | The parts overlapping a sphere. `radius` is in studs. |

## Example: Parts near a point

This server script lists every solid part within 15 studs of a point.

```truscript
local nearby = world.GetPhysicsInstancesInRadius(new Vector3(0, 3, 0), 15, new OverlapParams())
print("Found " + nearby.length + " part(s)")
for part in nearby:
    print("  " + part.Name)
```

## What a region query finds

Both region queries test each part's axis-aligned bounding box, not its exact shape. They skip parts with [`CanCollide`](api:PhysicsInstance.CanCollide) set to false unless you ask for them: set `IncludeNonCollidable = true` to include them.

> [!WARNING]
> A region query does not find a part in the same instant it is created. Call `wait()` once between creating parts and querying for them.

## Leaving parts out

[`IgnoreBody`](api:OverlapParams.IgnoreBody) is one part to leave out of the results. [`IgnoreBodiesArray`](api:OverlapParams.IgnoreBodiesArray) is several parts to leave out.

> [!WARNING]
> `IgnoreBody` and `IgnoreBodiesArray` only understand parts: a [`Model`](api:Model), a [`Folder`](api:Folder) or a player's [`Character`](api:Player.Character) put there is silently skipped. To ignore a whole model or character, pass all of its parts: `params.IgnoreBodiesArray = model.GetDescendants()`.

## Troubleshooting

| What you see | Fix |
|---|---|
| The handler runs several times for one player. | Add a cooldown. See [Cooldown (debounce)](touch-and-overlap.md#cooldown-debounce). |
| [`Touched`](api:PhysicsInstance.Touched) fires and things change on your own screen, but not for other players. | Put game rules in a server script. See [Server and client scripts](touch-and-overlap.md#server-and-client-scripts) and [Replication](../networking/replication.md). |
| A region query does not return your trigger zone. | Set `IncludeNonCollidable = true`. See [What a region query finds](touch-and-overlap.md#what-a-region-query-finds). |
