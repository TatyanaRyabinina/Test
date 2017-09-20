$(document).ready(() => {
	const message = localStorage.getItem('message'),
		orderId = localStorage.getItem('orderId');
	if (message && orderId) {
		$('body').html(`<label> ${message} </label><br><label>Order Id ${orderId} </label>`);
	}
});