---
title: Text
description: "Show text: fonts, sizes, color, alignment, wrapping and rich text"
---

# Text

Text in a UI is shown by a [`UITextPanel`](api:UITextPanel). A [text panel](ui-objects.md#what-a-new-element-looks-like) is a panel with words drawn on it: it has a fill color, a border and rounded corners like any [panel](api:UIPanel), plus its text properties. A [`UIButton`](api:UIButton) is a text panel too, so everything about text panels applies to button labels. For [text the player types](text-input.md), there is a text box.

## Readable text over the game

By default text is black on a white box: on a dark game scene you will usually want white text and no box. The default [`TextSize`](api:UITextPanel.TextSize) is comfortable for body text in a tool but small for a game.

[`StrokeWidth`](api:UITextPanel.StrokeWidth) is the thickness in pixels of an outline around the letters. `0` is no outline. The default [`StrokeColor`](api:UITextPanel.StrokeColor) is white. With the default black text that gives a white halo. For white text, set a dark `StrokeColor`.

The outline does not change the size the text is measured as, so [`FitContents`](api:UIObject.FitContents) does not make a panel bigger for the outline. So an outlined label whose panel hugs its text, or whose text touches the panel's edge, loses part of its outline. Give an outlined label's panel [`Padding`](api:UIObject.Padding) of at least the `StrokeWidth`.

## Fonts

[`FontName`](api:UITextPanel.FontName) chooses the font from a fixed list. Each [`FontName`](api:FontName) value is one font file, so a bold weight is its own value (`LexendBold`) rather than a separate setting.

## Alignment

[`TextAlignment`](api:UITextPanel.TextAlignment) and [`TextVerticalAlignment`](api:UITextPanel.TextVerticalAlignment) place the text inside the panel's content area, the panel minus its [`Padding`](api:UIObject.Padding). A new [`UITextPanel`](api:UITextPanel) starts with `TextAlignment` `Left` and `TextVerticalAlignment` `Top`.

Alignment only shows when the panel is bigger than its text: a panel that fits its text exactly on an axis has no room to align within on that axis.

## Lines and wrapping

By default text stays on one line however long it is (apart from `\n` line breaks you wrote yourself). Set `WrapText = true` to break text onto more lines where it would be wider than the panel.

## Making text and panel agree

There are two ways to make text and panel agree: the panel follows the text, with [`FitContents`](position-and-size.md#fitting-to-contents); or the text follows the panel, which has a size you set, and [`TextOverflow`](api:UITextPanel.TextOverflow) decides what happens to text that does not fit.

A panel that is as wide as its text never needs to wrap, so the text stays on one line. Do not combine [`WrapText`](api:UITextPanel.WrapText) with `FitContents` on `X`.

| [`FitContents`](api:UIObject.FitContents) | Use it for |
|---|---|
| `XY` | The panel is exactly as big as the text, plus [`Padding`](api:UIObject.Padding). Use it for labels, chips, tags, counters, anything on one line. |
| `Y` | You set the width (`Size.X`, anchors, or a layout) and the height follows the text. Turn on [`WrapText`](api:UITextPanel.WrapText). Use it for paragraphs, descriptions, chat lines. |
| `X` | You set the height and the width follows the text. Use it for buttons and tabs of a fixed height. |

## Text that does not fit

When a panel of fixed size is too small for its text, [`TextOverflow`](api:UITextPanel.TextOverflow) decides what you see. Text overflow is a drawing choice only. It never changes the panel's size or the layout around it.

| TextOverflow | Text that does not fit |
|---|---|
| `Clip` | Cut off at the panel's edge. This is the default. |
| `Ellipsis` | Shortened, and the last line that fits ends in an ellipsis (three dots). |
| `Visible` | Drawn anyway, spilling out past the panel's edge. Only an ancestor with [`ClipsChildren`](api:UIObject.ClipsChildren) can cut it. |

## Rich text

With `RichText = true`, parts of the text can have their own color, marked with *tags* in square brackets inside [`Text`](api:UITextPanel.Text), as in `[color=#FF8800]this part is orange[/color]`. Rich text tags are not shown.

There is one rich text tag, `color`: no bold, italic, size, font or outline tags exist. The outline, the font and the size are the same for the whole panel.

In rich text, write `[[` wherever you want an opening square bracket to show. A closing `]` needs nothing special.

Any `[` a player typed in a name or message that goes into a rich text panel could be read as a tag: a player called `[color=#00000000]` would make text vanish.

Pass everything that your script did not write itself through [`RichText.Escape`](api:RichText.Escape) before it goes into a rich text panel.

> [!WARNING]
> Text that came from a player (a typed name for a pet, a chat line, a sign) must be [filtered](../gameplay/chat.md) before it is shown to other players.

## Example: A chat line with a blue name

This client script, attached to a [`UITextPanel`](api:UITextPanel) inside a [`ScreenUI`](api:ScreenUI) in `game.UICanvas`, shows "Name: message" with the name in blue. Both pieces come from players, so both are escaped.

```truscript
this.RichText = true
this.WrapText = true
this.FitContents = UIContentFit.Y

func show_line(player_name, message):
    this.Text = "[color=#A0E6FF]" + RichText.Escape(player_name) + ":[/color] " + RichText.Escape(message)

show_line("Ann", "has anyone seen the [red] key?")
# Shown as:  Ann: has anyone seen the [red] key?   with "Ann:" in light blue.
```

## Troubleshooting

| What you see | Fix |
|---|---|
| `WrapText` does nothing. | Do not combine `WrapText` with `FitContents` on `X`; with `FitContents` `Y`, you set the width and turn on `WrapText`. See [Making text and panel agree](#making-text-and-panel-agree). |
| The outline is cut off at the edges. | Give an outlined label's panel `Padding` of at least the `StrokeWidth`. See [Readable text over the game](#readable-text-over-the-game). |
| Square brackets disappear, or text changes color unexpectedly. | Pass everything that your script did not write itself through `RichText.Escape` before it goes into a rich text panel. See [Rich text](#rich-text). |
