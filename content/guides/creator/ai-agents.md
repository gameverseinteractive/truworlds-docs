---
title: Working with an AI agent
description: Connect an AI coding agent to TruWorlds Creator
---

# Working with an AI agent

Connect agent, on the right side of the ribbon's tab row, opens the Connect an agent window. The Connect an agent window lists the agents it can set up for you, Claude (desktop app), Claude Code, Cursor, VS Code, Codex and Gemini CLI, each with a status such as Connected, "Found on this computer", "Not found on this computer" or "Couldn't check". Connected agents are listed first, then the ones found on your computer.

## Connecting an agent

In the Connect an agent window, click Connect next to your agent. When the agent shows Connected, follow the short instruction under it, for example "Start a new Claude Code session." or "Quit Claude completely and open it again, then start a new chat."

An agent session or chat that was already running when you connected the agent does not get the TruWorlds tools. When your agent can't find the TruWorlds tools, start a new session or chat in it, or restart the agent.

> [!NOTE]
> Details shows how to check the agent's connection, for example "To check, run claude mcp list in a terminal."

| Button | When it appears and what it does |
|---|---|
| Set up anyway | Appears on an agent's row when the agent was not found on this computer. It sets the agent up anyway, for example if it is installed somewhere TruWorlds Creator did not look. |
| Replace | Appears on an agent's row when the agent is "Set up for a different TruWorlds Creator connector". It replaces the old connection with this TruWorlds Creator's. |
| Try the other way | Appears on an agent's row when the first way of connecting failed, or the agent did not open from the link. It sets the agent up a different way. |
| Disconnect | Appears on an agent's row when the agent is connected, or set up for a different TruWorlds Creator connector. It removes the TruWorlds connection from the agent, and the agent's other settings are kept. |
| Details | Always appears on an agent's row. It shows what TruWorlds Creator found, such as the agent's settings file and what the change would be. Hide details hides it again. |

## Other agents

For an agent that is not in the list, click Show setup text on the Other agents card of the Connect an agent window. Any other agent that supports MCP can be set up by hand with the setup text.

## Working in your world

To work with an agent you need TruWorlds Creator, with the world you want the agent to work in open. When the agent says TruWorlds Creator is not running, or that no world is open, open TruWorlds Creator and the world you want, then ask the agent to try again.

An agent appears on the Connect agent button only after it first works with your open world, not as soon as its session starts.

When agents can't connect to a TruWorlds Creator window, Settings > Agents says so, and the ribbon shows no Connect agent button. When agents can't connect to the TruWorlds Creator window, restart TruWorlds Creator, and try restarting your agent app too. If it keeps happening, send the log, which File > Open Logs Folder opens.

## Troubleshooting

| What you see | Fix |
|---|---|
| Your agent can't find the TruWorlds tools, and the agent button still says Connect agent. | Start a new session or chat in your agent, or restart it: [Connecting an agent](#connecting-an-agent), [Working in your world](#working-in-your-world). |
| The agent says TruWorlds Creator is not running, or that no world is open. | Open TruWorlds Creator and the world you want, then ask the agent to try again: [Working in your world](#working-in-your-world). |
| Settings > Agents says agents can't connect to this window, and there is no Connect agent button: `Agents can't connect to this window right now.` | Restart TruWorlds Creator, and try restarting your agent app too. If it keeps happening, send the log, which File > Open Logs Folder opens: [Working in your world](#working-in-your-world). |
