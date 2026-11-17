---
title: Sky and fog
description: Give a world a sky and distance fog
---

# Sky and fog

The *sky* is what players see behind and above the world. *Fog* fades far-away things into a color, which gives a sense of distance and hides the edge of the world. The sky and fog are objects that you place inside the [`Lighting`](lighting.md) system.

## Kinds of sky

| Class | What it is |
|---|---|
| [`ColorSky`](api:ColorSky) | A sky drawn as a smooth gradient of three colors. It is the sky to use. |
| [`ImageSky`](api:ImageSky) | A sky that shows a built-in picture of a sky. |

## Where a sky or fog must be

> [!WARNING]
> A sky or a fog only works as a direct child of `game.Lighting`. Anywhere else, including a folder inside [`Lighting`](api:Lighting), it does nothing.

If [`Lighting`](api:Lighting) holds several skies, the one that was added first is the *active* sky and the others are ignored. The same goes for fog.

Either change the existing sky's properties, or [destroy](api:Instance.Destroy) it before you add another.

## Coloring the sky

A new world starts with one [`ColorSky`](api:ColorSky) named `Sky` inside [`Lighting`](api:Lighting), and no fog.

| Property | Where it shows |
|---|---|
| [`SkyColor`](api:ColorSky.SkyColor) | At the top of the sky, straight overhead. |
| [`HorizonColor`](api:ColorSky.HorizonColor) | In the band where the sky meets the horizon. |
| [`GroundColor`](api:ColorSky.GroundColor) | Below the horizon: what you see when you look down past the edge of the world. |

## Example: A sunset sky

This server script, attached to any instance in the world, recolors the existing sky for sunset.

```truscript
local sky = game.Lighting.FindFirstChild("Sky")
if sky and sky.IsA("ColorSky"):
    sky.SkyColor = new Color3(0.2, 0.25, 0.55)
    sky.HorizonColor = new Color3(1, 0.6, 0.35)
    sky.GroundColor = new Color3(0.25, 0.2, 0.2)
```

## The sky does not light the world

The sky is a picture only: it does not change how brightly the world is lit. The sun and [`AmbientLightColor`](api:Lighting.AmbientLightColor) on [`Lighting`](api:Lighting) do that.

When the sky is black but the world is bright, or the reverse, change [`SunBrightness`](api:Lighting.SunBrightness) and `AmbientLightColor` on `Lighting` too.

## Fog

A [`Fog`](api:Fog) fades everything toward one color as it gets farther from the camera. Close things look normal; distant things dissolve into the fog color.

A `Fog` has no on/off property: fog is on while a `Fog` is a direct child of [`Lighting`](api:Lighting), and off when it is not.

## Example: Morning mist

This server script, attached to any instance in the world, adds light morning mist.

```truscript
local mist = new Fog() {
    Color = new Color3(0.7, 0.75, 0.8),
    Density = 0.02,
    Parent = game.Lighting
}
```

## The two fog modes

In [`FogMode.Exponential`](api:FogMode), fog starts at the camera and thickens smoothly with distance. [`Density`](api:Fog.Density) sets how thick it is. As a rule of thumb for `Exponential` fog, about `3 / Density` studs stay visible.

In `FogMode.Linear` the view is completely clear up to [`Start`](api:Fog.Start) studs, then fog increases evenly until things are completely hidden at [`End`](api:Fog.End) studs. In `Exponential` mode, `Start` and `End` are ignored.

When `Start` and `End` do nothing because the fog's [`Mode`](api:Fog.Mode) is `Exponential`, set `Mode = FogMode.Linear`.

## Adding fog in TruWorlds Creator

A newly inserted [`Fog`](api:Fog) goes inside whatever was selected, or into the World when nothing (or [`Lighting`](api:Lighting) itself) was selected. In either place it does nothing.

If your fog has no effect, check in the Explorer that it sits directly under [`Lighting`](api:Lighting).

## Who sees the sky and fog

Who sees a change to the sky and fog follows the same rules as for [Lighting](lighting.md#who-sees-a-change).

## Troubleshooting

| What you see | Fix |
|---|---|
| Your new sky does not show. | Change the existing sky's properties, or destroy it before you add another. See [Where a sky or fog must be](#where-a-sky-or-fog-must-be). |
| Your fog does nothing. | Check in the Explorer that it sits directly under [`Lighting`](api:Lighting). See [Where a sky or fog must be](#where-a-sky-or-fog-must-be) and [Adding fog in TruWorlds Creator](#adding-fog-in-truworlds-creator). |
| A fog's [`Start`](api:Fog.Start) and [`End`](api:Fog.End) do nothing. | Set `Mode = FogMode.Linear`. See [The two fog modes](#the-two-fog-modes). |
| The sky is black but the world is bright, or the reverse. | Change [`SunBrightness`](api:Lighting.SunBrightness) and [`AmbientLightColor`](api:Lighting.AmbientLightColor) on [`Lighting`](api:Lighting) too. See [The sky does not light the world](#the-sky-does-not-light-the-world). |
