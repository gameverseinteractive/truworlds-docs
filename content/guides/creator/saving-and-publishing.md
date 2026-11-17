---
title: Saving and publishing
description: Save your world to a file, open it again, and publish it to TruWorlds
---

# Saving and publishing

Saving writes the world to a file on your computer, your working copy and backup. Publishing sends the world to TruWorlds, where players can play it. Saving does not publish, and publishing does not save. Players only ever get the published copy, never your file: what you change after publishing reaches players when you publish again.

## Saving to your computer

A `*` after the world's name in the window title means the world has changes that have not been saved to a file. See [Edit History](edit-history.md#undo-and-redo) for those changes.

> [!WARNING]
> TruWorlds Creator does not save automatically and does not keep a recovery copy. If the application closes unexpectedly, changes since your last save are lost.

You cannot save while a playtest or simulation is running. Stop the playtest or simulation, then save.

| Command | What it does |
|---|---|
| File > Save (Ctrl+S) | Writes the world to its file. The first time, it asks where to save. |
| File > Save As... (Ctrl+Shift+S) | Asks for a new file name and saves there. You carry on working in the new file. |
| File > Save Incremental | Saves the world as a new numbered copy next to the current file, for example `Castle_v2.trux` from `Castle.trux`, and carries on in that copy. |

## World files

Double-clicking a `.trux` or `.tru` file opens it in TruWorlds Creator.

| File type | What it is |
|---|---|
| `.trux` | A world saved as readable text, and is what the save dialog suggests. Text files work well with version control tools because changes between two saves can be compared. |
| `.tru` | The same world, compressed: smaller on disk and quicker to share. |

## Publishing to TruWorlds

To publish, click Publish on the right of the ribbon's tab row, or choose File > Publish to TruWorlds... You need to be signed in to publish a world. Publishing puts the world into a [project](../worlds/universes-and-worlds.md).

Publishing uploads the world as it is right now in TruWorlds Creator, including changes you have not saved to a file, and makes it the version players get. To [choose a project and a world](../worlds/publishing-your-game.md#publishing-from-truworlds-creator), see Publishing your game.

When you publish, the world you have open becomes linked to the published world you chose. After the first publish the `*` appears in the title, because the file now needs to remember which published world it belongs to. Publish, then press Ctrl+S, so the file remembers its link.

## Opening a world

File > Open World..., File > Recent Files and the Recent files cards on the home screen open the file on your computer, even when that world has been published. File > Open from TruWorlds..., the Your projects cards on the home screen and the Worlds panel open a world of one of your projects on TruWorlds. Open in TruWorlds Creator, at the top of a project's page on the Create site, opens the project's Starting World for editing.

TruWorlds Creator remembers, on your computer, which file you last saved for each published world, so it can offer your local copy when you open the project later. Opening the project on another computer downloads the published copy.

> [!WARNING]
> A local copy and the published version can differ. If you edited locally and never published, the local copy is newer. If you published from another computer, the published version is newer.

When your recent work is missing after opening a project, you may have opened the published version instead of your local copy, or the other way round: open it again and choose the other option.

A downloaded published version is not a file on your computer until you save it. Press Ctrl+S and choose where to keep a downloaded published version.

| When you open a world of a project | What opens |
|---|---|
| You have a local file for this world, and it has never been published. | The local file opens. |
| You have a local file, and a published version exists. | You are asked: `You have a local copy of this world (edited <date>). Open it, or open the published version?` Choose Open Local Copy or Open Published Version. |
| There is no local file, and a published version exists. | The published version is downloaded (`Downloading world from TruWorlds...`) and opened. |
| There is no local file and nothing published yet. | An empty world opens, already linked to that published world, ready for you to build and publish. |

## Troubleshooting

| What you see | Fix |
|---|---|
| A Cannot Save File message appears when you save: `Please stop the simulation before saving.` | Stop the playtest or simulation, then save: [Saving to your computer](#saving-to-your-computer). |
| You opened your project and your recent work is missing. | Open it again and choose the other option: [Opening a world](#opening-a-world). |
| The title has a `*` straight after publishing. | Publish, then press Ctrl+S: [Publishing to TruWorlds](#publishing-to-truworlds). |
