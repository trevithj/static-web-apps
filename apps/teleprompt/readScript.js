//globals BASE, THE_SCRIPT */
(function () {
  const SEL = BASE.value('SELECTORS');

  function formatScript(text) {
    //start by cacheing the raw text into localStorage
    localStorage.setItem('TEXT', text);
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
    const html = [];
    let isDiv = false;
    lines.forEach(line => {
      const ch0 = line[0];
      switch (ch0) {
        case '#':
          if (isDiv) html.push('</div>');
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
        //   html.push(line.replaceAll(/\s+/g, '<br />')); //one word to a line...
        //   html.push('\n');
          html.push(' ');
      }
    });
    if (isDiv) html.push('</div>');
    return html;
  }

  function parseCmd(line) {
    const obj = JSON.parse(line);
    const html = Object.keys(obj).map(tag => {
      const n = obj[tag];
      return new Array(n).fill(0).map(() => `<${tag} />`).join('');
    });
    return html.join('\n');
  }

  BASE.listen('refreshDisplay', () => {
    const view = BASE.select(SEL.viewDisplay);
    const text = BASE.select(SEL.textInput);
    view.innerHTML = '';
    const html = formatScript(text.value);
    //console.log(html);
    setTimeout(() => {
      view.innerHTML = '<div id="speech"></div><div id="control"></div>';
      const speech = BASE.select("#speech");
      speech.innerHTML = html.join('');
      BASE.send('canInit', {speech});
      window.dispatchEvent(new Event('canInit'));
    }, 100);//zero should still work, but...
  })

}());
