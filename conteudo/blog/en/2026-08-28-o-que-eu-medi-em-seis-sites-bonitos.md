---
titulo: What I measured in six beautiful websites
data: 2026-08-28
tag: bastidor
resumo: I turned down my own home page and couldn't say why. I downloaded six
  portfolios I thought were beautiful and counted their CSS. Three numbers
  explained the rest.
capa: capa.webp
capaAlt: Wooden movable type scattered across a work surface
formato: largo
publicado: true
---

I rebuilt this site in August. The first version of the home page was turned
down, and the person who turned it down was me.

What I managed to say at the time was this:

> It's raw. It looks like we grabbed ready-made components, dropped them on the
> page and called it done. Nothing really ties together.

**"Raw" is not a diagnosis.** It's enough to reject something and no use at all
for fixing it.

So I downloaded six portfolios I thought were beautiful and stopped describing
how I felt looking at them. I counted the CSS.

Three numbers explained the rest.

## 1. A middling radius is the signature of an off-the-shelf template

I ran a `border-radius` count on each one:

- **viper:** `0px` dominates, **28 occurrences**. There is no middling radius
  anywhere. The cards are square.
- **bungee:** same choice by another route. `0px` dominates, and what is round is
  `500px`, the arc on top of the hero columns.
- **mine:** `20px` on the card, `24px` on media, `28px` on the section.

Either zero or extreme. I had three middling values, all different from each
other, and **not one of them chosen for a reason I could explain.**

They came bundled with the components, and that is exactly what gives it away: a
middling radius on everything is what's left over when nobody decided anything
about form.

::margem
The rule that came out of it: content is square, round only where it's an accent.
The card and media tokens went to zero in the same commit.
::

## 2. The scale has no middle. Mine was nothing but middle.

I counted every `font-size` in viper. The result has a hole in the middle:

| Band | Sizes found |
|---|---|
| **Display** | 82 (13×), 128 (6×), 80, 88, 90, 110, 148, 200, 260 |
| **Label** | 11 (9×), 12 (2×), 10, 13, 14 |
| **Body** | 15, 16, 17, 18 |
| **Between 20 and 80** | almost nothing. A stray 32, 40 and 48, all in secondary context |

My scale was hero 128, data 128, panel 72, manifesto 64, sentence 44, body 17,
label 14.

**A whole middle between 44 and 72**, which is precisely the band the reference
doesn't use.

There is a second number in the same place, and it is subtler. Viper tightens
`-10px` on a 128px display, which is **-0.078em**. Mine tightened **-0.032em**:
less than half. It is part of why the big headline read soft on screen even at
the right size.

A typographic middle is the visual signature of components slotted in without a
conversation. One block asks for 44, another asks for 56, nobody compares the
two, and the page ends up with seven sizes that form no ladder at all.

## 3. Wide page, narrow text

Viper locks two things in places that are far apart:

- **container:** 1800px
- **text measure:** 809px

Mine locked the container at 1440 and the measure at 1000. Two mistakes in the
same direction, and they add up:

- on a 1920 screen, their content takes 1800 and mine took 1440. That is where
  the feeling of a narrow box in the middle of the monitor came from;
- and their paragraph stops at 809 while mine ran to 1000, so **the text read
  wide inside a narrow page.**

::destaque
White space doesn't convince by being plentiful. It convinces when the page is
wide, the text is narrow, and the difference between the two is visibly chosen.
::

With a narrow container and wide text, the white becomes whatever didn't fit.

## What measuring doesn't solve

Bungee and viper are beautiful partly for a reason that isn't in the CSS: **the
assets are stock art.** 3D renders, fashion, gradients, a macro shot of a leaf.

A UX portfolio has dashboards and system screens.

Copying the treatment without having the material gives you a nice frame around a
dull photo, and I had to write that down before starting, or I would have spent a
week reaching the same conclusion the expensive way.

The way out is to turn screens into images:

1. **a crop with no device frame**, right up against the content;
2. **a big zoom on one detail** — a chart, an error state, a cell;
3. **a short screen recording on a loop**, with the prototype actually being used.

Four seconds of a flow working are worth more than ten screenshots.

## The order I rebuilt in

The rejected attempt was assembled section by section, each one solving its own
problem. That is what produced the collection of loose components.

The second time round **the grammar came before the sections:**

- a second typeface, monospace, only for the section chrome;
- a scale with no middle, five steps and no more;
- a radius policy, zero or extreme;
- a section header as a fixed five-part component;
- three motion primitives repeating across the whole page.

Only after that did I build a single fold.

## The three numbers this page produced on its own

The blog you are reading went live today, and it turned up three more
measurements I would never have caught by eye:

**302.** The folder holding the posts' JSON was called `blog`, same as the route.
The server saw a directory with that name and redirected before any fallback. The
whole listing disappeared behind a redirect.

**180px.** In the three-column grid, one portrait card next to two square ones
opened that much of a hole in the row, because a grid row is as tall as its
tallest item. The varying aspect ratio per card, which was the pretty idea copied
from bungee, died right there.

**4.57:1.** The numbered index in the phone menu was at 45% white over `#0B0B0C`.
It failed axe at 12px. At 60% it gives 7.06:1 and passes comfortably.

None of the three shows up by looking at the screen.

Measuring is not the opposite of having taste. It is what turns taste into an
argument that survives a meeting, and a second reading the following Tuesday.
