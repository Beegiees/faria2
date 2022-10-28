$(document).ready(function() {
	filterTable();
    $(document).on('click', 'a.rowEDIT', function(e) {
		$("#hdnSEQUENCE").val($(this).closest('td').parent()[0].sectionRowIndex + 1);
		$("#edID").val($('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 1 + ')').text());
		$("#edTASK").val($('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 2 + ')').text());
		$("#edDESCRIPTION").val($('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 3 + ')').text());
		$("#edAUTHOR").val($('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 4 + ')').text());
		let FLG = $('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 6 + ')').text();
		if (FLG == 1){
			$("#rdbedFLAGOPEN").prop("checked", true);
		} else {
			$("#rdbedFLAGCLOSE").prop("checked", true);
		}
		$("#modalEDIT").modal({backdrop : 'static', keyboard: false});
		$("#modalEDIT").modal("show");	
    });
	

    $("#btnedSave").click(function() {
		var err = false;
		var form = $("#formED").first();
        var mockResponse = {
            errors :
                {
                    'edTASK': 'Task must not be blank' ,
					'edDESCRIPTION': 'Description must not be blank' ,
					'edAUTHOR': 'Author must not be blank' 
					
                }
        };
		$.each(mockResponse.errors, function(fieldName, error) {
            let field = form.find('[name="' + fieldName + '"]');
            field.removeClass("is-invalid");
			field.after("");

        });
        $.each(mockResponse.errors, function(fieldName, error) {
            let field = form.find('[name="' + fieldName + '"]');
			if (field[0].value == ""){
				field.addClass("is-invalid");
				let immediateSibling = field.next();
				if (immediateSibling.hasClass('invalid-feedback')) {
					immediateSibling.text(error);
				} else {
					field.after("<div class='invalid-feedback'>" + error + "</div>")
				}
				err = true;
			}
           

        });
        if (err){
			return err;
		}
		$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 2 + ')').text($("#edTASK").val());
		$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 3 + ')').text($("#edDESCRIPTION").val());
		$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 4 + ')').text($("#edAUTHOR").val());
		if ($("#rdbedFLAGOPEN").prop("checked")){
			$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 5+ ')').text("Open");
			$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 6 + ')').text("1");
		} else {
			$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 5 + ')').text("Close");
			$('table#tablecontainer tbody tr:nth-child(' + ($("#hdnSEQUENCE").val()) + ') td:nth-child(' + 6 + ')').text("0");
		}
		filterTable();
		TableToCSV();
        $("#modalEDIT").modal("hide");	
    });
	
	$(document).on('click', 'a.rowDELETE', function(e) {
		e.preventDefault();
		$('table#tablecontainer tbody tr:nth-child(' + ($(this).closest('td').parent()[0].sectionRowIndex + 1) + ') td:nth-child(' + 7 + ')').text("1");
		TableToCSV();
		filterTable();
    });

	$("#btnADD").click(function(){
		$("#addID").val(parseInt($('#tablecontainer tr:last td:nth-child(' + 1 + ')').text()) + 1);
		$("#addNAME").val("");
		$("#addDESCRIPTION").val("");
		$("#addAUTHOR").val("");
        $("#modalADD").modal({backdrop : 'static', keyboard: false});
		$("#modalADD").modal("show");		
	});

	$("#btnaddSAVE").click(function(){
		var err = false;
		var form = $("#formADD").first();
        var mockResponse = {
            errors :
                {
                    'addTASK': 'Task must not be blank' ,
					'addDESCRIPTION': 'Description must not be blank' ,
					'addAUTHOR': 'Author must not be blank' 
					
                }
        };
		$.each(mockResponse.errors, function(fieldName, error) {
            let field = form.find('[name="' + fieldName + '"]');
            field.removeClass("is-invalid");
			field.after("");

        });
        $.each(mockResponse.errors, function(fieldName, error) {
            let field = form.find('[name="' + fieldName + '"]');
			if (field[0].value == ""){
				field.addClass("is-invalid");
				let immediateSibling = field.next();
				if (immediateSibling.hasClass('invalid-feedback')) {
					immediateSibling.text(error);
				} else {
					field.after("<div class='invalid-feedback'>" + error + "</div>")
				}
				err = true;
			}
           

        });
        if (err){
			return err;
		}
		
		var tableRef = document.getElementById('tablecontainer').getElementsByTagName('tbody')[0];
        var newRow = tableRef.insertRow(tableRef.rows.length);
		
		var newCell0 = newRow.insertCell(0);
        var newText0 = document.createTextNode($("#addID").val());
        newCell0.appendChild(newText0);

		var newCell1 = newRow.insertCell(1);
        var newText1 = document.createTextNode($("#addTASK").val());
        newCell1.appendChild(newText1);

		var newCell2 = newRow.insertCell(2);
        var newText2 = document.createTextNode($("#addDESCRIPTION").val());
        newCell2.appendChild(newText2);

		var newCell3 = newRow.insertCell(3);
        var newText3 = document.createTextNode($("#addAUTHOR").val());
        newCell3.appendChild(newText3);
		
		var newCell4 = newRow.insertCell(4);
        var newText4 = document.createTextNode("Open");
        newCell4.appendChild(newText4);
		
		var newCell5 = newRow.insertCell(5);
        var newText5 = document.createTextNode("1");
        newCell5.appendChild(newText5);
		
		var newCell6 = newRow.insertCell(6);
        var newText6 = document.createTextNode("0");
        newCell6.appendChild(newText6);


		var newCell7 = newRow.insertCell(7);

		var newANCHOR1 = document.createElement('a');
		newANCHOR1.className = "rowEDIT";
		newANCHOR1.href = "#";
		var newICON1 = document.createElement('i');
		newICON1.className = "fas fa-pencil-alt"
		var newText1 = document.createTextNode(" Edit");
		newANCHOR1.appendChild(newICON1);
		newANCHOR1.appendChild(newText1);
		
		var newTextMID = document.createTextNode("  |  ");

		var newANCHOR2 = document.createElement('a');
		newANCHOR2.className = "rowDELETE";
		newANCHOR2.href = "#";
		newANCHOR2.style = "color:red;";
		var newICON2 = document.createElement('i');
		newICON2.className = "fas fa-times"
		var newText2 = document.createTextNode(" Delete");
		newANCHOR2.appendChild(newICON2);
		newANCHOR2.appendChild(newText2);

		newCell7.appendChild(newANCHOR1);
		newCell7.appendChild(newTextMID);
		newCell7.appendChild(newANCHOR2);
		
		filterTable();
		TableToCSV();
		$("#modalADD").modal("hide");	
	});
	
	$("#txtFilter").on('input',function(){
		if ($("#txtFilter").val().length >= 3 || $("#txtFilter").val().length == 0){
			filterTable();
		}
	});
	
	$("#selFLAG").change(function(){
		filterTable();
	});
	
	function filterTable(){
		$('#tablecontainer > tbody  > tr').each(function() {
			if (jQuery(this).children("td:eq(6)").text() == "1"){
				$(this).hide();
			} else {
				if ($("#selFLAG").val() != 2){
					if ($("#selFLAG").val() != jQuery(this).children("td:eq(5)").text()){
						$(this).hide();
					} else {
						if (textMatch(this, $("#txtFilter").val())){
							$(this).show();
						} else {
							$(this).hide();
						}
					}	
				} else {
					if (textMatch(this, $("#txtFilter").val())){
						$(this).show();
					} else {
						$(this).hide();
					}
				}
			}
			
		});
		
	}
	
	function textMatch(el, text){
		let match = false;
		if (jQuery(el).children("td:eq(0)").text().search(text) >= 0 ||			
				jQuery(el).children("td:eq(1)").text().search(text) >= 0 ||
				jQuery(el).children("td:eq(2)").text().search(text) >= 0 ||
				jQuery(el).children("td:eq(3)").text().search(text) >= 0){
			return true;
		} 
		return match;
	}
	
	function TableToCSV(){
		let csv = `ID;Name;Description;Author;Status;Action\n`;
		$('#tablecontainer > tbody  > tr').each(function() {
			let ID =  jQuery(this).children("td:eq(0)").text();
			let TASK =  jQuery(this).children("td:eq(1)").text();
			let DESCRIPTION =  jQuery(this).children("td:eq(2)").text();
			let AUTHOR =  jQuery(this).children("td:eq(3)").text();
			let STATUS =  jQuery(this).children("td:eq(5)").text();
			let DELETEFLG =  jQuery(this).children("td:eq(6)").text();
			csv += `${ID};${TASK};${DESCRIPTION};${AUTHOR};${STATUS};${DELETEFLG}\n`;
		});
		$("#csvData").val(csv);
		$("#formCSVDATA").submit();
		/*$.post('/update', $('#formCSVDATA').serialize());
		$.get( "/data", function(data) {
			console.log(data);
		});*/
	}
	
});

