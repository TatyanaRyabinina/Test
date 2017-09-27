test.checkout = {
	submitInfo: function submitInfo(form) {
		const objForm = $(form),
			isValid = test.validate.validate(objForm);

		if (isValid) {
			let inputs = objForm.serializeObject(),
				{firstName, lastName, country, phone} = inputs;

			this.objInfo = JSON.stringify(inputs);
			objForm.html(`<br><label> ${firstName} ${lastName} </label><br><label> ${country} </label><br><label> ${phone} </label><br>`);
			$("#pickupInputs").attr("hidden", false);
		}
		event.preventDefault();
	},
	checkRadio: function checkRadio(){
		if($("#pickUpByHimself").prop("checked")) {
			$("#inputsForm").attr("hidden", true);
			$("#pickupForm").attr("novalidate", "");
		} else {
			$("#inputsForm").removeAttr("hidden");
			$("#pickupForm").removeAttr("novalidate");
		}
	},
	submitPickup: function submitPickup(form) {
		let	isValid;
		const pickUpByHimself = $("#pickUpByHimself"),
			objForm = $(form);

		if(pickUpByHimself.prop("checked")) {
			this.objPickup = {};
			objForm.html(`<label> ${pickUpByHimself.parent().text()} </label>`);
			$("#paymentInputs").attr("hidden", false);
		} else {
			isValid = test.validate.validate(objForm);
			
			if (isValid) {
				let inputs = form.serializeObject(),
					{firstName, lastName, email, phone} = inputs;

				this.objPickup = JSON.stringify(inputs);
				objForm.html(`<br><label>Assistant Pickup</label><br><label> ${firstName}  ${lastName} </label><br><label> ${email} </label><br><label> ${phone} </label><br>`);
				$("#paymentInputs").attr("hidden", false);
			}
		}
		event.preventDefault();
	},
	submitPayment: function submitPayment(form){
		const form = $(form),
			isValid = test.validate.validate(form);
			
		if (isValid) {
			let inputs = form.serializeObject(),
				{card, month, year} = inputs;

			this.objPayment = JSON.stringify(inputs);
			$("#submitOrder").removeAttr("disabled");
			form.html(`<h4>Payment Information</h4><label>Card type: VISA</label><br><label>Card ending in ${((card).toString()).substr(-4)} </label><br><label>Expires ${month}/${year} </label><br>`);
		}
		event.preventDefault();
	},
	submitOrder: function submitOrder(){
		$.when(
			test.ajax.sendPOST("SavePersonalInfo.json", this.objInfo),
			test.ajax.sendPOST("SavePickup.json", this.objPickup),
			test.ajax.sendPOST("SavePayment.json", this.objPayment)
		).done((responseInfo, responsePickup, responsePayment) => {
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
};
