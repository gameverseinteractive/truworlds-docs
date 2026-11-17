---
title: Switching sessions
description: Move between the Server tab and each Player tab, and compare what each holds
---

# Switching sessions

In a playtest with three players the tab row holds, from left to right, the viewport tab (the world you are editing), the Server tab, and one tab for each of the three players. The Server tab shows the running world as the server has it. Nobody plays there: you look around with a free camera. Each Player tab shows the running world as that player's device has it, through that player's camera and on-screen interface.

## Switching tabs

To switch to another [session](index.md), click its tab. Press Ctrl+Tab for the next tab and Ctrl+Shift+Tab for the previous one.

Closing the viewport tab during a playtest asks to exit TruWorlds Creator, so check which tab is active before pressing Ctrl+W.

## What follows the active tab

| What | After you switch |
|---|---|
| The view | The view in the center shows the active session. Only the active tab is drawn. |
| Input | The keyboard and mouse go to the active session only. |
| The [Explorer](../creator/explorer.md) | The Explorer shows the tree of the active session's copy of the world. |
| The selection | The selection is cleared: it belongs to one copy of the world. |
| The command bar | The command bar runs what you type in the active session. Its placeholder names the session: Run in Server..., Run in Player 1... and so on. |

## Working in the new tab

After switching tabs, select again in the new session. Read the command bar's placeholder before pressing Enter.

Player tabs have no tool belt, and clicking in a Player view does not select objects: the click belongs to the game. To select something in a player's session, click it in the Explorer.

You control one player at a time: you cannot hold W for Player 1 and steer Player 2 at the same moment.

## The Server tab

In the Server tab there is no character to control. Instead you inspect and adjust the running world. The Server tab has its own small tool belt at the bottom of the view. What you move on the Server tab is really moved in the game, and players see it move.

## Comparing the sides

The same world looks different in the Explorer from each side, and seeing how is the fastest way to understand [replication](../networking/replication.md).

In the Explorer, objects created by a client script are absent on the Server tab: they exist only on the device that made them. They are present on that one player's tab only.

For most objects, an edit made on a Player tab, in the Properties panel or otherwise, changes that player's copy only: the server and the other players do not see it.

## Troubleshooting

| What you see | Fix |
|---|---|
| Your selection disappeared. | Select again in the new session; see [What follows the active tab](#what-follows-the-active-tab) and [Working in the new tab](#working-in-the-new-tab). |
| The command bar ran your code in the wrong place. | Read its placeholder before pressing Enter; see [What follows the active tab](#what-follows-the-active-tab) and [Working in the new tab](#working-in-the-new-tab). |
