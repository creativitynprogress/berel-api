
module.exports = (ticket, amount) => {
	let total = 0

	ticket.cash_pays.map(p => total += p.amount)
	ticket.card_pays.map(p => total += p.amount)
	ticket.transfers.map(p => total += p.amount)
	ticket.checks.map(p => total += p.amount)
	total += amount

	if (total >= ticket.total - ticket.discount.quantity) {
		return true
	} else {
		return false
	}

}
