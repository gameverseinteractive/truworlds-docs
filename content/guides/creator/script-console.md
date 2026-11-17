---
title: Script Console
description: Read script output, search it, and run TruScript from the command bar
---

# Script Console

The Script Console is the panel that shows messages, including a log of what TruWorlds Creator itself did. The Console panel's title bar reads Script Console. Open it with Console in the Script tab's Debug group or the Home tab's Panels group.

## Reading a line

Each Console entry starts with the time, as `[ HH:mm:ss ]`. During a playtest each entry is also tagged with the session it came from, `[Server]` or `[Player 1]`, because the server and every player have their own scripts and their own output. For errors, see [Errors and debugging](../scripting/errors-and-debugging.md).

| Color | Meaning |
|---|---|
| Normal | Ordinary output, such as a script's [print](api:global/print). |
| Orange | A warning, such as a script's [warn](api:global/warn): nothing stopped. |
| Red | An error: the code that was running stopped. |

## What TruWorlds Creator writes

Besides your scripts' output, the Script Console records every edit you make, as a line starting with `-` and the name of the step, for example `- Insert Part`, `- Transform instances` or `- Delete Instance`. Undo and redo appear as `- Undo: <step>` and `- Redo: <step>`, for example `- Undo: Ungroup Instances`. Saving and opening appear as `Saving to file: <path>` and `Opened file: <path>`. For what a step is, see [What is a step](edit-history.md#what-is-a-step).

## Choosing a source

The list at the Script Console's top left chooses whose output you see: All, Editor, Server, or one player, such as Player 1.

- Editor shows messages from the world you are editing.
- Server shows, during a playtest, messages from the server.
- Player 1 to Player 4 show, during a playtest, messages from that player's session.

[Server scripts](../scripting/script-types.md) print on the server and client scripts on each player, so the source tells you where code ran. With All chosen, the Script Console stays on All as you switch tabs. For [one session chosen](../playtesting/debugging-a-playtest.md#reading-the-console-per-session), see Debugging a playtest.

If a message you expect is missing, check that you are looking at the right source.

## Searching, copying and text size

The Search field shows only lines that contain the text, in any case. Clear the Search field to see everything again.

Scroll with the mouse wheel. The view follows new messages while you are at the bottom, and stops following when you scroll up so that you can read. Right-click the Script Console for its menu.

| Menu item | What it does |
|---|---|
| Copy (Ctrl+C) | Copies the selected text. |
| Select All (Ctrl+A) | Selects every line. |
| Zoom In (Ctrl+=) | Makes the text larger. Ctrl with the mouse wheel does the same. |
| Zoom Out (Ctrl+-) | Makes the text smaller. |
| Reset Zoom (Ctrl+0) | Returns the text to the normal size. |
| Clear | Empties the console, for every source. |

## When the console is cleared

When the Script Console is full of old messages, right-click it and choose Clear. It is also cleared when you open a world or start a new one. The Console is emptied when a playtest starts, so what you see belongs to the current run.

## The command bar

The line at the bottom of the Console panel, marked `>`, is the command bar. It is a quick way to inspect or change the world without writing a script file, and it runs TruScript immediately. To run a line of TruScript, type it into the command bar and press Enter.

Typed while editing, this prints the name of the [world](api:global/world) container.

```truscript
print(world.Name)
# Output: World
```

The Script Console echoes a command-bar line after a `>` and, when the line is a single expression, prints its value on the next line. The echo shows the session it ran in, such as `[Editor] >`, then anything the command printed.

## Several lines

Shift+Enter starts a new line. The bar grows to show up to eight lines, then scrolls.

Typed while editing, with Shift+Enter between lines, this adds a row of five parts to the world.

```truscript
for i in range(5):
    new Part() { Name = "Step" + i, Position = new Vector3(i * 4, 1, 0), Anchored = true, Parent = world }
print("Added 5 parts")
# Output: Added 5 parts
```

## Where a command runs

A command runs in the active center tab's copy of the world; see [Switching sessions](../playtesting/switching-sessions.md).

- On the viewport tab it runs in the world you are editing.
- On the Server tab during a playtest it runs on the server, where it can do what a server script can.
- On a Player tab it runs on that player's side, where it sees what a client script would see.

The bar's gray hint names the session it will run in: Run in Editor ... while editing, and Run in Server ... or Run in Player 1 ... during a playtest, following the tab that is selected above the viewport.

Typed on the Server tab during a playtest, then again on the Player 1 tab, this lets you compare the two outputs.

```truscript
print(game.Players.GetPlayers().length)
# Output with one player in the playtest: 1
# Output with two players: 2
# Output on the viewport tab while editing: 0
```

It prints `1` with one player in the playtest, `2` with two players, and `0` on the viewport tab while editing.

## Command history and variables

Press Up on the first line of the command bar to bring back the previous command, and Down on the last line to go forward again.

A variable you set without `local` in one command, such as `x = 5`, is still there for your next command in the same session, so you can build something up over several commands.

## Things to know

A command runs straight away with full access to the world. There is no confirmation. The command bar has more permissions than the scripts in your world, so success there does not prove a client script can do the same thing. A change made from the command bar is not a step in the Edit History, so Ctrl+Z does not undo it; see [What is a step](edit-history.md#what-is-a-step).

Save your world before running a command that changes many objects.

A command can wait. `wait(1)` followed by a `print` on the next line prints one second later, even while you are editing, and you can type further commands in the meantime.

A mistake in a command is reported in red in the Script Console and nothing runs.

## Problems and fixes

| Problem | Fix |
|---|---|
| Your `print` does not show up in the Script Console. | Check the source and clear the Search field: [Choosing a source](#choosing-a-source), [Searching, copying and text size](#searching-copying-and-text-size). Check the conditions for a script to run: [When a script runs](../scripting/what-is-a-script.md#when-a-script-runs). |
| The Script Console is full of old messages. | Right-click it and choose Clear: [When the console is cleared](#when-the-console-is-cleared). |
