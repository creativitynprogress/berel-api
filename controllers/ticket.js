const Ticket = require('../models/ticket').ticket
const Subsidiary = require('../models/subsidiary')
const Base = require('../models/base')
const BaseSubsidiary = require('../models/subsidiarybase')
const Client = require('../models/client')
const InkSubsidiary = require('../models/inksubsidiary')
const sendJSONresponse = require('./shared').sendJSONresponse

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

async function ticket_list(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id
    let initial = req.query.initial ? Number(req.query.initial) : null
    let end = req.query.end ? Number(req.query.end) : null
    let pay_type = req.query.pay_type
    let specific_card = req.query.specific_card
    let line = req.query.line

    let query = {
      subsidiary: subsidiary_id,
      payed: true
    }

    if (initial && end) query.date = { $gt: initial, $lt: end }
    if (pay_type) {
      switch (pay_type) {
        case 'cash':
          query.cash_pays = { $gt: [] }
          break
        case 'card':
          query.card_pays = { $gt: [] }
          if (specific_card) {
            query.card_pays = { $elemMatch: {card: specific_card}}
          }
          break
        case 'check':
          query.checks = { $gt: [] }
          break;
      }
    }

    if (line) {
      query.$or = [{ bases: {$elemMatch: {line: line}}}, {paints: {$elemMatch: {line: line}}}]
      //query.paints = { $elemMatch: {line: line}}
    }

    let tickets = await Ticket.find(query).populate('client')
    sendJSONresponse(res, 200, tickets)

  } catch(e) {
    return next(e)
  }
}

async function ticket_sales (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let tickets = await Ticket.find({subsidiary: subsidiary_id, payed: true, canceled: false}).populate('client seller')

    let sales = []

    tickets.map(t => {
      let pay_type = []

      if (t.cash_pays.length > 0) pay_type.push('Efectivo')
      if (t.card_pays.length > 0) pay_type.push('Tarjeta')
      if (t.transfers.length > 0) pay_type.push('Transferencia')
      if (t.checks.length > 0) pay_type.push('Cheque')

      t.products.map(p => {
        let sale = {
          product_id: p.product_id,
          quantity: p.quantity,
          price: p.price,
          folio: t.folio,
          date: t.date,
          pay_type: pay_type,
          card_pays: t.card_pays,
          client: t.client ? t.client.name : 'Venta mostrador',
          seller: t.seller.full_name,
          description: p.description
        }

        sales.push(sale)
      })

      t.bases.map(b => {
        let sale = {
          product_id: b.product_id,
          quantity: b.quantity,
          price: b.price,
          folio: t.folio,
          date: t.date,
          line: b.line,
          pay_type: pay_type,
          card_pays: t.card_pays,
          client: t.client ? t.client.name : 'Venta mostrador',
          seller: t.seller.full_name,
          description: b.description
        }

        sales.push(sale)
      })

      t.paints.map(p => {
        let sale = {
          product_id: p.color,
          quantity: p.quantity,
          line: p.line,
          price: p.price,
          folio: t.folio,
          date: t.date,
          pay_type: pay_type,
          card_pays: t.card_pays,
          client: t.client ? t.client.name : 'Venta mostrador',
          seller: t.seller.full_name
        }

        sales.push(sale)
      })
    })

    sendJSONresponse(res, 200, sales)
  } catch (e) {
    return next(e)
  }
}

async function ticket_details(req, res, next) {
  try {
    const ticket_id = req.params.ticket_id

    let ticket = await Ticket.findById(ticket_id).populate('cash_pays client checks seller').populate({path: 'card_pays', populate: { path: 'card', model: 'Card'}})

    sendJSONresponse(res, 200, ticket)
  } catch(e) {
    return next(e)
  }
}

async function tickets_without_boxcut (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let tickets = await Ticket.find({subsidiary: subsidiary_id, boxcut: {$eq: null}}, '-paints -products -cash_pays -card_pays -transfers -checks -client')

    sendJSONresponse(res, 200, tickets)
  } catch (e) {
    return next(e)
  }
}

async function ticket_create (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let ticket = new Ticket(req.body)
    ticket.subsidiary = subsidiary_id

    //  Función para disminuir la base según la pintura que se compró
    ticket_copy = await Ticket.populate(ticket, {path: 'paints.paint', model: 'Paint'})
    ticket_copy.paints.forEach(async (p) => {
      // Función para disminuir las tintas del inventario
      let paint_presentation = p.paint.presentations.find(pr => pr.name == p.presentation)
      if (paint_presentation) {
        let inks_subsidiary = await InkSubsidiary.find({subsidiary: subsidiary_id}).populate('ink')
        
        const ounce_liters = 0.0295735
        const ounce_part_liters = ounce_liters / 46

        paint_presentation.elements.forEach( async (i) => {
          let is = inks_subsidiary.find( ink => ink.ink.description.includes(`(${i.ink})`))
          if (is) {
            const add = (i.ounce * ounce_liters) + (i.ouncePart * ounce_part_liters)
            if (is.count + add > 1) {
              if (is.stock = 0) return

              is.stock -= 1
              is.count = 1 - is.count + add

              await is.save()
            } else {
              is.count += add
              await is.save()
            }
          }
        })
      }
      Base.find({line: p.paint.line}, 'presentation', (err, bases) => {
        if (err) throw Error(err.message)
        let base = bases.find(b => b.presentation === p.presentation)
        if (base) {
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
        }
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
    const ticket_id = req.params.ticket_id

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

async function incomes_by_date(req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id
    let initial = req.query.initial ? Number(req.query.initial) : null
    let end = req.query.end ? Number(req.query.end) : null

    let query = {
      subsidiary: subsidiary_id,
      payed: true,
      canceled: false
    }

    if (initial && end) query.date = { $gt: initial, $lt: end }

    let tickets = await Ticket.find(query, 'total date')

    sendJSONresponse(res, 200, tickets)
  } catch(e) {
    return next(e)
  }
}

async function ticket_cancel (req, res, next) {
  try {
    const ticket_id = req.params.ticket_id
    const subsidiary_id = req.params.subsidiary_id

    let ticket = await Ticket.findById(ticket_id)

    //  Función para disminuir la base según la pintura que se compró
    ticket_copy = await Ticket.populate(ticket, {path: 'paints.paint', model: 'Paint'})
    ticket_copy.paints.forEach(async (p) => {
      // Función para disminuir las tintas del inventario
      let paint_presentation = p.paint.presentations.find(pr => pr.name == p.presentation)
      if (paint_presentation) {
        let inks_subsidiary = await InkSubsidiary.find({subsidiary: subsidiary_id}).populate('ink')
        
        const ounce_liters = 0.0295735
        const ounce_part_liters = ounce_liters / 46

        paint_presentation.elements.forEach( async (i) => {
          let is = inks_subsidiary.find( ink => ink.ink.description.includes(`(${i.ink})`))
          if (is) {
            const add = (i.ounce * ounce_liters) + (i.ouncePart * ounce_part_liters)
            if (is.count - add < 0) {
              if (is.stock = 0) return

              is.stock += 1
              is.count = 1 - add

              await is.save()
            } else {
              is.count -= add
              await is.save()
            }
          }
        })
      }
      Base.find({line: p.paint.line}, 'presentation', (err, bases) => {
        if (err) throw Error(err.message)
        let base = bases.find(b => b.presentation === p.presentation)
        if (base) {
          BaseSubsidiary.findOne({base: base._id}, (err, bs) => {
            if (bs) {
              bs.stock = bs.stock + p.quantity
              bs.save()
            }
          })
        }
      })
    })

    ticket.canceled = true
    ticket = await ticket.save()

    sendJSONresponse(res, 200, ticket)

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
  incomes_by_date,
  ticket_sales,
  ticket_cancel
}
