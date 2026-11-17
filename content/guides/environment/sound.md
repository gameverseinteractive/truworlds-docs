---
title: Sound
description: Play sound effects and music with the Audio object
---

# Sound

Sound comes from one kind of object, [`Audio`](api:Audio). An `Audio` holds the id of an uploaded sound and a few settings, and plays that sound when you tell it to.

## Playing a sound

For anything that should play when something happens, call [`Play`](api:Audio.Play) from a script.

This server script, attached to any instance in the world, plays a sound once, for every player. Replace the id with the id of a sound you have uploaded.

```truscript
local bell = new Audio() {
    Name = "Bell",
    AudioId = "asset://123456",
    Parent = world
}
bell.Play()
```

## Audio properties

An [`Audio`](api:Audio) with [`AutoStart`](api:Audio.AutoStart) does not play while you are editing.

| Property | What it does |
|---|---|
| [`AudioId`](api:Audio.AudioId) | The asset id of the sound to play. Empty or invalid plays nothing. |
| [`Volume`](api:Audio.Volume) | Loudness, from `0` (silent) to `1` (full). |
| [`AutoStart`](api:Audio.AutoStart) | Makes the [`Audio`](api:Audio) play by itself as soon as it is in the world while the game is running. |
| [`Loop`](api:Audio.Loop) | Starts the sound again each time it ends, until [`Stop`](api:Audio.Stop) is called. |
| [`OneShot`](api:Audio.OneShot) | Destroys the [`Audio`](api:Audio) when the sound finishes. It wins over [`Loop`](api:Audio.Loop). It only works for an [`Audio`](api:Audio) made by a client script. |
| [`Pitch`](api:Audio.Pitch) | Changes pitch and speed together. Below `1` is lower and slower; above `1` is higher and faster. |
| [`TimeLength`](api:Audio.TimeLength) | The length of the sound, in seconds. It is `0` until the sound has loaded on this device, and always `0` in server scripts. |
| [`IsPlaying`](api:Audio.IsPlaying) | Whether the sound is playing. Scripts cannot set it; call [`Play`](api:Audio.Play) and [`Stop`](api:Audio.Stop). |

## Sound ids

Every [uploaded sound](../creator/asset-library.md) has an id such as `asset://123456`. That text goes in an [`Audio`](api:Audio)'s [`AudioId`](api:Audio.AudioId).

An `AudioId` that is a file path, or an id that does not exist, plays nothing, and a moment after the sound is asked to play a warning is written to the Console.

## Who hears a sound

Sound is produced by [each player's device](../networking/client-server-model.md). The server never loads or plays sounds: it only tells the devices which [`Audio`](api:Audio) objects should be playing.

When you call [`Play`](api:Audio.Play) in a server script, every player hears it. When you call [`Stop`](api:Audio.Stop) in a server script, it stops for every player.

When you create an `Audio` in a [client script](../networking/replication.md) and call `Play`, only that player hears it. When you change [`Volume`](api:Audio.Volume) on a server-made `Audio` in a client script, it changes for that player only.

## What the server does not know

Because the server never loads the sound file, it does not know how long the sound is or when it finishes. If a server script needs a sound's length, write the length in the script.

## One-off sounds

A server script that creates a sound for a one-off effect must remove it itself, with [`DestroyAfter`](api:Instance.DestroyAfter).

[`OneShot`](api:Audio.OneShot) never removes an [`Audio`](api:Audio) made by the server (or placed in TruWorlds Creator), and destroys an `Audio` made by a client script when the sound finishes.

When `OneShot` does not remove a sound because the `Audio` was made by the server or placed in the world, create the `Audio` in a client script instead.

Play a button click in a client script, so only the player who pressed it hears it.

## Example: A horn everyone hears

This server script, attached to any instance in the world, plays a 3-second sound for everyone, then removes it.

```truscript
local horn = new Audio() {
    Name = "Horn",
    AudioId = "asset://123456",       # replace with the id of your own sound
    Parent = world
}
horn.Play()
horn.DestroyAfter(5)                  # a little longer than the sound
```

## Example: A click only one player hears

This client script, attached to any instance in the world, plays a click that only this player hears, then cleans up after itself.

```truscript
local click = new Audio() {
    Name = "Click",
    AudioId = "asset://123456",       # replace with the id of your own sound
    OneShot = true,
    Parent = world
}
click.Play()
```

## Loading

A sound is loaded on a device the first time it is needed there, which takes a moment: until it arrives, [`TimeLength`](api:Audio.TimeLength) is `0` in a client script. A sound that has to be downloaded can therefore start a little late the first time.

When `TimeLength` is `0` in a client script because the sound has not loaded yet, wait until it is more than `0`.

## Troubleshooting

| What you see | Fix |
|---|---|
| [`OneShot`](api:Audio.OneShot) does not remove a sound. | Create the [`Audio`](api:Audio) in a client script instead, or remove the sound yourself with [`DestroyAfter`](api:Instance.DestroyAfter). See [One-off sounds](#one-off-sounds) and [What the server does not know](#what-the-server-does-not-know). |
| [`TimeLength`](api:Audio.TimeLength) is `0`. | In a client script, wait until it is more than `0`. In a server script, write the length in the script. See [Audio properties](#audio-properties) and [Loading](#loading). |
