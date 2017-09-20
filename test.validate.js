test.validate = {
	validate: function validate(form) {
		const inputs = form.find(":input:visible"),
			selects = form.find("select");
		let	valid = true;
		form.find(".error").remove();
		inputs.each((i, e) => {
			inputValid = this.validateInput(e);
			if (!inputValid) {
				valid = false;
			}
		});
		selects.each((i, e) => {
			dropDownValid = this.validateDropDown(e);
			if (!dropDownValid) {
				valid = false;
			}
		});
		return valid;
	},      			
	validateInput: function validateInput(formElement) {
		let input = $(formElement),
			val = input.val(),
			maxLength = input.attr("max-length"),
			required = input.attr("required"),
			pattern = input.attr("data-type"),
			regExpMap = test.regExp,
			valid = true,
			validateErrorMessage = "";				
		if (required && (!val || val.length === 0)) {
			valid = false;
			validateErrorMessage = "Empty field!";
		} else if ((required || val) && regExpMap[pattern]) {
			regExp = regExpMap[pattern];
			if (regExp && regExp.test) {
				valid = regExp.test(val);
				if(!valid) {
					validateErrorMessage = "Not valid!";
				}
			}
		}
		if (valid && maxLength) {
			valid = val.length <= maxLength;
			validateErrorMessage = `Value shouldn't be longer than ${maxLength} chars`;
		}
		input.parent().find(".error").remove();
		if (!valid) {
			input.after(`<span class='error'> ${validateErrorMessage} </span>`);
		}
		return valid;		
	},
	validateDropDown: function validateDropDown(formElement) {
		let select = $(formElement),
			valid = true,
			selectVal = select.find("option:first-child").text(),
			validateErrorMessage = "Not valid";		
		if (!selectVal) {
			valid = false;
		}
		if (!valid) {
			select.after(`<span class='error'> ${validateErrorMessage} </span>`);
		}
		return valid;
	}
};

test.regExp = {
email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
tel: /^[0-9]{1,15}$/,
card: /^[0-9]{16}$/,
code: /^[0-9]{2,4}$/,
name: /^[a-zA-Zа-яА-ЯёЁ-]{1,15}$/,
country: /^[a-zA-Zа-яА-ЯёЁ-]+$/
};