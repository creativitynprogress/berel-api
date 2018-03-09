const sendJSONresponse = require('./shared').sendJSONresponse
const Supplier = require('../models/supplier')


function validate_alphanumeric(val){
    if(val.match(/^[0-9a-zA-Z]+$/))
        return false
    else
       return true    
}

function validate_rfc_length(val){
    if(rfc.lenght < 12 || rfc.lenght > 13)
        return false
    else
        return true    
}

///// check validations looks something bad

async function supplier_create(req, res, next) {
	try {
		const sup = req.sup

        if(validate_alphanumeric(req.body.name) || validate_alphanumeric(req.body.rfc))
            return next(new Error('Nombre y RFC solo admiten caracteres alfanumricos'))
        if(validate_rfc_length(req.body.rfc))
            return next(new Error('RFC incorrecto'))
            
            
		let supplier = new Supplier(req.body)
		
		sendJSONresponse(res, 201, supplier)
	} catch(e) {
		return next(e)
	}
}

async function supplier_read(req,res,next){

    try {
        const supId = req.params.supplierId

        let supplier = await Supplier.find({id: supId })

        sendJSONresponse(res, 200, supplier)
    } catch (error) {
        return next(error)
    }

}


async function supplier_update(req,res,next){
    try {
        const supId = req.params.supplierId
        
        if(validate_alphanumeric(req.body.name) || validate_alphanumeric(req.body.rfc))
            return next(new Error('Nombre y RFC solo admiten caracteres alfanumricos'))
        if(validate_rfc_length(req.body.rfc))
            return next(new Error('RFC incorrecto'))

        let updatedSupplier = await Supplier.findByIdAndUpdate(supId, req.body, {new:true})
        sendJSONresponse(res, 200, updatedSupplier)
    } catch (error) {
        return next(error)
    }

}


async function supplier_delete(req,res,next){
    try {
        const supId = req.params.supplierId
        
        let removedSupplier = await Supplier.findByIdAndRemove(supId)

        sendJSONresponse(res, 200, removedSupplier)
        
    } catch (error) {
        return next(error)
    }
}

















module.exports = {
	supplier_create,
	supplier_read,
	supplier_update,
	supplier_delete
}
