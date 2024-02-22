# Beta trials of ideas
Here is a place for chucking attempts at stuff. Early drafts, etc.
Do remember to update the docs though - it is too easy to forget the train of thought.

## design
Trial of temp/design.svg to create a decomposition diagram. Part of idea to create diagramming tool.
Easy enough to create the diagram by hand. Modelling this:

```
Parent
  cares for -> Child
Child
```

TODOs:
* figure out how to render a node group that can handle variable lines of text. Or maybe don't - simple is good.
* calculate where the lines should end so we don't lose the arrowhead.
* style the circles so they are indicative, not intrusive.
* put edge labels on a path? Or rotate them to follow the line? Look into this. (yes, if we use transform styling for position.)

TDD: Maybe create a manual SVG, then use that to create tests for actual computed output.

## in-between
Convert the Sketch systems data into a DOT format.
```
My Awesome Sketch
First State
    some event -> Second State
Second State
    some event -> Second State
    other event -> First State
```

```
digraph {
  subgraph cluster_0 {
    First_State -> Second_State [label="some event"]
    Second_State -> Second_State [label="some event"]
    Second_State -> First_State [label="other event"]
    label = "My Awesome Sketch";
  }
}
```

[GraphViz viewer](https://dreampuf.github.io/GraphvizOnline/#digraph%20%7B%0D%0A%20%20subgraph%20cluster_0%20%7B%0D%0A%20%20%20%20First_State%20-%3E%20Second_State%20%5Blabel%3D%22some%20event%22%5D%0D%0A%20%20%20%20Second_State%20-%3E%20Second_State%20%5Blabel%3D%22some%20event%22%5D%0D%0A%20%20%20%20Second_State%20-%3E%20First_State%20%5Blabel%3D%22other%20event%22%5D%0D%0A%20%20%20%20label%20%3D%20%22My%20Awesome%20Sketch%22%3B%0D%0A%20%20%7D%0D%0A%7D)]
[GraphViz editor](http://magjac.com/graphviz-visual-editor/)]

```
digraph {
    label = "My Awesome Sketch";
    a [label="First State"]
    b [label="Second State"]
    a -> b [label="some event"]
    b -> b [label="same event"]
    b -> a [label="other event"]
}
```
fdp layout works well.

