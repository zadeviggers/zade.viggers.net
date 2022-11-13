---
layout: ../../layouts/interesting-things-layout.astro
title: Dynamic theme colours
order: 3
---

# Dynamic theme/accent colours

Hey! Do you want your site to be able to do _this_?

<video src="/dynamic-theme-colours.mp4" controls loop height="300" width="525" class="rounded bg-theme" alt="A video showing a webpage with coloured elements and a settings screen. Someone keeps changing the system accent colour, and the coloured elements in the webpage keep updating to match it.">
</video>

It's easy. Just use the CSS `AccentColor` colour keyword and you're away! There
is also a corresponding colour keyword `AccentColorText` that is guaranteed to
be readable when text is placed on a background of `AccentColor`.

Here's an example of using it:

```css
button {
	background-color: AccentColor;
	color: AccentColorText;
}
```

The capitalisation is optional by the way - the keywords are case-insensitive.

Unfortunately, it's not quite that simple. `AccentColor` and `AccentColorText`
are supported in Firefox and Safari, but not in Chrome (here's the relevant
Chrome issue so that you can track progress on implementing these keywords:
[Issue 1338061](https://bugs.chromium.org/p/chromium/issues/detail?id=1338061)).

This is a problem, because Chrome still has over 60% of the browser market
share. Luckily for us, there is a CSS feature that solves our problem:
[`@supports`](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports)!

We can use `@supports` to check if `AccentColor` and `AccentColorText` are
supported, and if they are use them. Otherwise, we'll fall back to some default
colours.

```css
button {
	background-color: #84cc16;
	color: black;
}

@supports (background-color: AccentColor) and (color: AccentColorText) {
	button {
		background-color: AccentColor;
		color: AccentColorText;
	}
}
```

And that's about it!

A couple of last things to note:

1. You can't access the colour value with Javascript. Sorry css-in-js fans. This
   is intentional, to reduce fingerprinting surface.
2. It's pretty hard to generate lighter/darker variants of the `AccentColor`. I
   ended up using `filter: brightness(1.1);` on my buttons to make them brighter
   when the user hovered over them.
