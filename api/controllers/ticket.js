const Ticket = require('../models/ticket').ticket
const Subsidiary = require('../models/subsidiary')
const Base = require('../models/base')
const BaseSubsidiary = require('../models/basesubsidiary')
const sendJSONresponse = require('./shared').sendJSONresponse

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

async function tickets_without_boxcut (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiaryId

    let tickets = await Ticket.find({subsidiary: subsidiary_id, boxcut: {$eq: null}}).populate('client', 'name')

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


module.exports = {
  ticket_create,
  ticket_update,
  ticket_list,
  tickets_without_boxcut
}
