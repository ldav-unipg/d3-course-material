# L1 - SVG tutorial

## This is the written guide for the first half of L1. Please, refer to the slides for an in-depth theoretical explanation.

- Open the `index.html` file from the `L1>1-SVG>start` folder.
- The file should look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>L1 -SVG Shapes Gallery</title>
  </head>
  <body>
    <!-- Your Code here -->
  </body>
</html>
```

- Open the file in your browser with the **Live Server Extension**: to do so, right click the file in VSCode and select the option **> open with Live Server**

## L1.1 Responsive SVG Container

- Add an `<svg>` container in your body

```html
<body>
  <svg></svg>
</body>
```

- Change the attributes `width` and `height` of the svg and add a solid black border to visualize better the space occupied by the svg.

```html
<svg width="900" height="300" style="border:1px solid black;"></svg>
```

- If you want to resize the svg container when you resize your window, you can use the percentage of width. However, you will lose the ratio between the two dimensions.

```html
<svg width="100%" height="300" style="border:1px solid black;"></svg>
```

- Now use the **viewBox** attribute to create a responsive svg:

```html
<svg viewBox="0 0 900 300" style="border:1px solid black;"></svg>
```

- To contain the svg into certain values, we wrap a `<div>` element around the `<svg>` and we fix the following attributes: `max-width = 1200px` and `width = 100%`.

```html
<div style="width:100%; max-width:1200px; margin:0 auto;">
  <svg viewBox="0 0 900 300" style="border:1px solid black;">...</svg>
</div>
```

## L1.2 Lines

- The `<line/>` component is used to draw edges in graphs (you will see it in action when we will use D3).
- To draw a `line` in an svg element you need to insert the following code:

```html
<svg>
  <line x1="50" y1="45" x2="140" y2="225" stroke="black" stroke-width="3" />
</svg>
```

- The values `x1, y1` are for the coordinates of the starting position, `x2, y2` are for the final position. The attributes `stroke` and `stroke-width` are required to actually see the line and adding a thickness to it.

## L1.3 Rectangles

- To draw some rectangles, we need to specify some attributes:
  - `x` and `y` for the position of the top-left corner,
  - `width` and `height` for the dimensions,
  - `fill`, `fill-opacity` for the inner color,
  - `stroke`, `stroke-width`, `stroke-opacity` for the border.
- We now draw three different rectangles with different coloring and dimensions. Inside your svg, write the following:

```html
<rect x="260" y="25" width="120" height="60" fill="#6ba5d7" />
<rect x="260" y="100" width="120" height="60" rx="20" ry="20" fill="#6ba5d7" />
<rect
  x="260"
  y="175"
  width="60"
  height="60"
  fill="transparent"
  stroke="#6ba5d7"
/>
```

## L1.4 Circle and Ellipse

- The `<circle/>` element is very important for D3 and graph drawing: it is the svg component used to draw nodes.
- The `circle` require three parameters:
  - `cx` and `cy` for the position of the center,
  - `r` for the radius.
- To draw a circle, write the following code:

```html
<circle cx="530" cy="80" r="50" />
```

- The `ellipse` requires one more parameter than the `circle`:
  - `cx` and `cy` are still used for the position of the center,
  - `rx` for the horizontal radius and `ry` for the vertical radius.
- To draw an ellipse, write the following code:

```html
<ellipse cx="530" cy="205" rx="50" ry="30" />
```

## L1.5 Paths

- To draw a path we need to specify a lot of values inside the `d` attribute (for an explanation, refer to the slides).
- Write the following code inside the svg to draw a path.

```html
<path
  d="M680 150 C 710 80, 725 80, 755 150 S 810 220, 840 150"
  fill="none"
  stroke="#773b9a"
  stroke-width="3"
/>
```

## L1.6 Text

- To add some text to your `svg` you can use the following:

```html
<text x="0" y="85">rect</text>
```

- However, adding text to svg elements can be better achieved by grouping elements together.

## L1.7 Grouping

- For example, let's group the `rect` with its text.
- Change your code by wrapping the last `rect` and `text` inside a `<g/>` element.

```diff
- <rect
-  x="260"
-  y="175"
-  width="60"
-  height="60"
-  fill="transparent"
-  stroke="#6ba5d7"
-/>

+ <g transform="translate(260, 175)">
+          <rect
+            x="0"
+            y="0"
+            width="60"
+            height="60"
+            fill="transparent"
+            stroke="#6ba5d7"
+          />
+          <text x="0" y="85">rect</text>
+ </g>
```

- If you want to copy:

```html
<g transform="translate(260, 175)">
  <rect
    x="0"
    y="0"
    width="60"
    height="60"
    fill="transparent"
    stroke="#6ba5d7"
  />
  <text x="0" y="85">rect</text>
</g>
```

- Here we used the `transform = translate(x, y)` to move the group. The starting position `(0, 0)` is the top-left corner of the svg.
- Now let's add the remaining text. We will do it with grouping.
- Here, we set a new font, color, and font-size to the group and it is applied to every element in the group.

```html
<g fill="#636466" style="font-size:16px; font-family:monospace">
  <text x="60" y="260">line</text>
  <text x="530" y="155" style="text-anchor:middle">circle</text>
  <text x="530" y="260" style="text-anchor:middle">ellipse</text>
  <text x="730" y="260">path</text>
</g>
```

END TUTORIAL

---

# Ending Code

```html
<!DOCTYPE html>
<html>
  <head>
    [...]
  </head>
  <body>
    <div style="width:100%; max-width:1200px; margin:0 auto;">
      <svg viewBox="0 0 900 300" style="border:1px solid black;">
        <line x1="50" y1="45" x2="140" y2="225" stroke="black" />
        <rect x="260" y="25" width="120" height="60" fill="#6ba5d7" />
        <rect
          x="260"
          y="100"
          width="120"
          height="60"
          rx="20"
          ry="20"
          fill="#6ba5d7"
        />
        <g transform="translate(260, 175)">
          <rect
            x="0"
            y="0"
            width="60"
            height="60"
            fill="transparent"
            stroke="#6ba5d7"
          />
          <text x="0" y="85">rect</text>
        </g>
        <circle
          cx="530"
          cy="80"
          r="50"
          fill="none"
          stroke="#81c21c"
          stroke-
          width="3"
        />
        <ellipse cx="530" cy="205" rx="50" ry="30" fill="#81c21c" />
        <path
          d="M680 150 C 710 80, 725 80, 755 150 S 810 220, 840 150"
          fill="none"
          stroke="#773b9a"
          stroke-width="3"
        />
        <g fill="#636466" style="font-size:16px; font-family:monospace">
          <text x="60" y="260">line</text>
          <text x="530" y="155" style="text-anchor:middle">circle</text>
          <text x="530" y="260" style="text-anchor:middle">ellipse</text>
          <text x="730" y="260">path</text>
        </g>
      </svg>
    </div>
  </body>
</html>
```

<!DOCTYPE html>
<html>
<head> [...] </head>
<body>
 <div style="width:100%; max-width:1200px; margin:0 auto;">
 <svg viewBox="0 0 900 300" style="border:1px solid black;">
 <line x1="50" y1="45" x2="140" y2="225" stroke="black" />
 <rect x="260" y="25" width="120" height="60" fill="#6ba5d7" />
 <rect x="260" y="100" width="120" height="60" rx="20" ry="20" fill="#6ba5d7" />
 <g transform="translate(260, 175)">
 <rect x="0" y="0" width="60" height="60" fill="transparent" stroke="#6ba5d7" />
 <text x="0" y="85">rect</text>
 </g>
 <circle cx="530" cy="80" r="50" fill="none" stroke="#81c21c" stroke- width="3" />
 <ellipse cx="530" cy="205" rx="50" ry="30" fill="#81c21c" />
 <path d="M680 150 C 710 80, 725 80, 755 150 S 810 220, 840 150" fill="none"
stroke="#773b9a" stroke-width="3" />
 <g fill="#636466" style="font-size:16px; font-family:monospace">
 <text x="60" y="260">line</text>
 <text x="530" y="155" style="text-anchor:middle">circle</text>
 <text x="530" y="260" style="text-anchor:middle">ellipse</text>
 <text x="730" y="260">path</text>
 </g>
 </svg>
 </div>
</body>
</html>
