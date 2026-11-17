---
title: Interactions
description: Let players use things with prompts and click detectors
---

# Interactions

TruWorlds has two ready-made ways to let a player use a thing in the world, [`Interaction`](api:Interaction) and [`ClickDetector`](api:ClickDetector), and neither needs input code. An `Interaction` is a [`PointInstance`](api:PointInstance) that is a prompt players activate by pressing a key nearby. A `ClickDetector` makes the part it is inside clickable. Both tell the server which [`Player`](api:Player) used it, so your game logic lives in a server script.

## Choosing between them

| What differs | [`Interaction`](api:Interaction) and [`ClickDetector`](api:ClickDetector) |
|---|---|
| How the player uses it | With an [`Interaction`](api:Interaction), the player walks close and presses or holds a key. With a [`ClickDetector`](api:ClickDetector), the player points at the part and clicks. |
| Holding | An [`Interaction`](api:Interaction) can be held to use, with a progress ring. A [`ClickDetector`](api:ClickDetector) cannot. |
| Good for | An [`Interaction`](api:Interaction) suits doors, pickups and talking: anything "near me". A [`ClickDetector`](api:ClickDetector) suits buttons, switches and puzzle pieces: anything "that one". |

## Adding a prompt

[`Interacted`](api:Interaction.Interacted) fires when the interaction completes: on the key press when [`ActivationTime`](api:Interaction.ActivationTime) is 0, or once the key has been held long enough. Each [`Interaction`](api:Interaction) signal passes the [`Player`](api:Player) who is interacting.

The prompt shows while the player's character is within [`MaxDistance`](api:Interaction.MaxDistance) of the `Interaction` and the `Interaction` is in front of the camera. An `Interaction` that is not inside `world` shows no prompt. `MaxDistance`'s default is short for a large object: raise `MaxDistance`, or move the prompt with [`OffsetPosition`](api:PointInstance.OffsetPosition).

An `Interaction` with [`Visible`](api:VisualInstance.Visible) `false` hides its prompt and cannot be used. Hiding the part it is inside does the same.

## Example: A chest with an Open prompt

This server script adds an "Open" prompt to its part and prints who used it. Attach it to a part in `world`.

```truscript
local prompt = new Interaction() {
    ObjectName = "Chest",
    ActionName = "Open",
    Parent = this
}

prompt.Interacted.Connect(func(player):
    print(player.Name + " opened the chest")
)
# Expected output when Player1 walks up and presses E:
# Player1 opened the chest
```

It prints `Player1 opened the chest` when Player1 walks up and presses E.

## Holding the key

Set `ActivationTime` above 0 to make the player hold the key. In a hold, [`InteractionStarted`](api:Interaction.InteractionStarted) fires on key down. Holding for `ActivationTime` seconds fires `Interacted`; ending the hold early fires [`InteractionInterrupted`](api:Interaction.InteractionInterrupted).

## The result belongs on the server

Each [`Interaction`](api:Interaction) signal fires twice: first in client scripts on the player's own device, then in server scripts once the server has received the report. Put the result of an `Interaction` (open the door, give the item) in a server script.

Changing [`ActionName`](api:Interaction.ActionName) on the server reaches every player, so everyone's prompt says the right thing.

## Example: A door that opens with E

This server script opens or closes a door for everyone when a player presses E near it. Attach it to an anchored part named "Door" in `world`.

```truscript
local open = false

local prompt = new Interaction() {
    ObjectName = "Door",
    ActionName = "Open",
    MaxDistance = 8,
    Parent = this
}

prompt.Interacted.Connect(func(player):
    open = not open
    this.CanCollide = not open
    if open:
        this.Transparency = 0.7
        prompt.ActionName = "Close"
    else:
        this.Transparency = 0
        prompt.ActionName = "Open"
    print(player.Name + " used the door")
)
```

## Click detectors

A [`ClickDetector`](api:ClickDetector) does the raycast for a simple "click this object" interaction.

## Troubleshooting

| What you see | Fix |
|---|---|
| The prompt never appears. | Raise [`MaxDistance`](api:Interaction.MaxDistance), or move the prompt with [`OffsetPosition`](api:PointInstance.OffsetPosition). See [Adding a prompt](interactions.md#adding-a-prompt). |
| The handler runs twice. | Put the result of an [`Interaction`](api:Interaction) in a server script. See [The result belongs on the server](interactions.md#the-result-belongs-on-the-server) and [Module scripts](../scripting/script-types.md#module-scripts). |
| The door opens for one player only. | Put the result of an [`Interaction`](api:Interaction) in a server script. See [The result belongs on the server](interactions.md#the-result-belongs-on-the-server) and [The server's world is the real one](../networking/client-server-model.md#the-servers-world-is-the-real-one). |
