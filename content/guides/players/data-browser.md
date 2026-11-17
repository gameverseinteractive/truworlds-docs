---
title: The Data Browser
description: Look at and edit saved data in TruWorlds Creator
---

# The Data Browser

The Data Browser is the Data tab in TruWorlds Creator. It shows everything your world has saved with `game.DataSystem`, and lets you change it by hand. You do not need the Data Browser to save data; scripts do that.

## Opening the Data tab

To open the Data Browser, click Data in the Data group of the ribbon's Script tab.

<!-- screenshot: The Data group on the ribbon's Script tab -->

<!-- screenshot: The Data tab with its three panels and no row selected -->

| Panel | What it is for |
|---|---|
| Stores | On the left: for choosing local or live data and picking a data store. |
| Data | In the middle: shows the chosen store's keys as a grid, where you search, sort, add and delete keys. |
| Details | On the right: shows the selected key's value in full, to edit it or look through its history. |

## Local and live data

A switch at the top of the Stores panel has two positions, Local and Live. The Local/Live switch chooses what you are looking at; the separate [Live data in playtests](saving-data.md#data-in-a-playtest) checkbox chooses what a playtest reads and writes.

When Live is grayed out, point at it to read the reason; usually you need to sign in or publish. For publishing, see [Saving and publishing](../creator/saving-and-publishing.md).

<!-- screenshot: The Local and Live switch at the top of the Stores panel -->

| Switch | What you see |
|---|---|
| Local | Data saved by [playtests](saving-data.md#data-in-a-playtest) of this world on this computer; nobody else has it, and it has nothing to do with your published world. |
| Live | The real data of your published project: what actual players have saved. |

## Checking that a save works

Use the Data Browser to see what your scripts saved: it is the fastest way to find out why saving is not working. A store appears in the Stores panel once something has been saved in it. If the store is missing from the Data tab after a playtest that should have saved to it, your script never saved. For saving, see [Saving data](saving-data.md).

When your script never saved, look in the console for a line starting `Save failed` (or whatever your `catch` prints) or an error starting `DataSystem:`.

A store a playtest saved to Local is not listed while you look at Live, and the other way round. When the store you save to is not listed, check the Local/Live switch, then click Refresh.
