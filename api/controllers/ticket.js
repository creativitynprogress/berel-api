const Ticket = require('../models/ticket').ticket
const Subsidiary = require('../models/subsidiary')
const Base = require('../models/base')
const BaseSubsidiary = require('../models/subsidiarybase')
const Client = require('../models/client')
const sendJSONresponse = require('./shared').sendJSONresponse

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

async function ticket_list(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId
    let today = new Date(Number(req.query.today))

    if (today) {
      let initial = today.setHours(0, 0, 0)
      let finish = today.setHours(23, 59, 59)

      let tickets = await Ticket.find({subsidiary: subsidiary_id, date: {$gt: initial, $lt: finish}})

      sendJSONresponse(res, 200, tickets)
    }

    throw Error('today param is required')

  } catch(e) {
    return next(e)
  }
}

async function ticket_details(req, res, next) {
  try {
    const ticket_id = req.params.ticket_id

    let ticket = await Ticket.findById(ticket_id).populate('cash_pays client checks').populate({path: 'card_pays', populate: { path: 'card', model: 'Card'}})

    sendJSONresponse(res, 200, ticket)
  } catch(e) {
    return next(e)
  }
}

async function tickets_without_boxcut (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId

    let tickets = await Ticket.find({subsidiary: subsidiary_id, boxcut: {$eq: null}}, '-paints -products -cash_pays -card_pays -transfers -checks -client')

    sendJSONresponse(res, 200, tickets)
  } catch (e) {
    return next(e)
  }
}

async function ticket_create (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId

    let ticket = new Ticket(req.body)
    ticket.subsidiary = subsidiary_id

    //  Función para disminuir la base según la pintura que se compró
    ticket_copy = await Ticket.populate(ticket, {path: 'paints.paint', model: 'Paint'})
    ticket_copy.paints.forEach(p => {
      Base.find({line: p.paint.line}, 'presentation', (err, bases) => {
        if (err) throw Error(err.message)
        let base = bases.find(b => b.presentation === p.presentation)
        BaseSubsidiary.findOne({base: base._id}, (err, bs) => {
          if (bs) {
            if (bs.stock > 0 && bs.stock > p.quantity) {
              bs.stock = bs.stock - p.quantity
              bs.save()
            } else {
              bs.stock = 0
              bs.save()
            }
          }
        })
      })
    })

    let subsidiary = await Subsidiary.findById(subsidiary_id)
    let number_subsidiary = pad(subsidiary.subsidiary_number, 2)

    let tickets = await Ticket.find({subsidiary: subsidiary_id})
    let number_tickets = pad(tickets.length, 4)

    ticket.folio = number_subsidiary.toString() + number_tickets.toString()

    if (ticket.invoice.reason) {
      ticket.invoice.state = 'pending'
    }

    ticket = await ticket.save()

    ticket = await Ticket.populate(ticket, {path: 'client', select: 'name'})

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


async function tickets_by_clientid(req, res, next) {
  try {
    const client_id = req.params.client_id

    let tickets = await Ticket.find({client: client_id})
    let client = await Client.findById(client_id)

    sendJSONresponse(res, 200, {tickets, client})
  } catch(e) {
    return next(e)
  }
}

async function tickets_to_invoice(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id
    const state = req.query.state

    let tickets = await Ticket.find({'invoice.state': state, 'subsidiary': subsidiary_id}).populate('client')

    sendJSONresponse(res, 200, tickets)
  } catch(e) {
    return next(e)
  }
}

async function ticket_set_invoiced (req, res, next) {
  try {
    const ticket_id = req.params.ticket_id

    let ticket = await Ticket.findById(ticket_id)
    ticket.invoice.state = 'invoiced'

    ticket = await ticket.save()

    sendJSONresponse(res, 200, ticket)
  } catch (e) {
    return next(e)
  }
}

async function incomes_by_month(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let tickets = await Ticket.find({subsidiary: subsidiary_id}, 'total date')

    sendJSONresponse(res, 200, tickets)
  } catch(e) {
    return next(e)
  }
}

module.exports = {
  ticket_create,
  ticket_update,
  ticket_list,
  tickets_without_boxcut,
  ticket_details,
  tickets_by_clientid,
  tickets_to_invoice,
  ticket_set_invoiced,
  incomes_by_month
}
