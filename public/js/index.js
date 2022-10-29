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
		var FLAG = 1;
		
		if ($("#rdbedFLAGOPEN").prop("checked")){
			FLAG = 1;
		} else {
			FLAG = 0;
		}
		$.ajax({
            type : "POST",
            url: "/updateTASK",
			async : false ,
            context: document.body,
            data: {
                    ID : $("#edID").val() ,
					TASK : $("#edTASK").val() ,
					DESCRIPTION : $("#edDESCRIPTION").val(),
					AUTHOR : $("#edAUTHOR").val(),
					FLAG : FLAG
				  },
            success: function(d){
                alert("Record has been update!");
				filterTable();
				$("#modalEDIT").modal("hide");	
            },
            error: function(d){
				alert("Unable to update!");
                return false;
            }
        }).done(function() {
            
        });
	
       
    });
	
	$(document).on('click', 'a.rowDELETE', function(e) {
		e.preventDefault();
		$.ajax({
            type : "POST",
            url: "/deleteTASK",
			async : false ,
            context: document.body,
            data: {
                    ID : $('table#tablecontainer tbody tr:nth-child(' + ($(this).closest('td').parent()[0].sectionRowIndex + 1) + ') td:nth-child(' + 1 + ')').text() 
				  },
            success: function(d){
                alert("Record has been deleted!");
				filterTable();
            },
            error: function(d){
				alert("Unable to delete!");
                return false;
            }
        }).done(function() {
            
        });
    });

	$("#btnADD").click(function(){
		$.get( "/getNewID", function(data) {
			$("#addID").val(parseInt(data));
		});
		
		$("#addTASK").val("");
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
		
		$.ajax({
            type : "POST",
            url: "/addTASK",
			async : false ,
            context: document.body,
            data: {
                    ID : $("#addID").val() ,
					TASK : $("#addTASK").val() ,
					DESCRIPTION : $("#addDESCRIPTION").val() ,
					AUTHOR : $("#addAUTHOR").val() ,
					FLAG : 1
				  },
            success: function(d){
                alert("Record has been saved!");
				filterTable();
				$("#modalADD").modal("hide");	
            },
            error: function(d){
				alert("Duplicate ID!");
                return false;
            }
        }).done(function() {
            
        });
	
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
		
		$.ajax({
            type : "GET",
            url: "/data",
			async : false ,
            context: document.body,
            success: function(d){
				createTable(d);
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
            },
            error: function(d){
				
                return false;
            }
        }).done(function() {
            
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
	
	function createTable(d){
		var tableRef = document.getElementById('tablecontainer').getElementsByTagName('tbody')[0];
		var retOBJ = d.split("\n");
	  
		$("#tablecontainer > tbody").html("");
		var table = "";
		for (var i=0; i < retOBJ.length - 1; i++){
			var data = retOBJ[i].split(";");
			if (data[5] == "0"){
				table += "<tr>";
			} else {
				table += "<tr style = 'display:none;'>";
			}
			for (var col = 0; col < data.length; col++){
				if (col === 4){
					if (data[col] == 1){
						table += "<td>";
						table += "Open";
						table += "</td>";
						table += "<td>";
						table += data[col];
						table += "</td>";
					} else {
						table += "<td>";
						table += "Close";
						table += "</td>";
						table += "<td>";
						table += data[col];
						table += "</td>";
					}
				} else {
					table += "<td>";
					table += data[col];
					table += "</td>";
				}
			}
			table += "<td>";
			table += "<a href='#' class = 'rowEDIT'><i class = 'fas fa-pencil-alt'></i> Edit</a> | <a href='#'  style = 'color:red;' class = 'rowDELETE'><i class = 'fas fa-times'></i> Delete</a>";
			table += "</td>";
			table += "</tr>";
			
		}
		$("#tablecontainer > tbody").html(table);
	
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

