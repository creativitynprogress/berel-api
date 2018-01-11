const SubsidiaryRange = require('../models/subsidiaryrange')
const Range = require('../models/range')
const sendJSONresponse = require('./shared').sendJSONresponse

async function sr_create (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId
		const line_id = req.params.lineId
		const range_id = req.params.rangeId

		let sr = new SubsidiaryRange(req.body)
		sr.subsidiary = subsidiary_id
		sr.line = line_id
		sr.range = range_id

		sr = await sr.save()

		sendJSONresponse(res, 201, sr)
	} catch (e) {
		return next(e)
	}
}

async function sr_by_line (req, res, next) {
	try {
		const subsidiary_id = req.params.subsidiaryId
		const line_id = req.params.lineId

		const ranges = await Range.find({line: line_id})
		const subsidiary_ranges = await SubsidiaryRange.find({subsidiary: subsidiary_id, line: line_id})

		let ranges_response = ranges.map(r => {
			let sr = subsidiary_ranges.find(sr => sr.range.equals(r._id))
			if (sr) {
				let range = {
					range: r,
					sr: sr
				}
				return range
			} else {
				let range = {
					range: r,
					sr: null
				}
				return range
			}
		})

		sendJSONresponse(res, 200, ranges_response)
	} catch (e) {
		return next(e)
	}
}

async function sr_update (req, res, next) {
	try {
		const sr_id = req.params.subsidiaryrangeId

		let subsidiary_range = await SubsidiaryRange.findByIdAndUpdate(sr_id, req.body, {new: true})

		sendJSONresponse(res, 200, subsidiary_range)
	} catch (e) {
		return next (e)
	}
}


module.exports = {
	sr_create,
	sr_by_line,
	sr_update,
}