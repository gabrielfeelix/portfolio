---
titulo: Watching somebody freeze on a screen I thought was obvious
data: 2026-08-29
tag: oficio
resumo: The company measured shipped features, and nobody had booked an
  interview. I went after the evidence where it already existed, and the first
  recorded session took apart a screen I considered finished.
capa: capa.webp
capaAlt: A tablet on a wooden desk showing a hand-drawn colour sketch of a landing page, next to glasses and a pen
formato: normal
destaque: true
publicado: true
---

I spent thirteen months at a group with five real-estate products, and
management measured output: a new feature counted for more than an improved one,
and a booked interview was time that showed up on nobody's delivery report.

In a house like that, waiting for the calendar to open up is waiting forever.

::frase
Evidence of use doesn't only come from a scheduled session. It is usually
already in the operation, written by hand, waiting for somebody to read it.
::

## The parallel spreadsheet is the operation written out by hand

The finance team ran reconciliation on a **parallel spreadsheet, every month**,
outside the system I was designing.

That was field research served up on the table. It just didn't go by that name,
and because it didn't, it wasn't on the list of things I couldn't do.

Every column somebody maintains outside the system is one thing the system
refused to do. On that spreadsheet were:

- **the real order of the steps**, which was not the order on the screen;
- **the nicknames** they gave each status, none matching the official label;
- **the fields they double-checked** before calling a number good;
- and **the exceptions**, noted down the side, in red, the way an exception always
  shows up: after it has already caused trouble once.

::margem
The module that came out of it had reconciliation with five statuses, acquirers
with different fees, taxes and payout terms from each other, and statement import
from several sources. The spreadsheet gave me the order. The brief gave me the
list.
::

::lado src=/volume/assets/projetos/locarmais/s2-origem-dos-dados.webp alt="Data-origin panel, with the platform record next to the gateway record" pos=direita
The hard part was never drawing those screens. It was deciding **the order they
appear in**, and what stays visible when the numbers don't agree.

Heavy business rules don't get solved with a pretty component: they get solved
by choosing what the person sees first at the moment something has gone wrong.
That is what the spreadsheet told me for free.
::

## The cheapest lesson in this profession costs eight seconds of silence

That is where I tested with a real user of the system. Not a colleague standing
in for one: **people who opened that screen to close the month.**

I interviewed. I recorded. I analysed.

And then I watched somebody freeze on a screen I had down as obvious.

She read the field label. Read it again. Hovered over it looking for a hint I
hadn't written. And sat still.

::destaque
Watching somebody stop on a screen you consider solved is the cheapest lesson
this profession sells.
::

It changed for good how I write a label and how I order fields. And it didn't
become a new opinion about microcopy: it became the memory of a silence in front
of a name I had chosen on my own, in a room, with the confidence of somebody who
had already understood the problem.

## In a meeting, a recording beats an opinion

On the next project, a hardware store, leadership wanted a minimal direction
focused on brand value. The behaviour on the site pointed the other way.

I watched the sessions **end to end**, no skipping, noting the exact point where
the person stopped moving forward. It is slow work and it is boring, and it is
what holds up everything else. Without it, the next meeting would have been my
opinion against leadership's opinion, and mine loses.

The heatmap of the landing page, across **798 clicks**:

| What got clicked | Clicks | Of the total |
|---|---:|---:|
| **Close the pop-up** (icon + area) | **182** | **22.8%** |
| Search field | 76 | 9.5% |
| Carousel next | 22 | 2.8% |
| **Buy** | **5** | **0.63%** |

Thirty-six times more people getting rid of the ad than buying.

The site asked for attention before offering anything, and people spent their
first gesture getting rid of it. The second most common gesture was searching. If
somebody arrives, closes the ad and goes straight to search, the next question
asks itself:

> What is that search returning?

## The store was charging you for spelling before it let you buy

Search was the main path, and not by a little: **71,416 sessions** used search in
the quarter. That is **43% of the total**, more than the 50,399 that opened a
product page.

I searched for *mouse*.

::figura src=/volume/assets/projetos/pcyes/busca-mouse.webp alt="Search results for mouse in the store, with mousepads taking the first positions" largura=larga
The storefront returned **mousepads ahead of mice**, in exactly the line the
company invested most in. The engine ranked by text proximity, not by catalogue
relevance.
::

Then I searched for *mause*, the way it sounds in Portuguese.

::figura src=/volume/assets/projetos/pcyes/busca-mause.webp alt="Search for mause with no results at all, suggesting other misspellings from the catalogue itself" largura=larga
Nothing. And the suggestions were other misspellings from the catalogue itself:
"Mause", "Vulcam". The same happened with *mous*, with *teclao*, with any
variation that escaped the exact spelling.
::

::coluna pos=direita
Half the names in a hardware store are foreign and full of numbers. Getting the
spelling wrong there is the common case, not the exception.

Somebody typing *mause* had the same money as somebody typing *mouse*, and left
without seeing a single product.
::

::frase
That stopped being a search-engine bug the second it became a sentence: the
store was deciding that people who can't spell don't get to buy.
::

## The habit that stuck

It fits any company, including the ones that don't let you do research. **Before
I open Figma, I go looking for where the operation is already written down:**

- a parallel spreadsheet somebody keeps by hand;
- a repeat ticket, the same one, every week;
- session recordings, when there's a tool for it;
- and the team's WhatsApp group complaining about the same screen.

Somebody has always already documented the problem. Almost never in the place we
went looking.
