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

function formSubmit(form) {
    var isValid = validate(form);
    if (isValid) {
		
	}
	event.preventDefault();
}


function validate(form) {
	var inputs = $(form).find(":input"),
		valid = true,
		$(form).find(".error").remove();
	inputs.each(function(i, e) {
		inputValid = self.validateInput(e);
		if (!inputValid) {
			valid = false;
		}
	 })
	 return valid;
}
      			
function validateInput(formElements) {
		var input = $(formElements),
			val = input.val(),
			maxLength = input.attr("data-max-length"),
			required = input.attr("required"),
			pattern = input.attr("pattern"),
			valid = true,
			validateErrorMessage = "";
			
		if (required && (!val || val.length === 0)) {
				valid = false;
				validateErrorMessage = "Empty field!";
		} else if ((required || val) && pattern) {
			if (pattern) {
				regExp = new RegExp(pattern);
			}
			
			if (regExp && regExp.test) {
				valid = regExp.test(val);
				if(!valid) {
					validateErrorMessage = "Only digits!";

				}
			}
		}
		if (valid && maxLength) {
			valid = val.length <= maxLength;
			validateErrorMessage = "Value shouldn't be longer than " + maxLength + " chars";
		}
		
		if (!valid) {
			input.after("<span class='error'>" + validateErrorMessage + "</span>");
		}
		
		return valid;
		
}