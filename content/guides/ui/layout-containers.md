---
title: Layout containers
description: Arrange children in rows, columns and grids
---

# Layout containers

A layout container places the elements inside it one after another, in order, with the spacing and alignment you choose. When you add, remove, hide or reorder a child, the rest move to suit.

## Rows, columns and grids

A layout container draws nothing, so it has no background color or border of its own. For a layout's look, put the layout inside a [`UIPanel`](api:UIPanel).

| Class | Arranges |
|---|---|
| [`UIHorizontalLayout`](api:UIHorizontalLayout) | Its children in one row, left to right. |
| [`UIVerticalLayout`](api:UIVerticalLayout) | Its children in one column, top to bottom. |
| [`UIGridLayout`](api:UIGridLayout) | Its children in a grid with a fixed number of columns, filling each row left to right. |

## Size is ignored inside a layout

Inside a layout container, an element's [`Position`](api:UIObject.Position), [`Pivot`](api:UIObject.Pivot) and [anchors](anchors.md) are kept but have no effect on placement: the container places it.

Inside a layout container [`Size`](api:UIObject.Size) is ignored. A child needs [`MinSize`](api:UIObject.MinSize), [`FitContents`](api:UIObject.FitContents) or [`FlexRatio`](api:UIObject.FlexRatio), or it has no length and cannot be seen. A layout child is as long as its `MinSize`, which is `(0, 0)` unless you set it.

A new [`UIButton`](api:UIButton)'s `Size` of `(128, 48)` is ignored in a layout, so the button is zero long. Give a `UIButton` in a column `MinSize = new Vector2(0, 48)`.

## Example: A column of menu buttons

This client script, attached to a [`Folder`](api:Folder) in `game.ScriptSystem`, makes a column of three menu buttons, 8 pixels apart.

```truscript
local screen = new ScreenUI() { Name = "MenuDemo", Parent = game.UICanvas }

local column = new UIVerticalLayout() {
    Name = "Menu",
    Position = new Vector2(40, 40),
    Size = new Vector2(220, 300),
    Spacing = 8,
    Parent = screen
}

for label in ["Play", "Shop", "Settings"]:
    local button = new UIButton() {
        Name = label,
        Text = label,
        MinSize = new Vector2(0, 48),       # 48 tall. The layout makes it as wide as the column.
        Parent = column
    }
```

## Three ways to give a child a length

There are three ways to give a layout child a length along the layout: [`MinSize`](api:UIObject.MinSize), [`FitContents`](api:UIObject.FitContents) and [`FlexRatio`](api:UIObject.FlexRatio). Use at least one.

| Property | Gives |
|---|---|
| [`MinSize`](api:UIObject.MinSize) | A fixed length in pixels: for buttons, rows, slots, icons. |
| [`FitContents`](api:UIObject.FitContents) | The length of the child's own contents: for labels, and containers that hug what they hold. |
| [`FlexRatio`](api:UIObject.FlexRatio) | A share of the space left over: for "take the rest", spacers and equal-width columns. |

## Order

A layout container arranges only its direct child elements, in the order they appear in the tree. Children are placed in the order the Explorer lists them: the first is at the left of a row, the top of a column, or the top-left of a grid.

## Spacing and alignment

[`Spacing`](api:UILayoutContainer.Spacing) is the gap in pixels between neighboring children, never before the first or after the last. [`CrossAlign`](api:UILayoutContainer.CrossAlign) `Stretch`, the default, makes each child fill the container across, ignoring the child's own cross size. [`MainAlign`](api:UILayoutContainer.MainAlign) is where the group of children sits along the layout when there is spare space: `Start`, `Center` or `End`.

When any child has a [`FlexRatio`](api:UIObject.FlexRatio) above zero, it swallows the spare space, and `MainAlign` has no visible effect.

## Sharing spare space with FlexRatio

[`FlexRatio`](api:UIObject.FlexRatio) is a child's share of the spare space along the layout; `0` takes none. Only the proportions matter.

A spacer is an empty, invisible element with `FlexRatio = 1` between layout children, which pushes the children after it to the far end.

## When children do not fit

A layout never wraps onto a second line or hides children: children that need more room than the container has run past its end (see [scroll panels](scroll-panels.md)).

## Grids

A [`UIGridLayout`](api:UIGridLayout) places children in cells, left to right, starting a new row after every [`Columns`](api:UIGridLayout.Columns) children. Each column is as wide as its widest child, and each row as tall as its tallest.

## Example: A grid of tiles

This client script, attached to a `UIGridLayout` that has a fixed width (for example Size (400, 300)), fills it with nine equal-width tiles, three per row, each at least 80 tall. [`FlexRatio`](api:UIObject.FlexRatio) shares spare height among the rows as well as spare width among the columns.

```truscript
this.Columns = 3
this.Spacing = 6
this.CrossSpacing = 6

for i in range(9):
    local tile = new UIPanel() {
        Name = "Tile" + i,
        MinSize = new Vector2(0, 80),
        FlexRatio = 1,
        Color = Color4.FromHex("#4682DC"),
        Roundness = 8,
        Parent = this
    }
```

## Layouts and the pointer

A layout container [blocks the pointer](buttons-and-pointer.md) by default, so an invisible row across the screen stops clicks reaching the world behind it. Set `BlocksPointer = false` on layout containers that only arrange things; the buttons inside still take clicks.

## Troubleshooting

| What you see | Fix |
|---|---|
| The children of a layout are invisible. | Give each child at least one of `MinSize`, `FitContents` or `FlexRatio`. See [Size is ignored inside a layout](#size-is-ignored-inside-a-layout) and [Three ways to give a child a length](#three-ways-to-give-a-child-a-length). |
| A [`UIButton`](api:UIButton) in a column cannot be seen. | Give a [`UIButton`](api:UIButton) in a column `MinSize = new Vector2(0, 48)`. See [Size is ignored inside a layout](#size-is-ignored-inside-a-layout). |
| Clicks do not reach the world near a toolbar. | Set `BlocksPointer = false` on layout containers that only arrange things. See [Layouts and the pointer](#layouts-and-the-pointer). |
