var GridComp = function(opt){
	this.columns = opt.columns;
	this.searchParams = opt.searchParams;
	this.table = null;
	this.form = null;
	this.searchButton = null;
}
GridComp.prototype = {
	getList: function(){
		var self = this;
		$.ajax({
			url: '/api/person/list',
			method: 'GET',
			dataType: "json",
			success: function(data, textStatus, jqXHR){
				console.log('success!', data);
				self.buildList(data.data);
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log('error!');				
			}
		});
	},
	initialize: function(){
		var form = this.form = $("<form>").appendTo("#gridComp");
		var width = parseInt(10 / this.searchParams.length);
		var divRow = $("<div>").addClass("row").appendTo(form);
		$.each(this.searchParams, function( index, value ) {
			var div = $("<div>").addClass("col-md-" + width + " form-group").appendTo(divRow);
			$("<label>").attr("for", value.name).html(value.label).appendTo(div);
			$("<input>")
			 	.attr({"type": "text", "id":value.name, "name": value.name})
			 	.addClass("form-control")
			 	.appendTo(div);
		});
		var div = $("<div>").addClass("col-md-2").appendTo(divRow);
		this.searchButton = $("<button>").attr("type", "button").
								addClass("btn btn-primary").html("Найти").appendTo(div);
		this.searchButton.bind('click', {scope: this}, function(evt){
			console.log("Button clicked");
		})

		this.table  = $("<table>").addClass("table").appendTo("#gridComp");
		var thead = $("<thead>").appendTo(this.table);
		var tr = $("<tr>").appendTo(thead);
		$.each(this.columns, function( index, value ) {
			$("<th>").appendTo(tr).html(value);
		});
		this.getList();
	},
	buildList: function(data){
		var tbody = $("<tbody>").appendTo(this.table);;
		console.log('build list!', data);
		$.each(data, function( index, value ) {
			var tr = $("<tr>").appendTo(tbody);
			$("<td>").appendTo(tr).attr("scope", "row").html(index+1);
			$("<td>").appendTo(tr).html(value.firstName + " " + value.lastName);
			$("<td>").appendTo(tr).html(value.bloodType);
			$("<td>").appendTo(tr).html(value.fin);
		});
	}
}