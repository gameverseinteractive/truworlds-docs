---
title: Raycasting
description: Ask what lies along a line
---

# Raycasting

A raycast draws a line from a starting point in a direction and reports the first part it hits, where, and how far away.

## Cast a ray

[world.Raycast](api:World.Raycast) finds the nearest hit, or nothing when the ray reaches its end without a hit.

> [!WARNING]
> Always check the result of `world.Raycast` for `nil` before using it: reading `hit.Position` when `hit` is `nil` is an error.

Leaving out the third argument of `world.Raycast`, the [`RaycastParams`](api:RaycastParams), is an error.

| Argument | Meaning |
|---|---|
| `origin` | Where the ray starts, in world coordinates. |
| `raycastParams` | The filters. Pass `new RaycastParams()` when you have nothing to filter. |

## Example: Looking straight down

This server script looks straight down from 50 studs up and reports what is below.

```truscript
local origin = new Vector3(0, 50, 0)
local direction = new Vector3(0, -200, 0)

local hit = world.Raycast(origin, direction, new RaycastParams())

if hit == nil:
    print("Nothing below")
else:
    print("Hit " + hit.Instance.Name + " after " + hit.Distance + " studs")
    # in a new world this prints: Hit Baseplate after 50 studs
```

In a new world it prints `Hit Baseplate after 50 studs`.

## Direction is also the length

The ray ends at `origin + direction`: a direction of `(0, -1, 0)` is a ray one stud long.

<!-- diagram: a ray drawn as an arrow from a point labeled 'origin' to a point labeled 'origin + direction'; a wall crosses the arrow, the crossing is marked 'hit.Position', an arrow sticking straight out of the wall there is labeled 'hit.Normal', and a bracket from origin to the crossing is labeled 'hit.Distance'; a second part beyond the end of the arrow is labeled 'out of reach, not hit' -->

## Reading the result

A [`RaycastResult`](api:RaycastResult) describes what a raycast hit. [world.RaycastAll](api:World.RaycastAll) gives a result for every part the ray passes through, sorted nearest first.

| Value | Meaning |
|---|---|
| [`Instance`](api:RaycastResult.Instance) | The exact part hit, not the root of its [welded group](welds-and-joints.md#welded-groups). |
| [`Position`](api:RaycastResult.Position) | The world position where the ray met the surface. |
| [`Normal`](api:RaycastResult.Normal) | A direction of length 1 pointing straight out of the surface at the hit point. |
| [`Distance`](api:RaycastResult.Distance) | The studs from `origin` to `Position`. |

## Choosing what the ray can hit

Raycasts skip parts with [`CanCollide`](api:PhysicsInstance.CanCollide) set to false unless you ask for them. Rays ignore how a part looks: a part with `Transparency = 1` or `Visible = false` and `CanCollide` on still blocks them, and so does glass.

| Property | What it does |
|---|---|
| [`IgnoreBody`](api:RaycastParams.IgnoreBody) | One part the ray passes straight through. |
| [`IgnoreBodiesArray`](api:RaycastParams.IgnoreBodiesArray) | Several parts the ray passes through. |
| [`IncludeNonCollidable`](api:RaycastParams.IncludeNonCollidable) | When true, the ray can also hit parts with `CanCollide = false`. |

## Ignoring the source

A ray that starts inside a part hits that part immediately, at distance 0. A ray cast from a character's position starts inside the character, so almost every raycast needs to ignore its own source.

> [!WARNING]
> The [`IgnoreBody`](api:RaycastParams.IgnoreBody) and [`IgnoreBodiesArray`](api:RaycastParams.IgnoreBodiesArray) of a [`RaycastParams`](api:RaycastParams) only understand parts. A [`Model`](api:Model), a [`Folder`](api:Folder) or a player's [`Character`](api:Player.Character) put there is silently skipped, and nothing is ignored.

To ignore a whole model or character, pass all of its parts: `params.IgnoreBodiesArray = character.GetDescendants()`.

## Example: Casting from a character

This server function casts from a player's character without hitting the character or anything it holds.

```truscript
func cast_from_character(character, direction):
    local params = new RaycastParams()
    params.IgnoreBodiesArray = character.GetDescendants()
    return world.Raycast(character.BodyCMatrix.Position, direction, params)
```

## Where and when a ray sees a part

Raycasts work in server and client scripts. Each side casts against the parts it has. On a player's device, a raycast is cast only against the parts sent to it; with streaming on, far-away parts may be missing. The server has everything.

> [!WARNING]
> A ray cannot hit a part in the same instant the part is created, such as on the line after the script creates it.

Call `wait()` once after creating parts, then cast.

## Fast projectiles

Very fast objects pass through walls between two physics steps, and a thicker wall does not make fast projectiles safe. Make bullets with raycasts instead of fast parts.

## Troubleshooting

| What you see | Fix |
|---|---|
| The ray always hits the part or character it starts in, at distance 0. | Ignore the ray's own source. See [Ignoring the source](raycasting.md#ignoring-the-source) and [Choosing what the ray can hit](raycasting.md#choosing-what-the-ray-can-hit). |
| `IgnoreBody = character` does nothing. | Pass all of its parts: `params.IgnoreBodiesArray = character.GetDescendants()`. See [Ignoring the source](raycasting.md#ignoring-the-source). |
| The console shows an error when [world.Raycast](api:World.Raycast) is called with only two arguments: `No overload of 'Raycast' matches the supplied 2 argument(s).` | Pass `new RaycastParams()` when you have nothing to filter. See [Cast a ray](raycasting.md#cast-a-ray). |
