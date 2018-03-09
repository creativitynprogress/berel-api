module.exports = (app, io) => {
    const express = require('express')
    const passportService = require('../config/passport')
    const passport = require('passport')
    const multer = require('multer');

    const authenticathion_controller = require('../controllers/authentication')
    const paints_controller = require('../controllers/paint')
    const products_controller = require('../controllers/product')
    const base_controller = require('../controllers/base')
    const bs_controller = require('../controllers/basesubsidiary')

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
    const supplier_controller = require('../controllers/supplier')

    const pb_controller = require('../controllers/purchasebase')

    const require_auth = passport.authenticate('jwt', {
        session: false
      })

    const require_login = passport.authenticate('local', {
        session: false
    })

    const api_routes = express.Router()
    const auth_routes = express.Router()

    api_routes.use('/auth', auth_routes)
    auth_routes.post('/register', authenticathion_controller.register)
    auth_routes.post('/login', require_login, authenticathion_controller.login)

    api_routes.post('/subsidiary', require_auth, subsidiary_controller.subsidiary_create)
    api_routes.get('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_details)
    api_routes.get('/subsidiary', require_auth, subsidiary_controller.subsidiary_list)
    api_routes.put('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_update)
    api_routes.delete('/subsidiary/:subsidiaryId', require_auth, subsidiary_controller.subsidiary_delete)

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

    //  Cards
    api_routes.post('/card', require_auth, card_controller.card_create)
    api_routes.get('/card', require_auth, card_controller.card_list)
    api_routes.delete('/card/:cardId', require_auth, card_controller.card_delete)

    //  BaseSubsidiary
    api_routes.post('/subsidiary/:subsidiaryId/basesubsidiary', require_auth, bs_controller.bs_create)
    api_routes.get('/subsidiary/:subsidiaryId/basesubsidiary', require_auth, bs_controller.bs_list)
    api_routes.put('/subsidiary/:subsidiaryId/basesubsidiary/:bsId', require_auth, bs_controller.bs_update)
    api_routes.delete('/subsidiary/:subsidiaryId/basesubsidiary/:bsId', require_auth, bs_controller.bs_delete)

    //  Purchase Base
    api_routes.post('/subsidiary/:subsidiary_id/purchase_base', require_auth, pb_controller.pb_create)
    api_routes.get('/subsidiary/:subsidiary_id/purchase_base', require_auth, pb_controller.pb_list)

    api_routes.post('/line/:lineId/range', require_auth, range_controller.range_create)
    api_routes.get('/line/:lineId/range', require_auth, range_controller.range_by_line)
    api_routes.put('/line/:lineId/range/:rangeId', require_auth, range_controller.range_update)
    api_routes.delete('/line/:lineId/range/:rangeId', require_auth, range_controller.range_delete)

    api_routes.post('/paint', require_auth, paints_controller.paint_create)
    api_routes.get('/paint', require_auth, paints_controller.paint_list)
    api_routes.get('/paint/owner', require_auth, paints_controller.paint_owner_list)
    api_routes.get('/paint/:paintId', require_auth, paints_controller.paint_details)
    api_routes.get('/paint/user/:paintId', require_auth, paints_controller.paint_details_for_users)
    api_routes.put('/paint/:paintId', require_auth, paints_controller.paint_update)
    api_routes.delete('/paint/:paintId', require_auth, paints_controller.paint_delete)
    api_routes.post('/paint/:paintId/presentation', require_auth, paints_controller.presentation_create)
    api_routes.put('/paint/:paintId/presentation/:presentationId', require_auth, paints_controller.presentation_update)
    api_routes.delete('/paint/:paintId/presentation/:presentationId', require_auth, paints_controller.presentation_delete)
   
    /// route to create paints BY EXCEL
    const upload = multer({ dest: 'uploads/' })
    api_routes.post('/excelupload/:lineId', upload.single('file-to-upload'), paints_controller.paints_by_excel ) /// upload file feature

    api_routes.post('/product', require_auth, products_controller.product_create)
    api_routes.get('/product', require_auth, products_controller.product_list)
    api_routes.put('/product/:productId', require_auth, products_controller.product_update)
    api_routes.delete('/product/:productId', require_auth, products_controller.product_delete)

    //  Ticket
    api_routes.get('/subsidiary/:subsidiaryId/ticket', require_auth, tickets_controller.ticket_list)
    api_routes.get('/subsidiary/:subsidiaryId/ticket/noboxcut', require_auth, tickets_controller.tickets_without_boxcut)
    api_routes.get('/subsidiary/:subsidiaryId/ticket/:ticket_id', require_auth, tickets_controller.ticket_details)
    api_routes.post('/subsidiary/:subsidiaryId/ticket', require_auth, tickets_controller.ticket_create)
    api_routes.put('/subsidiary/:subsidiaryId/ticket/:ticketId', require_auth, tickets_controller.ticket_update)
    //  Cash Payments
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment', require_auth, cash_payment_controller.cp_create)
    api_routes.get('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment/by_ticket', require_auth, cash_payment_controller.cp_list_by_ticket)
    api_routes.delete('/subsidiary/:subsidiary_id/ticket/:ticket_id/cash_payment/:cp_id', require_auth, cash_payment_controller.cp_delete)
    //  Card Payments
    api_routes.post('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment', require_auth, card_payment_controller.cp_create)
    api_routes.get('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment/by_ticket', require_auth, card_payment_controller.cp_list_by_ticket)
    api_routes.delete('/subsidiary/:subsidiary_id/ticket/:ticket_id/card_payment/:cp_id', require_auth, card_payment_controller.cp_delete)

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

    //supplier
    api_routes.post('/supplier', require_auth, supplier_controller.supplier_create)
    api_routes.get('/supplier', require_auth, supplier_controller.supplier_read)
    api_routes.put('/supplier/:supplierId', require_auth, supplier_controller.supplier_update)
    api_routes.delete('/supplier/:supplierId', require_auth, supplier_controller.supplier_delete)

    app.use('/api', api_routes)
}
