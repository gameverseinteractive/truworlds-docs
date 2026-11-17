---
title: Script editor
description: Write and fix code in the built-in script editor
---

# Script editor

The script editor is the code editor built into TruWorlds Creator. A script opens in a tab when you double-click its file in the [Asset Browser](asset-browser.md), click the script button on an object's row in the [Explorer](explorer.md), choose Edit Script from a script's menu in the [Properties panel](properties-panel.md), or create a new script.

## Indentation

Pressing Enter keeps the new line at the indentation of the line above, and indents one level further (four spaces) after a line that ends with `:`.

As you type this server script, attached to any [Part](api:Part), Enter indents the line after each line that ends with `:`.

```truscript
local count = 0
this.Touched.Connect(func(other):
    count = count + 1
    if count == 3:
        print("Touched three times")
)
# Output after the third touch: Touched three times
```

It prints `Touched three times` after the third touch.

In the script editor, Tab indents and Shift+Tab unindents, including every selected line; see [Syntax basics](../truscript/syntax-basics.md) for indentation in TruScript.

## Code completion

Code completion is the list of suggestions that appears under the caret as you type in the script editor. The completion list opens by itself when you start typing a name; after a `.`, to list members; after `new` and a space, to list classes you can create; after `=` and a space, to list values that fit.

Press Ctrl+Space to open the completion list yourself. It uses the Control key on every platform, including macOS.

If a name you expect is missing from the completion list after a `.`, it probably does not exist on that object.

## Signature hints

When you type the `(` of a function call, a signature hint above the line shows the function's parameters.

## Errors as you type

The script editor checks your code as you type. In the script editor, a line with a problem is given a colored background, red for an error and amber for a warning. An [error](../scripting/errors-and-debugging.md) in the script editor means the script cannot run as written, such as a missing bracket or bad indentation. The script editor shows a wrong member name as a warning while you type.

A script with an error does not stop the rest of the world: every other script starts normally.

## The Problems panel

While a script tab is active, the Problems panel is available in the bottom-left dock. The Problems panel's warning triangle icon is at the bottom of the left icon strip; clicking it, or Script > Debug > Problems, brings the panel in front of the Asset Browser.

The Problems panel lists every problem of the script you are editing, with its position. Click a row of the Problems panel to jump to that place in the script.

When a line is red but you cannot see why, open the Problems panel and read the message. The mistake behind a red line is often on the line above, such as a missing `:` or bracket.

## Errors when a playtest starts

When you start a [playtest](../playtesting/starting-a-playtest.md) and any script has errors, a Script Issues window says how many and asks whether to playtest anyway. In the Script Issues window, Continue starts the playtest anyway and Cancel goes back to fix the errors.

## Find, replace and Go to

Press Ctrl+F (Cmd+F on macOS) to open the find bar at the top right of the script editor. Find and replace searches only the script you have open.

Press Ctrl+G (Cmd+G on macOS) to open the Go to box at the top right of the script editor.

## Troubleshooting

| What you see | Fix |
|---|---|
| A line is red but you cannot see why. | Open the Problems panel and read the message; see [The Problems panel](#the-problems-panel). |
