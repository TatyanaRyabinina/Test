$(document).ready(function() {
	$.getJSON("GetCountries.json"
	).done(function(response)  {
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
		form.html("<br><label>" + inputs.firstName + " " + inputs.lastName + "</label><br><label>" + inputs.county +"</label><br><label>" + inputs.phone + "</label><br>");
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
		self.objPickup = {};
		form.html("<label>" + firstRadio.parent().text() + "</label>"); 
	} else {
		isValid = validate(form);
		if (isValid) {
			var inputs = form.serializeObject();
			self.objPickup = JSON.stringify(inputs);		
			form.html("<br><label>Assistant Pickup</label><br><label>" + inputs.firstName + " " + inputs.lastName + "</label><br><label>" + inputs.email +"</label><br><label>" + inputs.phone + "</label><br>");
		}
	}
	$("#paymentForm>div").attr("hidden", false);

	event.preventDefault();
}


function submitPayment(form){
	var self = this,
		form = $(form),
		isValid = validate(form);
	if (isValid) {
		var inputs = form.serializeObject();
		self.objPayment = JSON.stringify(inputs);	
		$("#submitOrder").removeAttr("disabled");
		form.html("<h4>Payment Information</h4><label>Card type: VISA</label><br><label>Card ending in " + ((inputs.card).toString()).substr(-4) + "</label><br><label>Expires " + inputs.month + "/" + inputs.year + "</label><br>");
	}
	event.preventDefault();
}


function submitOrder(){
	$.when(
		ajax("SavePersonalInfo.json", objInfo),
		ajax("SavePickup.json", objPickup),
		ajax("SavePayment.json", objPayment)
	).done(function(responseInfo, responsePickup, responsePayment){
		if(responseInfo && responseInfo[0].status === "success") {
			localStorage.setItem('orderId', responseInfo[0].data.orderId);
		}
		if(responsePickup && responsePickup[0].status === "success") {
			localStorage.setItem('message', responsePickup[0].data.message);
		}
		if(responsePayment && responsePayment[0].status === "success"){
			location.href = location.origin + responsePayment[0].data.redirectUrl;
		}
	});
}

function ajax(url, data) {
	return $.ajax({
				url: url,
				type: "POST",
				data: data,
				contentType: "application/json; charset=utf-8",
				dataType: "json"
			})
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
      			
function validateInput(formElement) {
	var input = $(formElement),
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

function validateDropDown(formElement) {
	var select = $(formElement),
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