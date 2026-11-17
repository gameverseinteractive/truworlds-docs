---
title: Debugging a playtest
description: Find out why a world misbehaves during a playtest
---

# Debugging a playtest

During a playtest you can look at the live world without changing your scripts.

## Which session to check

In a playtest a server script runs in the server session, once, and its prints and errors appear under `[Server]`. A client script runs in every player session, once each, and its prints and errors appear under `[Player 1]`, `[Player 2]` and so on.

During a playtest, look at the Script Console output of the right session: the server for server scripts, the player for client scripts.

## Reading the Console per session

A [Script Console](../creator/script-console.md) line's tag, such as `[Server]` or `[Player 1]`, names the session that produced it. Lines from the world you are editing have no tag. With All chosen in the Script Console's source dropdown, every session's lines are shown mixed together in the order they arrived, and the tags tell you who said what.

With one session chosen, the Script Console follows the active tab: click the Player 2 tab and the Script Console switches to Player 2. Choose All again to stop the Script Console following the active tab.

## Errors in each session

An [error](../scripting/errors-and-debugging.md) in a client script happens once in every player session, because each runs its own copy. The same error reported once in every player session is one bug, not two.

## Printing on both sides

When a client script fires a [RemoteEvent](api:RemoteEvent) and the server should react, print just before firing and at the top of the server's handler.

With prints on both sides of a message and the source dropdown on All, you see whether the message was sent, whether it arrived, and in which order.

## Looking at live state

During a playtest, select instances in the Explorer and read their properties in the Properties panel, for the server and for each player separately.

To check whether your script created an object, search for its name in the Explorer on the Server tab. To check whether an object reached the player, switch to the Player tab and look for it there.

## Changing things live

To test an idea without stopping, select an object on the Server tab and edit a property; see [the Server tab](switching-sessions.md#the-server-tab).

## When you are stuck

Find the first thing that is wrong. Follow the chain: input, client script, [RemoteEvent](api:RemoteEvent), server script, change in the world, player sees it. Check each link with a print or by looking in the Explorer on the right tab.

Fix the first broken link in the chain; the later ones are usually consequences. Make it smaller: try with 1 Player, and disable other scripts by detaching them.

## Troubleshooting

| What you see | Fix |
|---|---|
| The Script Console keeps switching as you change tabs. | Choose All again to stop the Script Console following the active tab; see [Reading the Console per session](#reading-the-console-per-session). |
