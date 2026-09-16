# Web exercises

Coursework for the web programming course at UT Dallas. One folder per exercise,
each named with my NetID so the folder can be zipped and submitted as-is.

## Exercise 1: semantic HTML

Unstyled portfolio page built from semantic elements.

- [portfolio.html](exercise-1/dal314006/portfolio.html)
- Live: https://harshitwandhare.github.io/utd-web-exercises/exercise-1/dal314006/portfolio.html

## Exercise 2: CSS

**Problem 1.** One HTML file with two appearances. `index.html` links `styleA.css`;
changing that single line to `styleB.css` gives the second layout. The markup is
identical for both.

- [index.html](exercise-2/dal314006/index.html), [styleA.css](exercise-2/dal314006/styleA.css), [styleB.css](exercise-2/dal314006/styleB.css)
- Live (Version A): https://harshitwandhare.github.io/utd-web-exercises/exercise-2/dal314006/index.html

**Problem 2.** The Exercise 1 page with an external stylesheet. Same content and
structure, plus classes for styling. Grid lays out the page shell and the project
cards; flexbox handles the navigation, the about block and the footer.

- [portfolio.html](exercise-2/dal314006/portfolio.html), [portfolio.css](exercise-2/dal314006/portfolio.css)
- Live: https://harshitwandhare.github.io/utd-web-exercises/exercise-2/dal314006/portfolio.html

## Exercise 3: JavaScript

Ten functions over arrays, callbacks, spread and rest, written into the starter
file the course provides. The starter's stubs, JSDoc and sample-usage block are
left as they came; only the function bodies are mine.

- [e3.js](exercise-3/dal314006/e3.js), [index.html](exercise-3/dal314006/index.html)
- Live: https://harshitwandhare.github.io/utd-web-exercises/exercise-3/dal314006/index.html
  (open the browser console)

Run it with `node exercise-3/dal314006/e3.js` to see all fourteen sample lines.

## Exercise 4: virtual DOM diff

A `diff()` that walks two virtual DOM trees and makes the smallest set of real
DOM changes that brings the page in line with the new one. Only `diff.js`
differs from the starter; `index.html`, `index.css` and `vdoms.js` are the files
as they were handed out.

- [diff.js](exercise-4/dal314006/diff.js)
- Live: https://harshitwandhare.github.io/utd-web-exercises/exercise-4/dal314006/index.html
  (Render Initial DOM, then Update DOM; edit the index in `index.html` to pick a
  different test case)

Both Exercise 2 HTML files pass the W3C validator and all three stylesheets pass the W3C CSS
validator with no errors. Checked in Firefox, as the course requires.

The full portfolio this coursework summarises is at https://harshitwandhare.com.
