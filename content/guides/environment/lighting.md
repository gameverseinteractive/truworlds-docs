---
title: Lighting
description: "Light a whole world: the sun, ambient light, shadows and a day cycle"
---

# Lighting

[`Lighting`](api:Lighting) controls the light that reaches the whole world at once: the sun, the ambient light that fills in shadows, and the color behind everything. Every world has exactly one `Lighting` system. A script reaches it as `game.Lighting`; in TruWorlds Creator it is the `Lighting` entry in the Explorer.

## Lighting's properties

[`Lighting`](api:Lighting)'s properties are saved with the world.

| Property | What it does |
|---|---|
| [`SunColor`](api:Lighting.SunColor) | The color of sunlight. |
| [`SunBrightness`](api:Lighting.SunBrightness) | How strong sunlight is. `0` turns the sun off. |
| [`SunAngle`](api:Lighting.SunAngle) | The compass direction sunlight travels in. It does not change how high the sun is. |
| [`SunCastShadow`](api:Lighting.SunCastShadow) | Whether the sun casts shadows. |
| [`AmbientLightColor`](api:Lighting.AmbientLightColor) | Light added to every surface equally, including surfaces in shadow. |
| [`BackgroundColor`](api:Lighting.BackgroundColor) | The color shown behind everything when there is no sky to draw. |

## The sun

[`SunAngle`](api:Lighting.SunAngle) is a compass direction in degrees. At a `SunAngle` of `0`, sunlight travels toward -Z, which is [forward](../engine/coordinates-and-units.md), so shadows fall forward.

> [!WARNING]
> The sun always sits 50 degrees above the horizon, and no property changes its height. `SunAngle` swings shadows around the compass, but it cannot make the sun rise or set.

To show morning, noon, evening and night, change the color and strength of the light instead of its height.

## Example: Night from the start

This server script, attached to any instance in the world, turns the world to night as soon as the game starts.

```truscript
local lighting = game.Lighting

lighting.SunColor = new Color3(0.45, 0.5, 0.75)             # cool blue "moonlight"
lighting.SunBrightness = 0.3
lighting.AmbientLightColor = new Color3(0.12, 0.14, 0.22)   # dark blue shadows
```

## Sun shadows

With [`SunCastShadow`](api:Lighting.SunCastShadow) on, parts block sunlight and cast shadows on each other. A part with [`CastShadow`](api:Part.CastShadow) off is still lit by the sun; see [Parts](../building/parts.md).

## Ambient light

Ambient light reaches everywhere. A closed room with no windows is still lit by it.

To make a room really dark, the ambient light must be dark for the whole world, and other places need lights.

## The background color

[`BackgroundColor`](api:Lighting.BackgroundColor) only shows when no sky is being drawn.

A new world has a [`ColorSky`](api:ColorSky), which covers the background completely, so changing `BackgroundColor` in a new world appears to do nothing.

Remove the sky to see `BackgroundColor`. When a sky covers `BackgroundColor`, you can change the [sky](sky-and-fog.md)'s colors instead of removing the sky inside [`Lighting`](api:Lighting).

## Who sees a change

A [`Lighting`](api:Lighting) change made in a server script is seen by every player, including players who join later.

A `Lighting` change made in a [client script](../networking/replication.md) is seen only by the player whose device ran the script, not by other players or the server.

## Example: A day and night cycle

Because the sun's height is fixed, a day and night cycle changes four things together: [`SunColor`](api:Lighting.SunColor), [`SunBrightness`](api:Lighting.SunBrightness), [`AmbientLightColor`](api:Lighting.AmbientLightColor), and the colors of the [`ColorSky`](api:ColorSky) inside [`Lighting`](api:Lighting).

Run the day and night cycle on the server so every player sees the same time.

To let other scripts read the time of day, store it in a [value object](../engine/value-objects.md) that the script running the cycle updates.

This server script, attached to any instance in the world, is a cut-down clock that other scripts can read.

```truscript
local DAY_LENGTH = 240

local clock = new NumberValue() {
    Name = "TimeOfDay",
    Value = 0.36,
    Parent = world
}

local elapsed = DAY_LENGTH * 0.36
while true:
    elapsed += wait(0.5)
    clock.Value = (elapsed % DAY_LENGTH) / DAY_LENGTH
```

## Troubleshooting

| What you see | Fix |
|---|---|
| You changed [`SunAngle`](api:Lighting.SunAngle) and the sun did not get lower. | Change the color and strength of the light instead of its height. See [The sun](#the-sun). |
| You changed [`BackgroundColor`](api:Lighting.BackgroundColor) and nothing happened. | Remove the sky, or change the sky's colors instead. See [The background color](#the-background-color). |
| A closed room is not dark. | Make the ambient light dark for the whole world, and add lights where needed. See [Ambient light](#ambient-light). |
