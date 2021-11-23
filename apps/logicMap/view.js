/*jshint esversion: 6 */
(function () {
  const SEL = BASE.value('Selectors');
  const display = document.querySelector(SEL.main);
  const editor = document.querySelector(SEL.editor);

  // function getToolbar(state) {
  // 	var views = state.views;
  // 	var divs = views.map((v) => {
  // 		var actv = (v===state.view) ? "tab-active" : "";
  // 		return `<div class="col-sm-2 tab ${actv}">
  // 			<a href="#" onclick="BASE.dispatch(\'SET_VIEW\',\'${v}\')">${v}</a>
  // 		</div>`;
  // 	});
  // 	var spc = 12 - (2*views.length);
  // 	return `<div class="row">
  // 		${divs.join("")}
  // 		<div class="col-sm-${spc} tab tab-space">&nbsp;</div>
  // 	</div>`;
  // }

  //Trial of basic text-node map
  const textNodes = {
    '1': {text: 'Gods do not exist', x: 40, y: 20},
    '2': {text: 'The sun is a god', x: 40, y: 240},
    '3': {text: 'The sun does not exist', x: 150, y: 90},
  };
  const joinNodes = {
    'A':{x: 90, y: 120, id: 9},
  };
  const links = {
    tj: [
        '1,A',
        '2,A'
    ],
    jt: [
        'A,3'
    ]
  }


  function getMainDisplay(state) {
    const html = [
        '<svg class="links" style="width:100%; height:100vh"/>',
        `<h2>${state.view} Pending</h2>`,
    ];

    Object.keys(textNodes).forEach(key => {
      const {text, x, y} = textNodes[key];
      const style = `width:200px; top:${x}px; left:${y}px;`;
      html.push(`<div id="text-${key}" class="node" style="${style}">${text}</div>`);
    });
    Object.keys(joinNodes).forEach(key => {
        const {x, y} = joinNodes[key];
        const style = `width:60px; top:${x}px; left:${y}px;`;
        html.push(`<div id="join-${key}" class="node" style="${style}">AND</div>`);
    })
    return html.join('');
  }

  function getCenterBySelector(display, selector) {
    const bounds = display.querySelector(selector).getBoundingClientRect();
    const cx = Math.round(bounds.width/2 + bounds.left);
    const cy = Math.round(bounds.height/2 + bounds.top);
    return {cx, cy};
  }

  function drawLinks(display, links) {
      const svgEl = display.querySelector('svg');
      //TODO: for each link ID, query join-ID or text-ID
      // and map the clientBounds to the ID
      // left+half width, top + half height = center
      const textNodeMap = {};
      Object.keys(textNodes).forEach(key => {
        textNodeMap[key] = getCenterBySelector(display, `#text-${key}`);
      })
      const joinNodeMap = {};
      Object.keys(joinNodes).forEach(key => {
        joinNodeMap[key] = getCenterBySelector(display, `#join-${key}`);
      })
      console.log(textNodeMap, joinNodeMap);
      const d1 = ["M133,118 L163,168 Z"];
      const d2 = [];
      const paths = [
        `<path stroke="grey" d="${d1.join(' ')}">`,
        `<path stroke="blue" d="${d2.join(' ')}">`,
      ];
      svgEl.innerHTML = paths.join('');
  }
  /*
    display.html(`<table style="width:100%"><tr>
    <th style="width:30%">Text Input</th>
    <th style="width:70%">Display</th>
    </tr><tr>
    <td><textarea id="mainInput"></textArea></td>
    <td><svg><g id="mainGraph"></g></svg></td>
    </tr></table>
    `);
    const input = display.find("#mainInput");
    const svg = display.find("svg");
    const graph = display.find("#mainGraph");
    //init
    input.css("height", `${screen.availHeight*0.6}px`);
    input.css("width", `${window.innerWidth*0.34}px`);
    svg.attr("height", screen.availHeight*0.6);
    svg.attr("width", window.innerWidth*0.6);
  //	graph.css("height", `${screen.availHeight*0.6}px`);
  //	graph.css("width", `${window.innerWidth*0.6}px`);
  */
  function getCursor(mode) {
    switch (mode) {
      case 'add': return 'pointer';
      case 'mod': return 'move';
      case 'del': return 'crosshair';
      default: return 'default';
    }
  }

  //renderer
  BASE.listen("STATE_CHANGED", function (state) {
    console.log(state);
    display.innerHTML = getMainDisplay(state);
    drawLinks(display, links);
    display.style.cursor = getCursor(state.mode);
    editor.querySelector('input[type="text"]').value = state.mode;
    // editor.innerHTML = getToolbar(state);
  });

}());
