---
title: Files and components
description: Where script files live, and how instances attach them by path
---

# Files and components

A script is a file, and instances only point at it. A world's file system is called the virtual file system (VFS): it works like the folders on your computer, but exists only inside the world. The instance tree is shown in the Explorer. The virtual file system is shown in the Asset Browser.

## Script components

Each attachment of a script file to an instance is called a *script component*: one link between one instance and one script file. Attaching a script gives the instance a link to the file, not a copy: attach one file to fifty coins and there is still exactly one `Coin` script. With one instance selected, each of its script components appears as a header at the top of the Properties panel, showing the file's name and the icon of its script type.

## Adding and removing scripts

To create a script on an instance, select exactly one instance and choose New Script… under Script on the ribbon (Home tab, Insert group, or the Script tab). In the Create script window, type a name, choose Server script, Client script or Module script, and click Create. New scripts are server scripts unless you choose otherwise.

Remove Component, in a script header's menu, detaches the script from this instance. The file is not deleted and other instances that use it are not affected.

## Renaming, moving and deleting files

A script component remembers the file, not its path: rename or move the file and every instance stays attached.

Paths written in code are just text, and do not follow a file that is renamed or moved.

If you rename or move a file, update the paths to it in your code yourself, such as `import("Shared/Prices")` or `AttachScript("Scripts/Coin")`.

If a script file is deleted while instances still use it, each of those components stays on its instance but shows in the Properties panel as Unknown followed by the file's last name in parentheses, and [GetScriptPath](api:Instance.GetScriptPath) gives no path for it.

## Changing the script type

The type belongs to the file, so changing a script's type applies to every instance the file is attached to. To change a script's type, right-click the file in the Asset Browser, choose Change Script Type, and choose Server Script, Client Script or Module Script. See [Script types](script-types.md).

## Paths

A path given to [AttachScript](api:Instance.AttachScript) or [DetachScript](api:Instance.DetachScript) starts at the top folder, separates folder names with `/` and has no file extension: `"Scripts/Door"` is the file `Door` in the folder `Scripts`. Script paths are case-sensitive. A leading `/` in the path is allowed and changes nothing.

Import paths, which can be relative, are covered in [Modules and import](modules-and-import.md).

## Attaching from a script

This server script, attached to a [Folder](api:Folder) in `game.ScriptSystem`, expects a script file at "Scripts/Spinner" in the Asset Browser. It creates five parts and gives each one the Spinner script.

```truscript
for i in range(5):
    local part = new Part() {
        Name = "Spinner" + i,
        Size = new Vector3(2, 2, 2),
        Position = new Vector3(i * 5, 4, 0),
        Anchored = true,
        Parent = world
    }
    part.AttachScript("Scripts/Spinner")
    print(part.Name + " has " + part.GetScriptCount() + " script(s): " + part.GetScriptPath(0))
# Output:
# Spinner0 has 1 script(s): Scripts/Spinner
# Spinner1 has 1 script(s): Scripts/Spinner
# Spinner2 has 1 script(s): Scripts/Spinner
# Spinner3 has 1 script(s): Scripts/Spinner
# Spinner4 has 1 script(s): Scripts/Spinner
```

It prints `Spinner0 has 1 script(s): Scripts/Spinner`, then one such line for each of `Spinner1` to `Spinner4`.

`AttachScript(path)` attaches the file at `path`. If the instance is somewhere scripts run, the new copy starts the next time scripts run: the lines after `AttachScript` run first.

`DetachScript(path)` removes one attachment of the file at `path`, stopping that copy. It does nothing if that file is not attached.

[AttachScript](api:Instance.AttachScript) and [DetachScript](api:Instance.DetachScript) both fail with an error when there is no file at the path, or the thing at that path is a folder or another kind of file.

When no script file is found at a path, check the spelling and capitalization of the path.

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says no script file was found at a path: `No script file found at path <path>` | Check the spelling and capitalization of the path; see [Attaching from a script](#attaching-from-a-script) and [Paths](#paths). |
| An import fails after you rename a script. | Update the paths to the file in your code yourself; see [Renaming, moving and deleting files](#renaming-moving-and-deleting-files). |
