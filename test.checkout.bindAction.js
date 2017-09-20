$(() => {
	$.getJSON("GetCountries.json"
	).done(response =>  {
		$("#countries").autocomplete({
			source: response
		});		
	});
	$(document).on("change blur", "input", function (e) {
		var jThis = $(this);
		test.validate.validateInput(jThis);
    });
});