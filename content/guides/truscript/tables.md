---
title: Tables
description: "Key-value collections: keys, iteration, nesting and the table library"
---

# Tables

A table is TruScript's general-purpose record and dictionary. A *table literal* lists `key = value` entries between braces, separated by commas: `{ name = "Ada", score = 0 }`. A bare name on the left of `=` in a table literal is the text of that name, not a variable: `{ name = "Ada" }` has the string key `"name"`.

The separator between key and value in a table literal is `=`. `{ name: "Ada" }` is a compile error. Write `=` between each key and its value. To use a variable's value as a key, create the table first and assign with brackets.

## Reading and writing entries

`t.name` and `t["name"]` reach the same entry. Bracket access works for every key: a string with spaces, a number, a value held in a variable.

This script reads an entry with bracket access, also with the key held in a variable, and writes and reads a key that has a space in it.

```truscript
local player = { name = "Ada" }
print(player["name"])           # Ada   (identical to player.name)

local field = "name"
print(player[field])            # Ada   (the key comes from a variable)

player["favorite color"] = "teal"
print(player["favorite color"])      # teal
```

It prints `Ada`, then `Ada`, then `teal`.

Reading a table key that does not exist is not an error: it gives `nil`. A misspelled key does not stop the script: `player.scroe` is `nil`, and the mistake shows up later, for example as an error about adding `nil` and a number. When a missing or misspelled key is used in arithmetic, use `(t[key] or 0) + 1`.

## Keys

The number `1` and the string `"1"` are different table keys. Arrays, tables, functions, instances and data-type values used as keys are matched by identity: only the very same object finds the entry again.

Because any value can be a key and instances are matched by identity, a table keyed by instance attaches script-side data to players or parts without adding anything to the world.

## The table library

A table has no properties or methods of its own: every `t.something` looks up the key `"something"`, and `t.length` and `t.count` are key lookups too. Use the `table` library: `table.count(t)`, `table.keys(t)`, `table.has(t, key)`.

> [!WARNING]
> Assigning `nil` to a key does not remove it: the key stays with the value `nil`, still counts, still shows up in loops and [table.keys](api:global/table.keys), and [table.has](api:global/table.has) still says `true`. To remove an entry, call `table.remove(t, key)`.

| Function | What it does |
|---|---|
| [table.count](api:global/table.count) | `table.count(t)` gives the number of entries. |
| [table.has](api:global/table.has) | `table.has(t, key)` tells whether `key` is present, even if its value is `nil` or `false`. |
| [table.keys](api:global/table.keys) | `table.keys(t)` gives a new array of the keys, in no guaranteed order. |
| [table.map](api:global/table.map) | `table.map(t, fn)` gives a new table with the same keys, each value replaced by `fn(value, key)`. `t` is unchanged. |
| [table.remove](api:global/table.remove) | `table.remove(t, key)` removes the entry. It does nothing if the key is not present. |

## Order and loops

A table has no defined order: a loop, [table.keys](api:global/table.keys), [table.values](api:global/table.values) or [print](api:global/print) can show entries in a different order from the one you added them in, and the order can change after entries are removed and added.

A `for` loop over a table gives you each key, in no guaranteed order. In a `for` loop over a table, use the key to read the value. When order matters, sort the keys (`for key in table.keys(t).sort():`), or keep the order in an array next to the table (an array of keys, or an array of records).

A `for` loop visits the entries a table held when it started; see [Changing what a for loop visits](control-flow.md#changing-what-a-for-loop-visits).

## Shared tables and nesting

A table is shared, not copied, when you assign or pass it; see [Copied or shared](value-types.md#copied-or-shared).

> [!WARNING]
> Handing every player the same template table is a classic bug: one player's purchase changes everybody's inventory. Always copy.

[table.map](api:global/table.map) with a function that returns the value unchanged makes a *shallow* copy: a new table with the same keys and values. Inner tables and arrays are still shared. When your data has a known shape, copy each level explicitly.

Reading through a missing table entry is an error, because the first read gives `nil` and `nil` has no members. Create intermediate tables before you write into them.

## Functions in a table

A function stored in a table does not automatically receive the table. There is no `self` or `this` for tables.

If a function stored in a table needs the table, pass it in, or build the table inside a function so that its functions can reach shared locals. See [shared locals](closures.md#private-state).

## Troubleshooting

| What you see | Fix |
|---|---|
| An error says addition is not supported between nil and a number: `Addition is not supported between types 'nil' and 'number'.` | Use `(t[key] or 0) + 1`. See [Reading and writing entries](#reading-and-writing-entries). |
| A compile error says `=` was expected between key and value in a table literal: `Expected '=' between key and value in table literal` | Write `=` between each key and its value. See [Tables](tables.md). |
