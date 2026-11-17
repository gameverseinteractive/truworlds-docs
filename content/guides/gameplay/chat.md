---
title: Chat
description: What scripts can do with in-game chat
---

# Chat

TruWorlds has text chat built in. When a player sends a chat message, everyone in the server sees it in the chat window and as a speech bubble over the speaker's head. Scripts work with chat through [`ChatSystem`](api:ChatSystem) (`game.ChatSystem`): they can post announcements, read what is said and react to commands.

## Announcements

[`SendSystemMessage`](api:ChatSystem.SendSystemMessage) adds a gold system line to chat, from no player. From a server script every player sees it; from a client script only that player does. Call it from a server script to reach everyone.

A chat message is at most 128 characters. Longer text is cut.

> [!WARNING]
> Scripts cannot send chat as a player: no world script can make a message appear to come from someone. `SendSystemMessage` is how a script speaks in chat.

## Example: A round countdown in chat

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, counts down to the start of a round in chat.

```truscript
for seconds in [30, 20, 10, 5, 4, 3, 2, 1]:
    game.ChatSystem.SendSystemMessage("Round starts in " + seconds + " seconds")
    if seconds > 10:
        wait(10)
    elif seconds > 5:
        wait(5)
    else:
        wait(1)
game.ChatSystem.SendSystemMessage("Go!")
```

## Reading what players say

Scripts read what players say in two ways, for two jobs: [`player.Chatted`](api:Player.Chatted) and `game.ChatSystem.MessageAdded`. `Chatted` fires with the text when the player sends a chat message.

| What differs | [`player.Chatted`](api:Player.Chatted) and [`ChatSystem.MessageAdded`](api:ChatSystem.MessageAdded) |
|---|---|
| What you get | [`player.Chatted`](api:Player.Chatted) gives you the text, as a string. `game.ChatSystem.MessageAdded` gives you a [`ChatMessage`](api:ChatMessage) object. |
| Best for | [`player.Chatted`](api:Player.Chatted) suits chat commands on the server. `game.ChatSystem.MessageAdded` suits your own chat display on a device. |

## Chat commands

Connect [`Chatted`](api:Player.Chatted) once per player, in [`PlayerAdded`](api:Players.PlayerAdded), on the server.

A chat command is still an ordinary chat message: other players see `!speed 20` in chat. Check chat command arguments like anything else a player sends, as the speed command in the example below does by clamping the speed. Handle chat commands on the server.

## Example: Help, reset and speed commands

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, handles the chat commands "!help", "!reset" and "!speed \<number>".

```truscript
local COMMANDS = {}

COMMANDS["!help"] = func(player, args):
    game.ChatSystem.SendSystemMessage("Commands: !help, !reset, !speed <8 to 32>")

COMMANDS["!reset"] = func(player, args):
    player.ResetCharacter()

COMMANDS["!speed"] = func(player, args):
    local speed = tonumber(args[1])
    local character = player.Character
    if speed == nil or character == nil:
        return
    character.MoveSpeed = math.clamp(speed, 8, 32)

func on_chatted(player, text):
    local words = string.split(string.trim(text), " ")
    local command = COMMANDS[string.lower(words[0])]
    if command != nil:
        command(player, words)

game.Players.PlayerAdded.Connect(func(player):
    player.Chatted.Connect(func(text):
        on_chatted(player, text)
    )
)
```

## Filtering text

Everything players type in chat is checked by [`ContentSystem`](api:ContentSystem) (`game.ContentSystem`) automatically before other players see it.

Do not show one player's typed text to other players outside chat without filtering it: in custom chat windows fed by your own [remote events](../networking/remote-communication.md), signs players write on, pet names over heads and the like. Filter such text on the server with [`FilterStringAsync`](api:ContentSystem.FilterStringAsync) while its writer is in the server, show [`FilteredText`](api:FilterResult.FilteredText), and show nothing when [`Status`](api:FilterResult.Status) is `Error`.

For text of your own, a server script calls `game.ContentSystem.FilterStringAsync(text, player, context)`. `FilterStringAsync` works only in server scripts.

In a TruWorlds Creator playtest nothing is filtered: chat passes unchanged, and `FilterStringAsync` gives the text back unchanged with `Status` `Clean`. Filtering applies in published worlds.

| FilterResult Status | What to show |
|---|---|
| `Clean` | The text passed unchanged. Show [`FilteredText`](api:FilterResult.FilteredText). |
| `Filtered` | The filter hid parts of the text. Show [`FilteredText`](api:FilterResult.FilteredText), never the original. |
| `Error` | The text could not be checked, or the check was turned down. Show nothing new; [`FilteredText`](api:FilterResult.FilteredText) is empty. |

## Speech bubbles

Player chat makes speech bubbles over the speaker's character. Scripts can make them over anything. Every part and every character body has a [`Speak`](api:DynamicInstance.Speak) method. To make a character speak, call `Speak` on its body.

Called from a client script, `Speak`'s bubble shows only on that device.

## Example: Characters that say ouch when hurt

This server script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes every character say "Ouch!" when it is damaged.

```truscript
func on_character(character):
    character.Damaged.Connect(func():
        local body = character.PrimaryBody
        if body != nil:
            body.Speak("Ouch!", 2)
    )

game.Players.PlayerAdded.Connect(func(player):
    player.CharacterAdded.Connect(on_character)
)
```

## Troubleshooting

| What you see | Fix |
|---|---|
| A system message only shows for one player. | Call [`SendSystemMessage`](api:ChatSystem.SendSystemMessage) from a server script to reach everyone. See [Announcements](chat.md#announcements). |
| A chat command works for the sender but changes nothing for others. | Handle chat commands on the server. See [Chat commands](chat.md#chat-commands) and [The server's world is the real one](../networking/client-server-model.md#the-servers-world-is-the-real-one). |
| Players' text appears unfiltered on a custom sign. | Filter such text on the server with [`FilterStringAsync`](api:ContentSystem.FilterStringAsync) while its writer is in the server, show [`FilteredText`](api:FilterResult.FilteredText), and show nothing when [`Status`](api:FilterResult.Status) is `Error`. See [Filtering text](chat.md#filtering-text). |
