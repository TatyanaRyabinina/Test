test.checkout.bindAction = {
	init: function init(){
		$.getJSON("GetCountries.json"
		).done(response =>  {
			this.countriesList = response;
			$("#countries").autocomplete({
				source: response,
				select:  (event, ui) => {
					$("#countries").val(ui.item.value);
				}
			});
		});
		$(document).on("change blur", "input",  (e) => {
			let input = $(e.currentTarget),
				inputName = input.attr('name');

			if(inputName === "country") {
				let inputVal = input.val(),
					selectedCountry;

				selectedCountry = $.grep(this.countriesList, (el) => {
					return el.toLowerCase() === inputVal.toLowerCase();
				});

				if(!selectedCountry || !selectedCountry.length) {
					input.val("");
				}
			}
			test.validate.validateInput(input);
		});
		$(document).on("focus", "input",  (e) => {
			let input = $(e.currentTarget);
			input.parent().find(".error").remove();
		});
	}
};
