$(document).ready(function() {
	$.getJSON("GetCountries.json"
	).done(function(response)  {
		console.log(response);
		$(function(){
			var availableCountry =[];

			for(var x in response){
				availableCountry.push(response[x]);
			}

			$( "#countries" ).autocomplete({
				source: availableCountry
			});		
		});
	})
		
})

function validate(form) {
	  inputs = $(form).find(":input"),
	  $(form).find(".error").remove();
	  inputs.each(function(i, e) {
			inputValid = self.validateInput(e);
	  })
}
      			
function validateInput(formElements) {
		var input = $(formElements),
			val = input.val(),
			maxLength = input.attr("data-max-length"),
			required = input.attr("required"),
			valid = true,
			validateErrorMessage = "";
			
		if (required && (!val || val.length === 0)) {
				valid = false;
				validateErrorMessage = "Empty field!";
		}
			
		if (valid && maxLength) {
			valid = val.length <= maxLength;
			validateErrorMessage = "Value shouldn't be longer than " + maxLength + " chars";
		}
		
		if (!valid) {
			input.after("<span class='message error'>" + validateErrorMessage + "</span>");
		}
}