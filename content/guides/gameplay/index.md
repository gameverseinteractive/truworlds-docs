---
title: Gameplay systems
description: Input, the camera, tools, interactions, chat, purchases and web requests
---

# Gameplay systems

A new world already has a camera that follows the player, movement keys, a hotbar for tools and a chat window.

## Input and the camera

- [`InputSystem`](input.md) gives scripts key and mouse signals and checks for held keys.
- An [`InputAction`](input-actions.md) is a named input registered by a path and bound to keys and mouse buttons. A script or an on-screen button can drive it.
- The [`Camera`](camera.md) has several [camera modes](api:Camera.CameraMode).

## Interactions and tools

- An [`Interaction`](interactions.md) is a prompt: a player presses or holds a key near something.
- A [`ClickDetector`](api:ClickDetector) lets a player click a part.
- A [`Tool`](creating-tools.md) is something a player holds and [uses](scripting-tools.md).
- The [`Inventory`](inventory.md) holds a player's tools.

## Chat, purchases and web requests

- [`ChatSystem`](chat.md) covers announcements, reading messages and chat commands. Text is filtered by [`ContentSystem`](api:ContentSystem).
- [`MarketplaceSystem`](monetization.md) is for passes and products: it shows the purchase window and checks ownership.
- [`HttpSystem`](http.md) calls outside web services from server scripts.
