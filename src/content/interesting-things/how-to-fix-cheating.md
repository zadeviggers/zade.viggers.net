---
layout: ../../layouts/article-layout.astro
title: How To Fix Cheating*
order: 4
---

_\*In short offline games with an online leaderboard._

## Overview

We generate the game's randomness using a random number generator seeded with
the timestamp the game round started at. Then, we keep track of every action the
player takes during the game. Lastly, the server simulates the game using that
seed and action log and calculates the score in a trusted environment.

> Important note: This doesn't actually stop people from cheating - the games
> industry has been failing to do that for a very long time now. It stops people
> from uploading scores to an online leaderboard that they either cheated for,
> or just figuring out the API and submitting the biggest numbers the server
> will accept.

It's impractical to use this for a leaderboard of times. That would (most
likely) require you to simulate gameplay in real-time on the server or try (and
probably fail) to speed up the simulation while still calculating accurate
times. You could do it, but it would get quite expensive in either compute time
or engineer salaries trying to get accurate times from sped-up game simulations.

### You will need

- A single seed-able random number generator to supply all of your game's
  randomness
- A way to accurately log every action that the player makes in a way that can
  be replayed accurately. This is the hardest bit.
- A way to run your game on a server using a timestamped list of inputs.
- A big enough server to simulate a lot of games quite fast
- Games that don't take _too long_ to play

### Method

1. Use a single random number generator as the source of all randomness in a
   particular round of your game. Seed it with the timestamp that the player
   started their round at, plus an actual random number tacked on to the end
   (make sure you can separate out the timestamp later). Also, include the game
   version as another part of the random seed.

   The actual random number added to the timestamp stops two players who start a
   round at the same time from having the same exact game.

   Attaching the game version to the random seed means the server knows that the
   player was either using the same version of the game.

2. Keep track of every action the player takes that impacts the game and when
   exactly they did that action. You don't need to track every single opening
   and closing of a menu, but you should, for example, track all of their arrow
   key inputs in a platformer game.

   This might be a bit difficult and tedious, so do this only if you have too
   much free time or your game has a bad cheating problem.

3. Submit the random seed and action log to your server. The server should
   reject submissions when the timestamp part of the random seed is either in
   the future or from more than a certain amount of time ago (e.g. 4 hours or
   so).

   Also, make sure the game version in the random seed matches the version of
   the game on the server.

   The server now has to simulate the entire game just played, using the random
   seed and action log. Then, it can use the score it calculates on the
   leaderboard, which should be the same as the score the player got if they
   weren't cheating.

   An extension activity could be to accept many different game versions and
   simulate the game using that version, and track it in a separate leaderboard.

This only works in a pretty narrow scope, where cheating isn't an enormous
problem anyway, but I randomly had the idea so I wrote it down in case it's
useful.

Have a lovely day!
