module.exports = (app, io) => {
    const express = require('express')
    const require_auth = require('../middlewares/auth').require_auth
    const require_login = require('../middlewares/auth').require_login

    const authenticathion_controller = require('../controllers/authentication')
    const subscriptions_controller = require('../controllers/subscriptions')
    const user_controller = require('../controllers/user')
    const employee_controller = require('../controllers/employee')
    const products_controller = require('../controllers/product')
    const base_controller = require('../controllers/base')
    const ink_controller = require('../controllers/ink')
    const sb_controller = require('../controllers/subsidiarybase')
    const is_controller = require('../controllers/inksubsidiary')

    const tickets_controller = require('../controllers/ticket')
    const cash_payment_controller = require('../controllers/cashpayment')
    const card_payment_controller = require('../controllers/cardpayment')
    const transfer_controller = require('../controllers/transfer')
    const check_controller = require('../controllers/check')

    const subsidiary_controller = require('../controllers/subsidiary')
    const line_controller = require('../controllers/line')
    const range_controller = require('../controllers/range')
    const sr_controller = require('../controllers/subsidiaryrange')
    const sp_controller = require('../controllers/subsidiaryproduct')
    const po_controller = require('../controllers/productowner')
    const boxcut_controller = require('../controllers/boxcut')
    const client_controller = require('../controllers/client')
    const card_controller = require('../controllers/card')
    const provider_controller = require('../controllers/provider')

    const purchase_controller = require('../controllers/purchase')

    const api_routes = express.Router()
    const auth_routes = express.Router()
    const paint_routes = require('./paint')

    api_routes.use('/paint', paint_routes)

    api_routes.use('/auth', auth_routes)
    auth_routes.post('/register', authenticathion_controller.register)
    auth_routes.post('/login', require_login, authenticathion_controller.login)

    //  User
    api_routes.put('/user', require_auth, user_controller.user_update)

    //  Employee
    api_routes.post('/subsidiary/:subsidiary_id/employee', require_auth, employee_controller.employee_create)
    api_routes.get('/subsidiary/:subsidiary_id/employee', require_auth, employee_controller.employee_list)
    api_routes.put('/subsidiary/:subsidiary_id/employee/:employee_id', require_auth, employee_controller.employee_update)
    api_routes.patch('/subsidiary/:subsidiary_id/employee/:employee_id/state', require_auth, employee_controller.employee_change_state)

    api_routes.post('/subsidiary', require_auth, subsidiary_controller.subsidiary_create)
    api_routes.get('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_details)
    api_routes.get('/subsidiary', require_auth, subsidiary_controller.subsidiary_list)
    api_routes.put('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_update)
    api_routes.delete('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_delete)

    //  Provider
    api_routes.post('/provider', require_auth, provider_controller.provider_create)
    api_routes.get('/provider', require_auth, provider_controller.provider_list)

    //  Rangos
    api_routes.post('/subsidiary/:subsidiaryId/line/:lineId/range/:rangeId/sr', require_auth, sr_controller.sr_create)
    api_routes.get('/subsidiary/:subsidiaryId/line/:lineId/sr', require_auth, sr_controller.sr_by_line)
    api_routes.put('/subsidiary/:subsidiaryId/line/:lineId/range/:rangeId/sr/:subsidiaryrangeId', require_auth, sr_controller.sr_update)

    api_routes.post('/subsidiary/:subsidiaryId/product/:productId/sp', require_auth, sp_controller.sp_create)
    api_routes.get('/subsidiary/:subsidiaryId/sp', require_auth, sp_controller.sp_list)

    api_routes.post('/subsidiary/:subsidiaryId/productowner', require_auth, po_controller.po_create)
    api_routes.put('/subsidiary/:subsidiaryId/productowner/:poId', require_auth, po_controller.po_update)
    api_routes.delete('/subsidiary/:subsidiaryId/productowner/:poId', require_auth, po_controller.po_delete)

    //  Lineas
    api_routes.post('/line', require_auth, line_controller.line_create)
    api_routes.get('/line', require_auth, line_controller.line_list)
    api_routes.put('/line/:lineId', require_auth, line_controller.line_update)
    api_routes.delete('/line/:lineId', require_auth, line_controller.line_delete)

    //  Base
    api_routes.post('/base', require_auth, base_controller.base_create)
    api_routes.get('/base', require_auth, base_controller.base_list)
    api_routes.put('/base/:baseId', require_auth, base_controller.base_update)
    api_routes.delete('/base/:baseId', require_auth, base_controller.base_delete)

    //  Tintas (Inks)
    api_routes.post('/ink', require_auth, ink_controller.ink_create)
    api_routes.get('/ink', require_auth, ink_controller.ink_list)
    api_routes.delete('/ink/:ink_id', require_auth, ink_controller.ink_delete)

    //  Cards
    api_routes.post('/card', require_auth, card_controller.card_create)
    api_routes.get('/card', require_auth, card_controller.card_list)
    api_routes.delete('/card/:cardId', require_auth, card_controller.card_delete)

    //  BaseSubsidiary
    api_routes.post('/subsidiary/:subsidiaryId/basesubsidiary', require_auth, sb_controller.bs_create)
    api_routes.get('/subsidiary/:subsidiary_id/basesubsidiary/for_sale', require_auth, sb_controller.bs_for_sale)
    api_routes.get('/subsidiary/:subsidiaryId/basesubsidiary', require_auth, sb_controller.bs_list)
    api_routes.put('/subsidiary/:subsidiaryId/basesubsidiary/:bsId', require_auth, sb_controller.bs_update)
    api_routes.delete('/subsidiary/:subsidiaryId/basesubsidiary/:bsId', require_auth, sb_controller.bs_delete)

    //  InkSubsidiary
    api_routes.get('/subsidiary/:subsidiary_id/inksubsidiary', require_auth, is_controller.is_list)
    api_routes.put('/subsidiary/:subsidiary_id/inksubsidiary/:is_id', require_auth, is_controller.is_update)

    //  Purchase
    api_routes.post('/subsidiary/:subsidiary_id/purchase', require_auth, purchase_controller.purchase_create)
    api_routes.get('/subsidiary/:subsidiary_id/purchase', require_auth, purchase_controller.purchase_list)
    api_routes.delete('/subsidiary/:subsidiary_id/purchase/:purchase_id', require_auth, purchase_controller.purchase_delete)
    api_routes.get('/subsidiary/:subsidiary_id/purchase/analysis', require_auth, purchase_controller.purchase_analysis)

    api_routes.post('/line/:lineId/range', require_auth, range_controller.range_create)
    api_routes.get('/line/:lineId/range', require_auth, range_controller.range_by_line)
    api_routes.put('/line/:lineId/range/:rangeId', require_auth, range_controller.range_update)
    api_routes.delete('/line/:lineId/range/:rangeId', require_auth, range_controller.range_delete)

    api_routes.post('/product', require_auth, products_controller.product_create)
    api_routes.get('/product', require_auth, products_controller.product_list)
    api_routes.put('/product/:productId', require_auth, products_controller.product_update)
    api_routes.delete('/product/:productId', require_auth, products_controller.product_delete)

    //  Ticket
    api_routes.get('/ticket/:ticket_id', require_auth, tickets_controller.ticket_details)
    api_routes.get('/ticket/client/:client_id', require_auth, tickets_controller.tickets_by_clientid)
    api_routes.put('/ticket/:ticket_id/set_invoiced', require_auth, tickets_controller.ticket_set_invoiced)

    api_routes.get('/subsidiary/:subsidiary_id/ticket', require_auth, tickets_controller.ticket_list)
    api_routes.get('/subsidiary/:subsidiary_id/sales', require_auth, tickets_controller.ticket_sales)
    api_routes.get('/subsidiary/:subsidiary_id/ticket/noboxcut', require_auth, tickets_controller.tickets_without_boxcut)
    api_routes.post('/subsidiary/:subsidiary_id/ticket', require_auth, tickets_controller.ticket_create)
    api_routes.put('/subsidiary/:subsidiary_id/ticket/:ticket_id', require_auth, tickets_controller.ticket_update)
    api_routes.get('/subsidiary/:subsidiary_id/tickets_to_invoice', require_auth, tickets_controller.tickets_to_invoice)
    api_routes.get('/subsidiary/:subsidiary_id/incomes_by_date', require_auth, tickets_controller.incomes_by_date)

    //  Cash Payments
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment', require_auth, cash_payment_controller.cp_create)
    api_routes.get('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment/by_ticket', require_auth, cash_payment_controller.cp_list_by_ticket)
    api_routes.delete('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment/:cp_id', require_auth, cash_payment_controller.cp_delete)
    //  Card Payments
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment', require_auth, card_payment_controller.cp_create)
    api_routes.get('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment/by_ticket', require_auth, card_payment_controller.cp_list_by_ticket)
    api_routes.delete('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment/:cp_id', require_auth, card_payment_controller.cp_delete)
    //  Check
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/check', require_auth, check_controller.check_create)
    //  Transfer
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/transfer', require_auth, transfer_controller.transfer_create)

    //  Boxcut
    api_routes.post('/subsidiary/:subsidiaryId/boxcut', require_auth, boxcut_controller.boxcut_create)
    api_routes.get('/subsidiary/:subsidiaryId/boxcut', require_auth, boxcut_controller.boxcut_list)
    api_routes.post('/subsidiary/:subsidiaryId/boxcut/request', require_auth, boxcut_controller.boxcut_request)
    api_routes.get('/subsidiary/:subsidiaryId/boxcut/:boxcutId', require_auth, boxcut_controller.boxcut_details)

    //  Client
    api_routes.post('/client', require_auth, client_controller.client_create)
    api_routes.get('/client', require_auth, client_controller.client_list)
    api_routes.put('/client/:clientId', require_auth, client_controller.client_update)
    api_routes.delete('/client/:clientId', require_auth, client_controller.client_delete)

    //  Subscriptions
    api_routes.post('/customer/add_card', require_auth, subscriptions_controller.add_card_to_customer)
    api_routes.get('/customer/cards', require_auth, subscriptions_controller.cards_list)

    app.use('/api', api_routes)
}
