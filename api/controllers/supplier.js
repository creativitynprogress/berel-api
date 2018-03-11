const sendJSONresponse = require('./shared').sendJSONresponse
const Supplier = require('../models/supplier')


function validate_alphanumeric(val){
    console.log("verifyn alpha de: ",val)
    if(val.match(/^[0-9a-zA-Z]+$/))
        return false
    else
       return true    
}

function validate_rfc_length(rfc){
    console.log("verifyn lenght del rfc: ",rfc, "   con lenght de: ", rfc.length)

    if(rfc.length== 12 || rfc.length ==  13)
        return true 
    else
        return false    
}

///// check validations looks something bad

async function supplier_create(req, res, next) {
	try {
        console.log("name is: ",req.body.name)
        console.log("rfc is: ",req.body.rfc)

        if(validate_alphanumeric(req.body.name) || validate_alphanumeric(req.body.rfc))
            return next(new Error('Nombre y RFC solo admiten caracteres alfanumricos'))
        if(validate_rfc_length(req.body.rfc) == false)
            return next(new Error('RFC con longitud incorrecta'))
            
            
        let newSupplier = new Supplier(req.body)
        let createdSupplier = await newSupplier.save();
		
		sendJSONresponse(res, 201, createdSupplier)
	} catch(e) {
		return next(e)
	}
}

async function supplier_read_one(req,res,next){

    try {
        const supId = req.params.supplierId

        let supplier = await Supplier.findById(supId)

        sendJSONresponse(res, 200, supplier)
    } catch (error) {
        return next(error)
    }

}

async function supplier_read(req,res,next){

    try {

        let suppliers_list = await Supplier.find({})

        sendJSONresponse(res, 200, suppliers_list)
    } catch (error) {
        return next(error)
    }

}

async function supplier_update(req,res,next){
    try {
        const supId = req.params.supplierId
        
        if(validate_alphanumeric(req.body.name) || validate_alphanumeric(req.body.rfc))
            return next(new Error('Nombre y RFC solo admiten caracteres alfanumricos'))
        if(validate_rfc_length(req.body.rfc) == false)
            return next(new Error('RFC con longitud incorrecta'))

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
    supplier_read_one,
	supplier_update,
	supplier_delete
}
