# Version 1
Attempt was to make an SVG to see how easy that was.
Turns out it is fine for simple diagrams, subject to a bit of tweaking when it comes to text boxes.
Layout however is tricky.
Generally use SVG to draw the connecting arrows (put arrowhead mid-way in a polyline or path seems simplest, it saves having to calculate where the edge of the node or textbox is.)
Then position the text over the top. But it is difficult to know how to size the text, and centering it depends on size up to a point.
There is no easy way to know in advance how big we should make the text/tspan elements. Hmm. Or is there?
Well... we CAN read the bounding rect of a text or tspan element. Does that help us?
We can figure out after the fact how big the browser MADE the elements.
It leads to a sort of catch-22 situation, where we can't know the position until we have the size, but we can't get the size without adding the element to the DOM somewhere. SO it seems we need to do a lot of re-rendering.
Then once that is done, we need to redraw the links to match the nodes.

And after all that, the text/tspan elements do not handle multi-line text.

# Version 2
One possible approach is to use the foreignObject tag, and embed a div into the SVG. This allows us to get multi-line text much easier.
But it still has the same issues related to size and position: the FO tag still needs to be given initial dimensions, or the div won't be visible. Even with `FO.style.overflow` set to visible, the div doesn't render width correctly.
## v2.1
Alternative approach is to use a single FO object with width and height set arbitrarily large, and absolute-position all text nodes in there under one parent div with relative positioning. This gives us much better defaults as to how multi-line text gets arranged, and we can read the elements to identify co-ordinates for drawing the links.
## v2.2
Maybe put the text nodes outside the SVG, and use the SVG as a background for the parent div. Can we figure out how to keep the SVG co-ordinates in sync with the screen? And how do we export the whole chart as an SVG?
Also maybe we can use a hidden div somewhere on the document to check expected node-size rendering, and tweak styling for actual nodes in advance. Hmm. Extending this idea:
We could create a stand-alone document snippet with a DIV element, and use this to put in text, to see how long the div would be if text is all on one line. We could then size the actual divs as needed. But can't we just style the divs in advance? Hmm. max-width should work okay.

## v2.1a
This allows us to better handle multi-line text, using default styling. It also keeps everything within the one SVG.
So we will need a 2-pass render:
* First to put in and position the text nodes (I'm thinking of force-directed layouts here, but anything will do if it can read the default positions of each text node and adjust them as needed.)
* Second to read the final locations of each node, and draw the link lines.

# Version 3
Use the single foreignObject approach, with DIV nodes displaying the text.
Layout the "noun" nodes in a diagonal line, position the "verb" nodes just off the grid position.
Give the SVG an editable layout. Allow nodes to be dragged around, and redraw the link map afterwards. Having "verb" nodes works well here.
Notes: if we leave the viewBox attribute off the SVG, then it seems pixels and coordinates naturally line up.
As for width and height attributes, they will need transforming because SVG sort of does this a bit differently. It seems the getScreenCTM() function gives us the data we need.)This fn seems to work:
```
function screenToSVG(screenWidth, screenHeight) {
    const svg = document.querySelector("svg"); // or whatever
    const p = svg.createSVGPoint();
    p.x = screenWidth;
    p.y = screenHeight;
    return p.matrixTransform(svg.getScreenCTM().inverse());
}
```
So the total transformation is something like this:
```
const { x, y, width, height } = document.querySelector("div.textNode123").getBoundingClientRect();
const { x: newWidth, y: newHeight } = screenToSVG(width, height);
const centerX = x + (newWidth / 2); 
const centerY = y + (newHeight / 2);
// And draw the line from centerX, centerY 
```
Maybe simpler. Scale matrix looks like this:
` let scaleMatrix = [w, 0, 0, 0, 0, h, 0, 0, 0, 0, d, 0, 0, 0, 0, 1];`
So it looks like we only need two values from the matrix to use as scaling factors.
Using a DOMMatrix such as is returned by getScreenCTM, we can maybe do this:
```
const { a as dw, d as dh } = document.querySelector("svg").getScreenCTM().inverse();
const { x, y, width, height } = document.querySelector("div.textNode123").getBoundingClientRect();
const centerX = x + (width * dw * 0.5); 
const centerY = y + (height * dh * 0.5);
```
# Referencing the nodes
How do we keep the underlying node data in sync with the DOM node element?
Simple approach: data nodes have a type: verb/noun. Rather than creating HTML strings, actually create a DOM node and set the data node in the dataset map. Hmm. Does dataset take non-strings? No. So then we either set node.id or we set a stringified data node.
Alternative is to set a custom property onto the DOM object: like `element.__data = node` for example. As long as we don't have a name collision, this should work. Of course, we could also do this: `node.__element = element`. That might be better.
Also note: creating and styling a DOM element is fine, but the bounding box doesn't update until the element is added into the DOM.
Meaning that we can create an element, and add the node data to it just fine. But we need to add it to a parent first before querying the element location and size. That should still work.
```
foreach node: create element; link node to element; append to parent;
foreach node: read element location into node;
for x tries:
  foreach node: move away from close nodes; move towards linked nodes;
foreach node: update element with node location values;
```

## The calcs
First, each node needs to identify its closest neigbours. That means calculating a rough distance.
It makes sense for the calculation to return a set of distances for the node to respond to. In what form?
I guess the x,y coordinates relative to the subject node should work. Also, some sort of distance factor: x*x + y*y?