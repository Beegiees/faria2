(function () {
	// Constructor method
	this.CsvToTable = function () {
		this.csvFile = null;

		// Create options by extending defaults with the passed in arugments
		if (arguments[0] && typeof arguments[0] === "object") {
			this.options = arguments[0];
		}
	};

	CsvToTable.prototype.run = function () {
		return buildTable.call(this);
	};

	function getCSV() {
		try {
			var csvfile = this.options.csvFile;
			return new Promise(function (resolve, reject) {
				var request = new XMLHttpRequest();
				request.open("GET", csvfile, true);
				request.onload = function () {
					if (request.status == 200) {
						resolve(request.response);
					} else {
						reject(Error(request.statusText));
					}
				};

				request.onerror = function () {
					reject(Error("Error fetching data."));
				};
				request.send();
			});
		} catch (err) {
			console.error(err);
		}
	}

	function isNotEmpty(row) {
		return row !== "";
	}

	// polyfill `.filter()` for ECMAScript <5.1
	// `f` must be pure (not modify original array).
	if (!Array.prototype.filter) {
		Array.prototype.filter = function (f) {
			"use strict";
			var p = arguments[1];
			var o = Object(this);
			var len = o.length;
			for (var i = 0; i < len; i++) {
				if (i in o) {
					var v = o[i];
					f.call(p, v, i, o);
				}
			}

			return this;
		};
	}

	function buildTable() {
		getCSV.call(this).then(
			function (response) {
				var allRows = response.split(/\r?\n|\r/).filter(isNotEmpty);
				var table = "<table id = 'tablecontainer' class = ''>";
				for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
					var rowCells = allRows[singleRow].split(";");
					if (singleRow === 0) {
						table += "<thead>";
						table += "<tr>";
					} else {
						if (rowCells[5] == "0"){
							table += "<tr>";
						} else {
							table += "<tr style = 'display:none;'>";
						}
					}
					
					for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
						
						if (singleRow === 0) {
							table += "<th>";
							table += rowCells[rowCell];
							table += "</th>";
						} else {
							if (rowCell === 4){
								if (rowCells[rowCell] == 1){
									table += "<td>";
									table += "Open";
									table += "</td>";
									table += "<td>";
									table += rowCells[rowCell];
									table += "</td>";
								} else {
									table += "<td>";
									table += "Close";
									table += "</td>";
									table += "<td>";
									table += rowCells[rowCell];
									table += "</td>";
								}
							} else {
								table += "<td>";
								table += rowCells[rowCell];
								table += "</td>";
							}
						}
					}
					if (singleRow !== 0) {
						table += "<td>";
						table += "<a href='#' class = 'rowEDIT'><i class = 'fas fa-pencil-alt'></i> Edit</a> | <a href='#'  style = 'color:red;' class = 'rowDELETE'><i class = 'fas fa-times'></i> Delete</a>";
						table += "</td>";
					}
					if (singleRow === 0) {
						table += "</tr>";
						table += "</thead>";
						table += "<tbody>";
					} else {
						table += "</tr>";
					}
				}
				table += "</tbody>";
				table += "</table>";

				$(".divtablecontainer").html(table);
			},
			function (error) {
				console.error(error);
			}
		);
	}

	
})();
