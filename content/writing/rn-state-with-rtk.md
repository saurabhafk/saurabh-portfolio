---
title: Shipping reliable React Native state with Redux Toolkit
slug: rn-state-with-rtk
summary: How I use Redux and Redux Toolkit in dispatcher and consumer apps I've shipped.
tags:
  - redux-toolkit
  - redux
  - react-native
publishedAt: 2024-11-01
---

Across projects like **Loginext Dispatcher**, **Ponteo**, and **Yeether**, predictable client state mattered as much as polished UI.

I've used **Redux** and **Redux Toolkit** for complex mobile state — forms, sync-heavy screens, and multi-feature apps — alongside Context API where lighter shared state was enough.

The pattern that stuck for me: keep slices domain-focused, push API concerns behind clear services, and measure performance when lists, maps, and charts share the same screen.
