test.checkout.bindAction = {
	init: function init(){
		const self = this;
		$.getJSON("GetCountries.json"
		).done(response =>  {
			self.countriesList = response;
			$("#countries").autocomplete({
				source: response,
				select:  (event, ui) => {
					$("#countries").val(ui.item.value);
				}
			});
		});
		$(document).on("change blur", "input", function (e) {
			let input = $(this),
				inputName = input.attr('name');

			if(inputName === "country") {
				let inputVal = input.val(),
					selectedCountry;

				selectedCountry = $.grep(self.countriesList, (el) => {
					return el.toLowerCase() === inputVal.toLowerCase();
				});

				if(!selectedCountry || !selectedCountry.length) {
					input.val("");
				}
			}
			test.validate.validateInput(input);
		});
		$(document).on("focus", "input", function (e) {
			let input = $(this);
			input.parent().find(".error").remove();
		});
	}
};
