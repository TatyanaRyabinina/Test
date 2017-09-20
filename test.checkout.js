test.checkout = {
	submitInfo: function submitInfo(form) {
		var form = $(form);
		const self = this,
			isValid = test.validate.validate(form);
		if (isValid) {
			let inputs = form.serializeObject(),
				{firstName, lastName, country, phone} = inputs;
			self.objInfo = JSON.stringify(inputs);		
			form.html(`<br><label> ${firstName} ${lastName} </label><br><label> ${country} </label><br><label> ${phone} </label><br>`);
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
		const self = this;
		let	isValid,
			pickUpByHimself = $("#pickUpByHimself");
		var	form = $(form);
		if(pickUpByHimself.prop("checked")) {
			self.objPickup = {};
			form.html(`<label> ${pickUpByHimself.parent().text()} </label>`); 
		} else {
			isValid = test.validate.validate(form);
			if (isValid) {
				let inputs = form.serializeObject(),
					{firstName, lastName, email, phone} = inputs;
				self.objPickup = JSON.stringify(inputs);		
			form.html(`<br><label>Assistant Pickup</label><br><label> ${firstName}  ${lastName} </label><br><label> ${email} </label><br><label> ${phone} </label><br>`);
			}
		}
		$("#paymentInputs").attr("hidden", false);
		event.preventDefault();
	},
	submitPayment: function submitPayment(form){
		var form = $(form);
		const self = this,
			isValid = test.validate.validate(form);
		if (isValid) {
			let inputs = form.serializeObject(),
				{card, month, year} = inputs;
			self.objPayment = JSON.stringify(inputs);	
			$("#submitOrder").removeAttr("disabled");
			form.html(`<h4>Payment Information</h4><label>Card type: VISA</label><br><label>Card ending in ${((card).toString()).substr(-4)} </label><br><label>Expires ${month}/${year} </label><br>`);
		}
		event.preventDefault();
	},
	submitOrder: function submitOrder(){
		const self = this;
		$.when(
			test.ajax.sendPOST("SavePersonalInfo.json", self.objInfo),
			test.ajax.sendPOST("SavePickup.json", self.objPickup),
			test.ajax.sendPOST("SavePayment.json", self.objPayment)
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