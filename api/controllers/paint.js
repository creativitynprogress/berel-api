'use strict'

const Paint = require('../models/paint')
const SubsidiaryRange = require('../models/subsidiaryrange')
const sendJSONresponse = require('./shared').sendJSONresponse
const excelReader = require('../utils/excelReader')
const multer = require('multer')
const fs = require('fs')
const path = require('path');
async function paint_create(req, res, next) {
    try {
        const user = req.user

        let paint = new Paint(req.body)
        paint = await paint.save()
        paint = await Paint.populate(paint, 'line range')
        sendJSONresponse(res, 201, paint)
    } catch(e) {
        return next(e)
    }
}

async function paint_details(req, res, next) {
    try {
        const paint_id = req.params.paintId

        const paint = await Paint.findById(paint_id).populate('line range')

        sendJSONresponse(res, 200, paint)
    } catch(e) {
        return next(e)
    }
}

async function paint_details_for_users(req, res, next) {
  try {
    const paint_id = req.params.paintId

    let paint = await Paint.findById(paint_id).populate('line range')
    let sr = await SubsidiaryRange.findOne({range: paint.range._id})

    let presentations_format = paint.presentations.map(p => {
            let presentation
            let sr_liter = null
            let sr_gallon = null
            let sr_bucket = null

            if (p.name === '1L') {
                if (sr && (sr.liter != null && sr.liter > 0)) {
                    sr_liter = sr.liter
                }
                presentation = {
                    _id: p._id,
                    name: p.name,
                    elements: p.elements,
                    suggestedPrice: paint.range.liter,
                    salePrice: sr_liter
                }
            } else if (p.name === '4L') {
                if (sr && sr.gallon != null && sr.gallon > 0) {
                    sr_gallon = sr.gallon
                }
                presentation = {
                    _id: p._id,
                    name: p.name,
                    elements: p.elements,
                    suggestedPrice: paint.range.gallon,
                    salePrice: sr_gallon
                }
            } else {
                if (sr && sr.bucket != null && sr.bucket > 0) {
                    sr_bucket = sr.bucket
                }
                presentation = {
                    _id: p._id,
                    name: p.name,
                    elements: p.elements,
                    suggestedPrice: paint.range.bucket,
                    salePrice: sr_bucket
                }
            }
            return presentation
        })

    let paint_response = {
        _id: paint._id,
        presentations: presentations_format,
        category: paint.category,
        line: paint.line,
        color: paint.color,
        base: paint.base,
        enable: paint.enable
    }

    sendJSONresponse(res, 200, paint_response)

  } catch(e) {
    return next(e)
  }
}

async function paint_update(req, res, next) {
    try {
        const paint_id = req.params.paintId

        let paint = await Paint.findById(paint_id)

        paint = Object.assign(paint, req.body)
        paint = await paint.save()

        sendJSONresponse(res, 200, paint)
    } catch(e) {
        return next(e)
    }
}

async function paint_delete(req, res, next) {
    try {
        const paint_id = req.params.paintId

        let paint = await Paint.findByIdAndRemove(paint_id)

        sendJSONresponse(res, 200, paint)
    } catch(e) {
        return next(e)
    }
}

async function paint_list(req, res, next) {
    try {
        const user = req.user
        const lineId = req.query.lineId
        let paints = []

        if (lineId) {
            paints = await Paint.find(
            {
                line: lineId, 
                $or: [{user: user._id}, {user: {$exists: false}}]
            }, '-presentations').populate('line range')
        } else {
            paints = await Paint.find({$or: [{user: user._id}, {user: {$exists: false}}]}, '-presentations').populate('line range')
        }

        sendJSONresponse(res, 200, paints)
    } catch(e) {
        return next(e)
    }
}

async function paint_owner_list(req, res, next) {
    try {
        const user = req.user

        let paints = await Paint.find({user: user._id}, '-presentations').populate('line range')

        sendJSONresponse(res, 200, paints)
    } catch(e) {
        return next(e)
    }
}

async function presentation_create(req, res, next) {
  try {
    const paint_id = req.params.paintId
    const name = req.body.name
    const base = req.body.base
    const elements = req.body.elements

    if (!name || !elements) throw Error('name and elements are requireds')

    let paint = await Paint.findById(paint_id)

    if (!paint) throw Error('Paint not found')

    let presentation = {
      name: name,
      base: base,
      elements: elements
    }

    paint.presentations.push(presentation)

    paint = await paint.save()

    sendJSONresponse(res, 201, paint.presentations)
  } catch(e) {
    return next(e)
  }
}

async function presentation_update(req, res, next) {
  try {
    const presentation_id = req.params.presentationId
    const paint_id = req.params.paintId
    const name = req.body.name
    const base = req.body.base
    const elements = req.body.elements

    if (!name  || !elements) throw Error('name and elements are requireds')

    let paint = await Paint.findById(paint_id)
    if (!paint) throw Error('Paint not found')

    let presentation = paint.presentations.id(presentation_id)
    presentation.set({name: name, base: base, elements: elements})

    paint = await paint.save()

    sendJSONresponse(res, 200, paint.presentations)
  } catch(e) {
    return next(e)
  }
}

async function presentation_delete(req, res, next) {
  try {
    const paint_id = req.params.paintId
    const presentation_id = req.params.presentationId

    let paint = await Paint.findById(paint_id)
    if (!paint) throw Error('Paint not found')

    let presentation = paint.presentations.id(presentation_id).remove()
    paint = await paint.save()

    sendJSONresponse(res, 200, presentation)
  } catch(e) {
    return next(e)
  }
}

/*
    Future feature: Use Multer storage to prevent
    the upload of no EXCEL files
    or let the forntend take care about it
*/

async function paints_by_excel(req, res, next) {
    try {
         let lineId = req.params.lineId
         let filename =req.file.filename
         console.log(req.file)
         let smthng = await  excelReader.saveExcel(req,res,lineId,filename)
         let file_path = path.resolve('./uploads',filename)
         fs.unlinkSync(file_path)
         sendJSONresponse(res,200,smthng)
    } catch (e) {
        return next (e)
    }
}

module.exports = {
    paint_create,
    paint_details,
    paint_details_for_users,
    paint_update,
    paint_delete,
    paint_list,
    paint_owner_list,
    presentation_create,
    presentation_update,
    presentation_delete,
    paints_by_excel
}
