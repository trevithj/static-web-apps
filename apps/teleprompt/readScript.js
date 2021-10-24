//globals BASE, THE_SCRIPT */
(function(){
  const sel = BASE.select;

  function formatScript(text) {
    const lines = text.split('\n');
    const html = [];
    let isDiv = false;
    lines.forEach(line => {
      line = line.trim();
      if(line!=='') { //ignore empty lines
        const ch0 = line[0];
        switch(ch0) {
          case '#':
            if(isDiv) html.push('</div>');
            isDiv = true;
            html.push(`<div class="text char${line[1]}">`);
            break;
          case '{':
            isDiv = false;
            html.push(parseCmd(line));
            break;
          case '/':
            break; //ignore comments
          default: //treat as plain text
            html.push(line);
        }
      }
    });
    if(isDiv) html.push('</div>');
    return html;
  }

  function parseCmd(line) {
    const obj = JSON.parse(line);
    const html = Object.keys(obj).map(tag => {
      const n = obj[tag];
      return Array(n).map(() => `<${tag} />`);
    });
    return html.join('\n');
  }

  const view = sel('body');
	view.innerHTML = '';
	const html = formatScript(THE_SCRIPT);
	//console.log(html);
	setTimeout(() => {
		view.innerHTML = '<div id="speech"></div><div id="control"></div>';
		const speech = sel("#speech");
		speech.innerHTML = html.join('\n');
    BASE.send('canInit', {speech});
		window.dispatchEvent(new Event('canInit'));
	}, 100);//zero should still work, but...
}());
