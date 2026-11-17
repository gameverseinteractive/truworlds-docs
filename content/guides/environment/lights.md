---
title: Lights
description: Light part of a world with point lights and spotlights
---

# Lights

Lights are small sources of light that you place where you want them, unlike the [`Lighting`](lighting.md) system's one sun.

## Two kinds of light

| Class | How it shines |
|---|---|
| [`PointLight`](api:PointLight) | In every direction from one point. |
| [`SpotLight`](api:SpotLight) | In one direction, in a cone. |

## Adding a light

A light [follows the part it is inside](../engine/point-instances.md), so the normal way to add a light is to put it inside the part that should glow.

This server script, attached to a part such as a lamp shade or a crystal, makes the part give off warm light.

```truscript
local glow = new PointLight() {
    Name = "Glow",
    Color = new Color3(1, 0.85, 0.6),
    Parent = this
}
```

A light itself is invisible: you see only what it lights. To make the source of a light look lit, give the part the light is in the [`Glow`](api:PartMaterial) material.

## Light properties

| Property | What it does |
|---|---|
| [`Color`](api:BaseLight.Color) | The color of the light. |
| [`Intensity`](api:BaseLight.Intensity) | How bright the light is. `0` gives no light. |
| [`Range`](api:BaseLight.Range) | How far the light reaches. It is not in studs: each unit reaches about 4 studs. |
| [`CastShadows`](api:BaseLight.CastShadows) | Whether parts block this light and cast shadows. |

## Range

> [!WARNING]
> `Range` is not measured in studs: the default of `10` lights things up to about 40 studs away. Treating it as studs makes lights four times bigger than intended.

When a light is far bigger than you expected because [`Range`](api:BaseLight.Range) is not in studs, use a quarter of the number you had in mind.

## Shadows

By default a light casts no shadows, so its light passes through walls and floors: a lamp in one room also lights the room next door and the floor below.

Turn [`CastShadows`](api:BaseLight.CastShadows) on and parts block the light.

## Example: A ceiling light that stays in its room

This server script, attached to a part inside a room, adds a ceiling light that does not leak through the walls.

```truscript
local light = new PointLight() {
    Name = "CeilingLight",
    Range = 6,
    CastShadows = true,
    Parent = this
}
```

## Spotlights

| Property | What it does |
|---|---|
| [`Angle`](api:SpotLight.Angle) | Half the width of a spotlight's cone, from the center line of the beam to its edge: `45` makes a cone 90 degrees wide. |
| [`Attenuation`](api:SpotLight.Attenuation) | How soft the edge of a spotlight's beam is. Low values give an evenly lit circle with a sharp edge; `1` fades the light from the center out to the edge. |

## Aiming a spotlight

Inside a part with no offset, a [`SpotLight`](api:SpotLight) shines out of the part's [front (-Z)](../engine/coordinates-and-units.md) face.

To aim a spotlight, turn the light, not the part: change [`OffsetRotation`](api:PointInstance.OffsetRotation), which is in degrees and relative to the part.

## Example: A downlight

This server script, attached to an anchored part that is a ceiling panel, adds a downlight just below the panel, pointing straight down.

```truscript
local downlight = new SpotLight() {
    Name = "Downlight",
    OffsetPosition = new Vector3(0, -0.6, 0),
    OffsetRotation = new Vector3(-90, 0, 0),
    Angle = 35,
    Range = 8,
    Parent = this
}
```

## Switching a light on and off

A light shines only while it is under [`world`](api:global/world) and visible: its own [`Visible`](api:VisualInstance.Visible) is `true`, and so is the `Visible` of the parts above it. So `Visible` is a light's switch.

Hiding a part also switches off the lights inside it. To keep a light shining while the part above it is hidden, set the light's [`IgnoreParent`](../engine/visual-instances.md) to `true`.

[`Transparency`](api:VisualInstance.Transparency) has no effect on a light: inside a part with `Transparency = 1` it still shines at full strength, and its own `Transparency` does nothing. To dim a light, lower [`Intensity`](api:BaseLight.Intensity).

When a light does nothing, check that it is in the world, that `Visible` is `true` on it and on the parts above it, and that `Intensity` and [`Range`](api:BaseLight.Range) are above `0`.

## Example: A blinking light

This server script, attached to a part that has a [`PointLight`](api:PointLight) named "Glow" inside it, blinks the light once a second.

```truscript
local glow = this.WaitForChild("Glow")
while true:
    glow.Visible = not glow.Visible
    wait(0.5)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| Your light is far bigger than you expected. | Use a quarter of the number you had in mind. See [Range](#range). |
| Your light does nothing. | Check that it is in the world, that [`Visible`](api:VisualInstance.Visible) is `true` on it and on the parts above it, and that [`Intensity`](api:BaseLight.Intensity) and [`Range`](api:BaseLight.Range) are above `0`. See [Switching a light on and off](#switching-a-light-on-and-off). |
| Setting the light's [`Transparency`](api:VisualInstance.Transparency) does not dim it. | Lower [`Intensity`](api:BaseLight.Intensity). See [Switching a light on and off](#switching-a-light-on-and-off). |
| The lamp shines but the bulb part looks dull. | Give the part the light is in the [`Glow`](api:PartMaterial) material. See [Adding a light](#adding-a-light). |
