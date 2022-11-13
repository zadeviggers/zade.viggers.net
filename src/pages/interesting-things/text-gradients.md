---
layout: ../../layouts/interesting-things-layout.astro
title: Exploring text gradients
order: 1
---

# Exploring text <span class="gradient-text">gradients</span>

Recently, I've often seen fancy gradient backgrounds for text on landing pages.
Some good examples of this gradient text are the [Vue](https://vuejs.org/)
landing page and the [MUI](https://mui.com/) landing page.

I was intrigued because it's not possible to use gradients in the `color`
attribute, and the text was selectable, so it wasn't an image.

Both of the above examples use the following css to implement the text-gradient:

```css
.gradient-text {
	background: linear-gradient(to right, #f00, #0f0, #6ff);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
```

The way that these work is pretty clever. The steps are as follows:

1. A gradient is applied to the text's background, like so: <span
   class="gradient-background">gradient-background</span>.
2. The background is clipped around the text, kind of like masking in Photoshop
   or After Effects. The text now looks like it does normally.
3. The text is made transparent, so the gradient behind it can be seen.
   <span class="gradient-text">Final product</span>.

While this CSS works fine and achieves the desired effect, there are a few
oddities. For one, this code uses the non-standard `-webkit-text-fill-color`
property to make the text transparent for some reason. I'm not sure why the
authors of these sites chose to use that instead of just using the `color`
property, as in my testing, they both produced the same results.

Another odd thing I saw was the `-webkit-` prefix for the `background-clip`
property. I found out that even though `background-clip: text;` works fine in
Firefox, in Chromium-based browsers it doesn't have any effect. It turns out
that this is because using the value `text</code> for the <code>background-clip`
property is non-standard, and most browsers require the `-webkit-` prefix on the
`background-clip` property for it to work with the value `text` (if the browser
supports it at all).

The revelation about the non-standard nature of `-webkit-background-clip: text;`
also explains the use of `-webkit-text-fill-color` instead of `color`. Most
browsers that support `-webkit-background-clip: text;` also support
`-webkit-text-fill-color`, meaning that by not overriding the `color` property,
browsers that don't support `-webkit-background-clip: text;` will fall back to
inheriting the `color` property.

When using this gradient text it's important to make sure that the text is
legible, because some of the colours that look nice in gradients are not always
easy to read. Often this will require displaying it on a contrasting background
or only using it in very large text like a page heading.

One last thing I found was that I had to update my `::selection` styles to
override `-webkit-text-fill-color` as well as `color`, because the text was no
longer visible when selected, due to it being made transparent for the gradient.

<style>
	:root {
		--example-gradient: linear-gradient(to right, #f00, #0f0, #6ff);
	}

    .gradient-text {
    	background: var(--example-gradient);
    	-webkit-background-clip: text;
    	-webkit-text-fill-color: transparent;
    }

    .gradient-background {
    	background: var(--example-gradient);
    }
</style>
