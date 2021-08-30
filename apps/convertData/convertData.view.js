(function() {
	var display = document.querySelector("#display");
	//renderers
	function makeBtn(name, enabled) {
		var type = (enabled) ? 'primary' : 'default';
		return [
			'<button class="btn btn-',type,
			'" onclick="BASE.send(\'SET_VIEW\',\'',name,'\');">',
			name,'</button>'
		].join("");
	}

	function makeViewBtns(state) {
		return [
			makeBtn("Input", state.view==="Input"),
			makeBtn("Table", state.view==="Table"),
			makeBtn("Stats", state.view==="Stats"),
			makeBtn("Sankey",state.view==="Sankey")
		].join("");
	}

	function makeTextArea(name, content) {
		return [
			'<textarea class="form-control input" name="',name,'"',
			' onblur="BASE.send(\'SET_DATA\', $(this).val())" rows="16" cols="70" >',
			content,
			'</textarea>'
		].join("");
	}

	function makeColHeaders(cols) {
		return cols.map(function(col) {
			return '<th class="byCol">' + col.name + '</th>';
		}).join("\n");
	}

	function makeTableRows(cols) {
		var rows = [];
		cols[0].data.forEach(function(ignore, r) {
			rows.push("<tr>");
			cols.forEach(function(col) {
				rows.push("<td>");
				rows.push(col.data[r]);
				rows.push("</td>");
			});
			rows.push("</tr>");
		});
		return rows.join("\n");
	}

	function makeTableView(state) {
		console.dir(state.data);
		return [
			'<table><thead><tr>',
			makeColHeaders(state.data),
			'</tr></thead><tbody>',
			makeTableRows(state.data),
			'</tbody></table>'
		].join("");
	}

	function makeStatsView(state) {
		function makeTableRow(rowTitle, rowData) {
			var row = rowData.map(function(d) {
				return '<td>'+d+'</td>';
			});
			row.unshift('</th>');
			row.unshift(rowTitle);
			row.unshift('<tr><th class="byRow">');
			row.push('</tr>');
			return row.join("");
		}
		var stats = state.stats;
		function sorter(a, b) {
			if(isNaN(a) || isNaN(b)) { return a - b; }
			return
		}
		return [
			'<table><tbody>',
				makeTableRow("Column names:", stats.columnNames),
				makeTableRow("Unique values:", stats.uniqueMaps.map(function(d) {
					return Object.keys(d).length;
				})),
				makeTableRow("Numeric values:", stats.dataTypes.map(function(d) {
					return d.Number;
				})),
				makeTableRow("String values:", stats.dataTypes.map(function(d) {
					return d.String;
				})),
				makeTableRow("Empty values:", stats.dataTypes.map(function(d) {
					return d.Null;
				})),
				makeTableRow("Min/first values:", stats.uniqueValues.map(function(d) {
					return d[0];
				})),
				makeTableRow("Max/last values:", stats.uniqueValues.map(function(d) {
					return d[d.length-1];
				})),
			'</tbody></table>'
		].join("");
	}

	function makeSankeyView(state) {
		return [
			'<svg><g id="theViz"></g></svg>'
		].join("");
	}


	function makeView(state) {
		switch(state.view) {
			case "Input":
				return makeTextArea("data", localStorage.getItem("RawData"));
			case "Table":
				return makeTableView(state);
			case "Stats":
				return makeStatsView(state);
			case "Sankey":
				return makeSankeyView(state);
			default:
				return "Unknown View";
		}
	}

	BASE.listen("STATE_CHANGED", function(state) {
		if(state.actionType==="SET_VIEW") {
			display.innerHTML = [
				makeViewBtns(state),
				'<div class="view">',
					makeView(state),
				'</div>'
			].join("");
			if(state.view==="Input") {
				document.querySelector('textarea[name="data"]').focus();
			} else if(state.view==="Sankey") {
				var rows = [
{_rows:13, class:"Second Class", age:"Child", sex:"Female", survived:"Survived"},
{_rows:11, class:"Second Class", age:"Child", sex:"Male", survived:"Survived"},
{_rows:80, class:"Second Class", age:"Adult", sex:"Female", survived:"Survived"},
{_rows:13, class:"Second Class", age:"Adult", sex:"Female", survived:"Perished"},
{_rows:14, class:"Second Class", age:"Adult", sex:"Male", survived:"Survived"},
{_rows:154, class:"Second Class", age:"Adult", sex:"Male", survived:"Perished"},
{_rows:1, class:"First Class", age:"Child", sex:"Female", survived:"Survived"},
{_rows:5, class:"First Class", age:"Child", sex:"Male", survived:"Survived"},
{_rows:140, class:"First Class", age:"Adult", sex:"Female", survived:"Survived"},
{_rows:4, class:"First Class", age:"Adult", sex:"Female", survived:"Perished"},
{_rows:57, class:"First Class", age:"Adult", sex:"Male", survived:"Survived"},
{_rows:118, class:"First Class", age:"Adult", sex:"Male", survived:"Perished"},
{_rows:14, class:"Third Class", age:"Child", sex:"Female", survived:"Survived"},
{_rows:17, class:"Third Class", age:"Child", sex:"Female", survived:"Perished"},
{_rows:13, class:"Third Class", age:"Child", sex:"Male", survived:"Survived"},
{_rows:35, class:"Third Class", age:"Child", sex:"Male", survived:"Perished"},
{_rows:76, class:"Third Class", age:"Adult", sex:"Female", survived:"Survived"},
{_rows:89, class:"Third Class", age:"Adult", sex:"Female", survived:"Perished"},
{_rows:75, class:"Third Class", age:"Adult", sex:"Male", survived:"Survived"},
{_rows:387, class:"Third Class", age:"Adult", sex:"Male", survived:"Perished"},
{_rows:20, class:"Crew", age:"Adult", sex:"Female", survived:"Survived"},
{_rows:3, class:"Crew", age:"Adult", sex:"Female", survived:"Perished"},
{_rows:192, class:"Crew", age:"Adult", sex:"Male", survived:"Survived"},
{_rows:670, class:"Crew", age:"Adult", sex:"Male", survived:"Perished"}
				];
				var chart = d3.parsets();
				chart.dimensions(state.rowHeadings);
				chart.value(function(d) {
					return d._rows;
				});
				var viz = d3.select("svg")
					.attr("width",chart.width()).attr("height",chart.height());
				viz = viz.select("g#theViz");
				viz.datum(rows).call(chart);
			}
		}
	});


}());
