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
		
	$.fn.serializeObject = function() {
		var o = {};
			a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || " ");
            } else {
					o[this.name] = this.value || " ";
            }
        });
		return o;
	};
	
})			
function submitInfo(form) {
    var self = this,
		form = $(form),
		isValid = validate(form);
    if (isValid) {
		var inputs = form.serializeObject();
			self.objInfo = JSON.stringify(inputs);		
		form.html("<label>" + inputs.firstName + " " + inputs.lastName + "</label><br><label>" + inputs.county +"</label><br><label>" + inputs.phone + "</label>");
		$("#pickupForm>div").attr("hidden", false);
	}
	event.preventDefault();
}

function submitPickup(form) {
	var self = this,
		form = $(form),
		firstRadio = $("#one"),
		isValid;
	if(firstRadio.prop("checked")) {
		var objPickup = {};
		form.html("<label>" + firstRadio.parent().text() + "</label>"); 
	} else {
		isValid = validate(form);
		if (isValid) {
			var inputs = form.serializeObject();
				self.objPickup = JSON.stringify(inputs);		
			form.html("<label>Assistant Pickup</label><br><label>" + inputs.firstName + " " + inputs.lastName + "</label><br><label>" + inputs.email +"</label><br><label>" + inputs.phone + "</label>");
		}
	}
	$("#paymentForm>div").attr("hidden", false);

	event.preventDefault();

}


function submitPayment(form){
	var form = $(form),
		isValid = validate(form);
	if (isValid) {
		var inputs = form.serializeObject();
			self.objPayment = JSON.stringify(inputs);		

	}
		
	
			event.preventDefault();
}

function checkRadio(){
	if($("#one").prop("checked")) {
		$("#inputsForm").attr("hidden", true);
		$("#pickupForm").attr("novalidate", "");
	} else {
		$("#inputsForm").removeAttr("hidden");
		$("#pickupForm").removeAttr("novalidate");
	}	
}

function validate(form) {
	var self = this;
		inputs = form.find(":input:visible"),
		selects = form.find("select"),
		valid = true;
	form.find(".error").remove();
	inputs.each(function(i, e) {
		inputValid = self.validateInput(e);
		if (!inputValid) {
			valid = false;
		}
	});
	
	selects.each(function(i, e) {
			dropDownValid = self.validateDropDown(e);
			if (!dropDownValid) {
				valid = false;
			}
		});
	
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
					validateErrorMessage = "Not valid!";

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

function validateDropDown(formElements) {
		var select = $(formElements),
			valid = true,
			selectVal = select.find("option:first-child").text(),
			validateErrorMessage = "Not valid";
			
		if (!selectVal) {
			valid = false;
		}

		if (!valid) {
			select.after("<span class='error'>" + validateErrorMessage + "</span>");
		}

		return valid;
	}