---
title: UI elements
description: The kinds of UI element, what they all share, and which draws on top
---

# UI elements

A UI element is one thing drawn in a user interface: a box, a line of text, a button. Every UI element is an [instance](../engine/instance-tree.md): it has a name, a parent and children, shows in the Explorer, and scripts work with it as they do with a part.

## The UI classes

UI classes build on one another: a [`UIButton`](api:UIButton) is a [`UITextPanel`](api:UITextPanel), which is a [`UIPanel`](api:UIPanel). Everything a class higher up can do, the classes below it can do too. [`UIObject`](api:UIObject), [`UIShape`](api:UIShape) and [`UILayoutContainer`](api:UILayoutContainer) are base classes: `new UIObject()` stops the script with an error.

| Class | Use it for |
|---|---|
| [`UIPanel`](api:UIPanel) | A box: frames, bars, cards, backgrounds, invisible containers. |
| [`UITextPanel`](api:UITextPanel) | Text: labels, titles, scores, messages. |
| [`UIButton`](api:UIButton) | Something the player clicks. |
| [`UITextInput`](api:UITextInput) | Text the player types: a name, a code, a chat line. |
| [`UICircle`](api:UICircle) | Round things: dots, avatars, progress rings, cooldown pies. |
| [`UIScrollPanel`](api:UIScrollPanel) | A list longer than its box: shops, inventories, logs. |
| [`UIBackgroundImage`](api:UIBackgroundImage) | A picture or icon, placed inside a panel or circle. |
| [`UIHorizontalLayout`](api:UIHorizontalLayout) | Arranging a row of elements for you. |
| [`UIVerticalLayout`](api:UIVerticalLayout) | Arranging a column of elements for you. |
| [`UIGridLayout`](api:UIGridLayout) | Arranging a grid of elements for you. |

## What a new element looks like

A new element is 64 by 64 pixels, solid white, at the top-left of its parent, and blocks the pointer. A new text panel is a 64 by 64 solid white box with black text at its top-left.

When text is cut off because the panel is still 64 by 64, set [`Size`](api:UIObject.Size), or `FitContents = UIContentFit.XY`. For a plain label, change three things: make the background invisible, fit the panel to its text ([size](position-and-size.md)), and stop it [taking clicks](buttons-and-pointer.md).

## Example: A plain label

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a plain label: no box, sized to its text, and clicks pass through it.

```truscript
local screen = new ScreenUI() { Name = "LabelDemo", Parent = game.UICanvas }
local label = new UITextPanel() {
    Text = "Round 1",
    TextSize = 28,
    TextColor = Color4.FromHex("#FFFFFF"),
    Color = new Color4(0, 0, 0, 0),         # invisible background
    FitContents = UIContentFit.XY,          # as big as the text
    BlocksPointer = false,                  # do not swallow clicks
    Position = new Vector2(24, 24),
    Parent = screen
}
```

## Color and border

[`UIShape`](api:UIShape) is the base of everything filled with a color: panels, text panels, buttons, text boxes, scroll panels and circles. [`Color`](api:UIShape.Color) is the fill color. If the shape has a background image, `Color` tints the image instead; white leaves the image unchanged.

Every [`Color4`](../engine/data-types.md) channel above `1` is limited to `1`, so `new Color4(88, 204, 96)` is plain white. Use `Color4.FromHex("#FF0000")` when you have a hex code. For a container that should not be seen, give it a fully transparent color: `Color = new Color4(0, 0, 0, 0)`.

[`BorderWidth`](api:UIShape.BorderWidth) is the thickness of the border in pixels. `0` means no border. [`BorderPlacement`](api:UIShape.BorderPlacement) is where the border sits relative to the element's edge. A UI border is only a drawing: it never changes the element's size or pushes neighbors away.

## Panels, text and buttons

[`UIPanel`](api:UIPanel) is a rectangle, the basic building block of every interface. It adds rounded corners and a style to [`UIShape`](api:UIShape). A panel's [`Style`](api:UIPanel.Style) `None` is a flat fill; `FrostedGlass` blurs what is behind the panel.

[`UITextPanel`](api:UITextPanel) is a panel with text drawn over its fill: every panel property plus the [text properties](text.md). [`UIButton`](api:UIButton) is a text panel that can be pressed. It adds [`Pressed`](api:UIButton.Pressed), [`Disabled`](api:UIButton.Disabled) and [`AutoTintColor`](api:UIButton.AutoTintColor).

## Circles

A square [`Size`](api:UIObject.Size) gives a [`UICircle`](api:UICircle) a true circle; a non-square one gives an ellipse. [`Ratio`](api:UICircle.Ratio) hollows a `UICircle` into a ring, with the hole's edge at this fraction of the outer edge: `0` is a full disc, `0.9` a thin ring. [`ArcSweep`](api:UICircle.ArcSweep) is how far the circle's shape runs clockwise from [`ArcStart`](api:UICircle.ArcStart), in degrees: `360` is the whole circle and `0` draws nothing.

## Images

[`UIBackgroundImage`](api:UIBackgroundImage) is not an element: it has no position or size of its own; see [Images](images.md).

## Nesting

A UI child is positioned relative to its parent, and moves, hides and fades with it. That is how a window is built: one panel for the frame, and everything else inside it; see [Layout containers](layout-containers.md).

## Drawing order

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, draws three overlapping squares. They are created in the order red, green, blue, so blue would be on top. Giving red a higher [`ZIndex`](api:UIObject.ZIndex) brings it to the front.

```truscript
local screen = new ScreenUI() { Name = "OrderDemo", Parent = game.UICanvas }
local colors = ["#FF4444", "#44CC66", "#3366FF"]
local squares = []

for i in range(3):
    local square = new UIPanel() {
        Name = "Square" + i,
        Size = new Vector2(120, 120),
        Position = new Vector2(40 + i * 50, 40 + i * 50),
        Color = Color4.FromHex(colors[i]),
        Parent = screen
    }
    squares.push(square)

squares[0].ZIndex = 1       # red is now in front of green and blue
```

Between different [`ScreenUI`](canvas-and-screenui.md#stacking-screens-with-displayorder) objects, `ZIndex` means nothing.

To change the order among UI siblings from a script without touching `ZIndex`, use [`MoveBefore`](api:Instance.MoveBefore) or [`MoveAfter`](api:Instance.MoveAfter).

## Troubleshooting

| What you see | Fix |
|---|---|
| A text label has a white box behind it. | Give it a fully transparent color: `Color = new Color4(0, 0, 0, 0)`. See [Panels, text and buttons](#panels-text-and-buttons), [What a new element looks like](#what-a-new-element-looks-like) and [Color and border](#color-and-border). |
| Text is cut off. | Set [`Size`](api:UIObject.Size), or `FitContents = UIContentFit.XY`. See [What a new element looks like](#what-a-new-element-looks-like). |
| An error says the symbol [`UIObject`](api:UIObject) is not defined: `Symbol 'UIObject' is not defined` | See [The UI classes](#the-ui-classes). |
