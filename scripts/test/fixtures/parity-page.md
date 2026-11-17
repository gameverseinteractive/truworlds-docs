---
title: Raycasting
description: Ask what lies along a line
---

# Raycasting

A ray asks the world what lies along a line. Read [signals](../scripting/signals.md#waiting) first, or go back to [physics](index.md).

## Casting a ray

Call [Raycast](api:World.Raycast) with a start and a direction.

```truscript
local hit = world.Raycast(origin, direction, new RaycastParams())

if hit == nil:
    print("Nothing below")
else:
    print("Hit " + hit.Instance.Name) # the part that was hit
```

<!-- screenshot: the hit marker on a wall -->

> [!TIP]
> Keep rays short; long rays cost more.

### Hit results

| Field | Meaning |
| --- | --- |
| `Position` | Where the ray hit |
| `Normal` | The surface direction |

## Casting a ray

<!-- diagram: a ray drawn as an arrow from the origin -->

Jump back to [hit results](#hit-results).

## Example: A ray from the sky

This server script casts one ray; see the [TruWorlds site](https://create.truworlds.com).

```truscript
local hit = world.Raycast(new Vector3(0, 50, 0), new Vector3(0, -100, 0), new RaycastParams())
```

## After the example

Plain again.
