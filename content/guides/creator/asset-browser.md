---
title: Asset Browser
description: Manage the folders and script files stored inside a world
---

# Asset Browser

The Asset Browser is the panel that shows the files stored inside your world. It shows the world's [virtual file system](../scripting/script-components.md): a folder tree on the left, and the current folder's contents on the right. Open the Asset Browser from its icon at the bottom of the left icon strip.

## Folders and script files

Folders only organize files; they have no effect on how the game runs. A script file is a file of [TruScript code](script-editor.md). Its icon shows its script type: server, client or module. A script file's [type](../scripting/script-types.md) decides where it runs: on the server, on each player's device, or only when imported.

[Attach](../scripting/script-components.md) a script created in the Asset Browser to an object, or [import()](api:global/import) it if it is a module.

## Moving through folders

Double-click a folder in the Asset Browser's list to go into it.

## Saving and paths

There is no separate save for scripts or folders.

> [!WARNING]
> Renaming or moving a file changes its path. Any `import()` call that names the old path must be updated by hand.

See [Modules and import](../scripting/modules-and-import.md).

## Meshes, images and sounds live elsewhere

[Meshes, images, sounds and animations](asset-library.md) are not stored in the world's file system.
