---
title: Text input
description: Let players type into text boxes, and how keyboard focus works
---

# Text input

A [`UITextInput`](api:UITextInput) is a box the player types into. It is a panel (color, border, rounded corners, padding) with text inside.

## Reading what the player typed

A text box's [`Text`](api:UITextInput.Text) is what the box holds. Read it at any time; writing it replaces the contents. [`TextChanged`](api:UITextInput.TextChanged) fires whenever `Text` changes, with the new text. This includes every key the player types, and changes your script makes. [`Submitted`](api:UITextInput.Submitted) fires when the player presses Enter, with the current text.

The text of a text box is a single paragraph. Enter submits; it does not start a new line.

A text box does not clear itself. After `Submitted` the text is still there. Call [`Clear()`](api:UITextInput.Clear) if you want an empty box for the next entry, as a chat box does.

## Example: A name box

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a name box. It prints the name when the player presses Enter.

```truscript
local screen = new ScreenUI() { Name = "NameDemo", Parent = game.UICanvas }

local box = new UITextInput() {
    Name = "NameBox",
    Placeholder = "Name your pet",
    MaxLength = 16,
    TextSize = 20,
    Size = new Vector2(280, 44),
    Padding = new Vector2(12, 10),
    Roundness = 8,
    BorderWidth = 2,
    BorderColor = Color4.FromHex("#8A8FA3"),
    Position = new Vector2(40, 40),
    Parent = screen
}

box.Submitted.Connect(func(text):
    print("The pet is called " + text)
)
```

## Keyboard focus

Focus decides where typing goes. At most one element has focus at a time, and it receives the keyboard before anything else in the game does. Only a [`UITextInput`](api:UITextInput) can take focus. Focus is gained by the player clicking a text box, or by a script calling [`Focus()`](api:UIObject.Focus) on it.

## Keys while the player types

The game's own key handling does not see the key presses a focused text box takes: [`KeyPressed`](api:InputSystem.KeyPressed) does not fire for them, and the character does not walk when the player types W, A, S or D into a chat box. Escape is an exception to a focused text box taking the keys: it removes focus and then counts as an ordinary key press, so the same press also reaches the game and opens the TruWorlds menu.

The built-in interfaces listen to keys too: the / key opens the built-in chat and puts the keyboard focus in its entry field, and Escape opens the TruWorlds menu. If your own script reacts to a key the built-in interfaces use (to focus your own text box on /, for example), both things happen and the built-in one wins the focus. Choose a different key for your own shortcuts.

## Limiting what can be typed

[`MaxLength`](api:UITextInput.MaxLength) cuts, it does not reject. Typing stops at the limit. A paste or a script write that is too long is shortened to fit.

## Sending typed text to the server

What a player types or scrolls is not sent to anyone. `box.Text` on the server stays whatever the server set.

> [!WARNING]
> Whatever a player types exists only on their device until your script sends it. To use it in the game, send it to the server with a [`RemoteEvent`](api:RemoteEvent), and on the server [check its length and contents](../networking/trusting-the-client.md) before using it.

Always set a [`MaxLength`](api:UITextInput.MaxLength) on boxes whose text you send to the server.

## Troubleshooting

| What you see | Fix |
|---|---|
| The text box keeps its text after Enter. | Call `Clear()` if you want an empty box for the next entry, as a chat box does. See [Reading what the player typed](#reading-what-the-player-typed). |
