---
title: Ribbon and inserting
description: The ribbon's tabs and buttons, and where a newly inserted object goes
---

# Ribbon and inserting

The ribbon is the band of buttons under the menu bar. It has four tabs, Home, Model, UI and Script, each divided into labeled groups. A ribbon button is usually grayed out because nothing suitable is selected: Resize, for example, needs a part.

## The Home and UI tabs

Part, in the Home tab's Insert group, inserts a [block](../building/parts.md); its arrow offers Block, Sphere, Cylinder and Wedge.

The Home tab's Panels group has toggles that show or hide the Explorer, Worlds, Properties, Assets (the Asset Library) and Console (the Script Console) [panels](interface-overview.md#panels-and-docks).

The ribbon's UI tab is for [on-screen](ui-editor.md) and in-world user interface.

## The Insert panel

The Insert panel is a searchable list of every kind of object you can create. Open the Insert panel from its icon in the left icon strip. Type in the Insert panel's Search field to filter the list by name.

## Where a new object goes

Inserting creates a new instance, puts it somewhere in the tree, and selects it. The ribbon, the Insert panel and the Explorer's [Insert Object](explorer.md) menu put a new object in the same place.

Some kinds of object always go to their own home, whatever is selected: a [ScreenUI](api:ScreenUI) goes into the [UICanvas](api:UICanvas), a sky into [Lighting](api:Lighting). An inserted object whose kind has no fixed home goes under the first selected instance. If nothing is selected, or the first selected instance is one of [the world's systems](explorer.md#the-systems), an inserted object goes into the [World](api:World).

An inserted object goes into the `World` even when the selected system could hold it: a [Folder](api:Folder) inserted with [Storage](api:Storage) selected appears in the `World`. After inserting a `Folder` with `Storage` selected, drag it into `Storage` in the Explorer.

A [Part](api:Part) or [MeshPart](api:MeshPart) is never inserted inside another such object: with a part selected, a new part becomes its sibling, in the same model, folder or the `World`. Lights, fire, particle emitters, attachments and constraints inserted with a part selected become that part's children. When a new part landed inside a model you did not intend, press Ctrl+Z, clear the selection with Esc, and insert again to put it in the `World`.

## Where a new part appears

A new part appears in front of the camera, at the center of the viewport. A new part is placed against the surface at the center of the view if it is within reach: on top of the ground or a top face, or beside a side face. A new part's position is rounded to the [move step](transform-tools.md) along the surface, so on flat ground it lines up with the grid.

If the camera looks straight ahead at the horizon, new parts appear floating in front of it.

## Troubleshooting

| What you see | Fix |
|---|---|
| A new part appeared inside a model you did not intend. | Press Ctrl+Z, clear the selection with Esc, and insert again to put it in the [World](api:World); see [Where a new object goes](#where-a-new-object-goes). |
| A new [Folder](api:Folder) went into the [World](api:World) although [Storage](api:Storage) was selected. | Drag it into [Storage](api:Storage) in the Explorer; see [Where a new object goes](#where-a-new-object-goes). |
