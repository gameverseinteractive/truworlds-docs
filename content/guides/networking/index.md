---
title: Networking
description: The server and players' devices, the messages between them, and frames
---

# Networking

A world that is being played runs on several computers at once: [one server](client-server-model.md) that holds the real game, and one device for each player. [Replication](replication.md) copies the world down: instances and property changes made on the server are sent to devices automatically.

## Remote events and functions

[RemoteEvent and RemoteFunction](remote-communication.md) objects carry your messages. A device uses them to ask the server for something; the server uses them to tell devices what the world alone does not show. The server checks everything: a device is in the player's hands, so [every request is checked](trusting-the-client.md) before the server acts on it.

## Frames and smooth motion

Everything advances in [frames](frames-and-time.md). Each side runs its own loop. How you move an object decides [how good it looks](physics-interpolation.md) on players' screens. [Tweens](../animation/tweens.md) are for making things look smooth, and they run only on a device, which suits that.
