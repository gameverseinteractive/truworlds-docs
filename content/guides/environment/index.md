---
title: Environment
description: How light, sky, effects and sound turn a world of parts into a place
---

# Environment

Lighting, the sky and fog, lights, particles, fire, trails, highlights, selection boxes and sound do not affect physics or gameplay by themselves. They are how a world looks and sounds, and you connect them to gameplay with scripts.

## Light, sky and fog

- [`Lighting`](lighting.md) is light for the whole world: the sun, ambient light, shadows and the background color.
- [`ColorSky`](api:ColorSky), [`ImageSky`](api:ImageSky) and [`Fog`](api:Fog) are the [backdrop and the distance](sky-and-fog.md).
- [`PointLight`](api:PointLight) and [`SpotLight`](api:SpotLight) are [light sources you place](lights.md).

## Effects, highlights and sound

- [`ParticleEmitter`](particles-and-fire.md), [`Fire`](particles-and-fire.md) and [`Trail`](trails.md) are moving effects.
- [`Highlight`](api:Highlight) and [`SelectionBox`](api:SelectionBox) [make things stand out](highlights-and-selection.md).
- [`Audio`](api:Audio) is for [sound](sound.md).
