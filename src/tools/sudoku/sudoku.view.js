(function() {
	///////// View rendering /////////
	var display = $('#display');
	var view = {};
	view.init = function() {
		view.main = display.find("#main");
		view.main.html("");
		view.undoBtn = display.find("button[name='undo']");
		view.workBtn = display.find("button[name='work']");
		view.stndBtn = display.find("button[name='stnd']");
	}

	function makeFlagTD(cell, flagNum) {
		var flag = cell.flags[flagNum];
		return [
			'<td class="flag flag-',flag,
			'" onclick="BASE.send(\'CELL_CLICKED\',{index:',cell.index,', flag:',flagNum,'})">',
			(flagNum+1),'</td>'
		];
	}

	function makeCellTable(cell) {
		return [].concat(
			'<table class="cellTable"><tbody><tr>',
			makeFlagTD(cell, 0), makeFlagTD(cell, 1), makeFlagTD(cell, 2),
			'</tr><tr>',
			makeFlagTD(cell, 3), makeFlagTD(cell, 4), makeFlagTD(cell, 5),
			'</tr><tr>',
			makeFlagTD(cell, 6), makeFlagTD(cell, 7), makeFlagTD(cell, 8),
			'</tr></tbody></table>'
		);
	}

	function makeCell(cell, state) {
		if(state.grid==='working') {
			return makeCellTable(cell);
		} else {
			var sel = state.selectedCell;
			var selClass = (sel!==undefined && sel.index===cell.index) ? "selected" : "";
			var v = cell.flags.indexOf(2);
			v = (v===-1) ? "&nbsp;" : (v+1);
			return ['<div class="standard ', selClass,'" ',
				'onclick="BASE.send(\'CELL_CLICKED\',{index:',cell.index,'})">',
				v,'</div>'
			];
		}
	}


	function makeRow(row, state) {
		var tr = row.map(function(cell) {
			var ra = [].concat(
				'<td class="box box-', cell.box, '">',makeCell(cell, state),'</td>'
			);
			return ra.join("");
		});
		return ["<tr>"].concat(tr, "</tr>");
	}

	function renderRows(rows, state) {
		var html=rows.map(function(row) {
			return makeRow(row, state).join("\n");
		});
		view.main.html(html.join(""));
	}


	function filterByRow(cells, row) {
		var ra = cells.filter(function(cell) {
			return cell.row===row;
		});
		ra.sort(function(c1, c2) {
			return c1.col - c2.col;
		});
		return ra;
	}

	function getRows(cells) {
		return [
			filterByRow(cells,1),
			filterByRow(cells,2),
			filterByRow(cells,3),
			filterByRow(cells,4),
			filterByRow(cells,5),
			filterByRow(cells,6),
			filterByRow(cells,7),
			filterByRow(cells,8),
			filterByRow(cells,9)
		];
	}

	function renderNumberBtns(state) {
		//buttons at bottom of standard screen, 1-9
		//all disabled if no cell selected
		//else only allowed numbers are enabled.
		//on-click, update that cell.
		var na="0123456789X".split("");
		var row = na.map(function(n) {
			switch(n) {
				case "0": return "<tr>";
				case "X": return "</tr>";
				default: return makeNumberBtn(n, state.selectedCell);
			}
		});
		view.main.append(row.join(""));
	}
	
	function makeNumberBtn(n, sel) {
		var flag = (+n)-1;
		var indx = -1;
		var dis = 'disabled="disabled"';
		var onc = '';
		if(sel) {
			dis = (sel.flags[flag]===0) ? '' : dis;
			indx = sel.index;
		}
		onc = (dis==='') ? ['BASE.send(\'NBR_CLICKED\', {index:',indx,',flag:',flag ,'});'].join(""): onc;
		return [
			'<td><button class="btn btn-sm btn-primary" style="width:95%" ',dis,
			' onclick="',onc,'"',
			'>',n,'</button></td>'
		].join("");
	}

	view.render = function (state) {
		var rows = getRows(state.cells);
		renderRows(rows, state);
		if(state.grid==="standard") {
			renderNumberBtns(state);
		}
		view.undoBtn.prop("disabled", state.history.length===0);
		view.workBtn.prop("disabled", state.grid==="working");
		view.stndBtn.prop("disabled", state.grid==="standard");
	};




	BASE.value("VIEW", view);

}());
