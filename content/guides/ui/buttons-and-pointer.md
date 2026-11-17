---
title: Buttons and the pointer
description: Which element gets the pointer, hovering, clicking, and buttons
---

# Buttons and the pointer

Once per frame TruWorlds picks the single UI element under the pointer: of the elements that have `BlocksPointer = true`, are visible (with everything above them) and contain the pointer (allowing for [`Scale`](api:UIObject.Scale), [`Rotation`](api:UIObject.Rotation) and clipping by ancestors), the one [drawn in front](ui-objects.md#drawing-order). It follows that only the front element hears anything: a click is not passed up from a child to its parent.

## BlocksPointer

Every new element blocks the pointer, including invisible containers, layout containers and plain labels. An element with a fully transparent [`Color`](api:UIShape.Color), or with `Transparency = 1`, still takes the pointer. Only `Visible = false` or `BlocksPointer = false` takes an element out of the running for the pointer.

A label on top of a button steals the click unless the label has `BlocksPointer = false`.

| For | BlocksPointer |
|---|---|
| Text, icons and decoration on top of something clickable | Set [`BlocksPointer`](api:UIObject.BlocksPointer) to `false`. |
| Invisible containers and layout containers used only for arranging | Set [`BlocksPointer`](api:UIObject.BlocksPointer) to `false`. |
| HUD decoration over the game view (counters, crosshair, vignette) | Set [`BlocksPointer`](api:UIObject.BlocksPointer) to `false`. |

## Example: A button with a label on top

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, builds a button from parts: a colored button with a separate label on top. Without `BlocksPointer = false` on the label, the label would take the click and [`Pressed`](api:UIButton.Pressed) would never fire.

```truscript
local screen = new ScreenUI() { Name = "BlockDemo", Parent = game.UICanvas }

local button = new UIButton() {
    Text = "",
    Position = new Vector2(40, 40),
    Size = new Vector2(180, 56),
    Color = Color4.FromHex("#58CC60"),
    Roundness = 16,
    Parent = screen
}

local label = new UITextPanel() {
    Text = "Play",
    TextSize = 24,
    TextColor = Color4.FromHex("#FFFFFF"),
    TextAlignment = UITextAlignment.Center,
    TextVerticalAlignment = UITextVerticalAlignment.Center,
    Color = new Color4(0, 0, 0, 0),
    AnchorRight = 1,
    AnchorBottom = 1,
    Size = Vector2.Zero,
    BlocksPointer = false,                  # clicks go through to the button
    Parent = button
}

button.Pressed.Connect(func():
    print("Play pressed")
)
```

## UI in front of the world

While the pointer is over a blocking element, clicks and mouse-wheel scrolling do not reach the 3D world: [`ClickDetector`](api:ClickDetector) objects behind the UI are not clicked, and the [`MouseButtonPressed`](api:InputSystem.MouseButtonPressed) signal of [`InputSystem`](api:InputSystem) does not fire. `MouseButtonPressed` fires only for presses that UI did not take. [`GlobalMouseButtonPressed`](api:InputSystem.GlobalMouseButtonPressed) fires for every press, over UI or not. To ask whether the pointer is over any blocking UI right now, read `game.InputSystem.Mouse.IsOverUi`.

To stop clicks reaching the world behind a pop-up, put a full-screen panel behind it (it blocks the pointer by default). See [Input](../gameplay/input.md) for the mouse.

## Example: Clicking the world but not the UI

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, reacts to a left click on the world, but not to a click on a UI element.

```truscript
game.InputSystem.GlobalMouseButtonPressed.Connect(func(button):
    if button == MouseButton.Left and not game.InputSystem.Mouse.IsOverUi:
        print("Clicked the world")
)
```

## Hover

[`PointerEnter`](api:UIObject.PointerEnter) fires when an element becomes the element under the pointer. [`PointerExit`](api:UIObject.PointerExit) fires when an element stops being the element under the pointer.

`PointerEnter` and `PointerExit` fire only for elements with `BlocksPointer = true`.

Moving the pointer from a panel onto a blocking child of that panel fires `PointerExit` on the panel, even though the pointer is still inside the panel's rectangle. To keep a card highlighted while the pointer is anywhere on it, set `BlocksPointer = false` on the card's children, or accept that the children take over and handle them too.

## Example: A border on hover

This client script, attached to a [`UIPanel`](api:UIPanel) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, highlights the panel with a border while the pointer is over it.

```truscript
this.BorderColor = Color4.FromHex("#FFD93B")
this.BorderPlacement = UIBorderPlacement.Outset

this.PointerEnter.Connect(func():
    this.BorderWidth = 3
)

this.PointerExit.Connect(func():
    this.BorderWidth = 0
)
```

## UIButton and Pressed

A [`UIButton`](api:UIButton) is a text panel that turns press and release into one signal, [`Pressed`](api:UIButton.Pressed), and shows its state by changing color. `Pressed` fires once for a completed left click: the left button went down and came up again with the pointer on the button, and the button was not [`Disabled`](api:UIButton.Disabled) at either moment. `Pressed` fires on release, not on press.

Button and typing signals fire only on the player's device. Connect pointer and keyboard signals in a [client script](scripting-ui.md); see [Choosing a type](../scripting/script-types.md#choosing-a-type).

## Disabled buttons and tinting

With `Disabled = true`, [`Pressed`](api:UIButton.Pressed) does not fire; see [Trusting the client](../networking/trusting-the-client.md). A disabled button still blocks the pointer: a click on it does not fall through to what is behind it.

Unless [`AutoTintColor`](api:UIButton.AutoTintColor) is false, a button is drawn in a color worked out from its [`Color`](api:UIShape.Color).

## Example: A button with a cooldown

This client script, attached to a [`UIButton`](api:UIButton) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, makes a button with a three second cooldown.

```truscript
this.Text = "Use"

this.Pressed.Connect(func():
    this.Disabled = true
    for left in range(3, 0, -1):
        this.Text = "Wait " + left
        wait(1)
    this.Text = "Use"
    this.Disabled = false
)
```

## Building other controls

There is no checkbox, toggle, slider or dropdown class. Build checkboxes, toggles, sliders and dropdowns from the pieces you have.

## Example: A toggle button

This client script, attached to a [`UIButton`](api:UIButton) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, makes a two-state button.

```truscript
local on = false
local on_color = Color4.FromHex("#58CC60")
local off_color = Color4.FromHex("#8A8FA3")

func refresh():
    if on:
        this.Text = "Music: On"
        this.Color = on_color
    else:
        this.Text = "Music: Off"
        this.Color = off_color

this.Pressed.Connect(func():
    on = not on
    refresh()
)

refresh()
```

## Troubleshooting

| What you see | Fix |
|---|---|
| A label stops the button under it being clicked. | For text, icons and decoration on top of something clickable, set `BlocksPointer` to `false`. See [BlocksPointer](#blockspointer) and [What a new element looks like](ui-objects.md#what-a-new-element-looks-like). |
| A button does nothing in a server script. | Put scripts that drive on-screen UI on the UI element they control, as client scripts. See [Scripting UI](scripting-ui.md) and [Where a UI script goes](scripting-ui.md#where-a-ui-script-goes). |
| Clicking on the game world does nothing near your HUD. | For invisible containers and layout containers used only for arranging, set `BlocksPointer` to `false`. See [BlocksPointer](#blockspointer) and [UI in front of the world](#ui-in-front-of-the-world). |
| Clicks go through your pop-up to the world. | Put a full-screen panel behind the pop-up. See [UI in front of the world](#ui-in-front-of-the-world). |
| `PointerExit` fires while the pointer is still inside your panel. | Set `BlocksPointer = false` on the card's children, or handle the children too. See [Hover](#hover). |
