---
title: Asset Library
description: Assets in your TruWorlds account, asset ids, and prefabs
---

# Asset Library

The Asset Library holds meshes, images, sounds, animations and prefabs stored in your TruWorlds account. [Meshes](../building/meshes.md), [images](../building/surfaces-and-textures.md), [sounds](../environment/sound.md) and [animations](../animation/animation-clips.md) are uploaded to your TruWorlds account, and your world refers to them by id. If the Asset Library panel is not showing, click Assets in the Panels group of the ribbon's Home tab.

## Asset ids

Every asset gets an id such as `asset://123456`.

## Publishing a prefab

You can take a model out of one world and use it in another. A model published to your Asset Library becomes a prefab, which you (and, if you share it, others) can insert into any world.

Any selection can be published as a prefab: one selected object is published as itself, and several are published together inside one [Model](api:Model) named after the Name you give. You must be signed in to publish to the Asset Library.

To publish something you built as a prefab, so you can reuse it, first select the objects in the Explorer or the viewport. Right-click the selection in the Explorer and choose Publish to Asset Library... to add it to your Asset Library as a prefab.

In the Publish to Asset Library window, the Name starts as the first selected object's name, and a Description is optional. Leave Share with everyone off to keep the prefab private, or turn it on to share it. A shared prefab can be found and used by anyone after it passes review.

Click Publish to publish the prefab. When publishing is done, the window closes and the prefab appears in the Asset Library panel under My Assets, in the Prefabs category. My Assets shows everything you have uploaded or published, shared or private.

A newly published prefab is reviewed: its tile shows In review until it is approved. You can insert it in your own worlds while it is in review.

## Inserting a prefab in another world

Double-clicking a prefab places it in front of the camera. Dragging it into the viewport shows a preview that follows the pointer; drop to place it there.

When you place a prefab made by someone else that contains scripts, TruWorlds Creator asks first. You are not asked about scripts for your own prefabs or for prefabs without scripts.
