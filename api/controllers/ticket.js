const Ticket = require('../models/ticket')
const Subsidiary = require('../models/subsidiary')
const sendJSONresponse = require('./shared').sendJSONresponse

async function ticket_create(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId
    console.log(req.body)

    let ticket = new Ticket(req.body)
    ticket.subsidiary = subsidiary_id
    console.log(ticket)
    ticket = await ticket.save()

    sendJSONresponse(res, 201, ticket)
  } catch (e) {
    return next(e)
  }
}

async function ticket_update(req, res, next) {
  try {
    const ticket_id = req.params.ticketId

    let ticket = await Ticket.findByIdAndUpdate(ticket_id, req.body, { new: true })

    sendJSONresponse(res, 200, ticket)
  } catch(e) {
    return next(e)
  }
}


module.exports = {
  ticket_create,
  ticket_update
}
