---
title: Ponteo
slug: ponteo
summary: US dental marketplace app — Firebase auth, Stripe payments, Checkr verification, Socket.io live sync, Agora + Intercom support chat, maps, and on-device ML — ~10 months.
stack:
  - react-native
  - typescript
  - javascript
  - firebase
  - stripe
  - socket-io
  - agora
  - intercom
  - google-maps
  - apple-maps
  - ml-kit
  - push-notifications
  - biometric-auth
  - keychain
role: Software Engineer – React Native
links:
  repo: null
  demo: null
featured: true
order: 1
---

## Overview

Ponteo is a US-based dental marketplace I built on React Native — connecting patients and dental professionals with secure auth, payments, background checks, live data, chat, and maps.

## Highlights

- Phone-number login alongside Firebase Google/Apple sign-in, with React Native Keychain/Keystore for secure token storage
- Biometric auth (Face ID / Touch ID) that cut login time ~50% (4s manual entry → 2s) and removed password entry as an attack surface
- Stripe for in-app payments and Checkr for automated background verification of dental professionals
- On-device caching + Socket.io live sync so the UI updates as data changes — no more waiting on pull-to-refresh
- Real-time in-app chat via Agora, plus Intercom for customer support
- Google Maps, Apple Maps, Waze, and Google Places Autocomplete for location search and navigation
- On-device ML Kit for automatic profile-picture background removal
- Firebase / Notifee push notifications
