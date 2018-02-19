


const xlsx = require('node-xlsx').default
const sendJSONresponse = require('../controllers/shared')
const Paint = require('../models/paint')
const mongoose = require('mongoose')
const Range = require('../models/range')
const path = require('path');

/******FEATURES TO ADD*********/
// Try to put a return somethign to the paint.js file so it can be visualice on the send jsonresponse, check line 154
// Checkout how the catch error handler works, cause it doesnt notify out there 
// check and throw error when on those ifs like in line 88 the celt is not valid (1/2 for exS)

let paints = []
let paintName///color
let line   
const category = 'Base agua' /// this can change with the sheet .
let base 

let range 
let presentations = [] // objs array
let presentationsName // name 1l,4l,19l 
let onelts = []
let fourlts =[]
let nineteenlts = []

let values = [] ///objs array
let colorant // ink .
let ounce
let ouncePart
let flag = false


async function saveExcel(req, res, linea, file_name) {
    line = linea
    console.log('SaveExcel')
    try {   
            let file_path = path.resolve('./uploads',file_name)
            const workSheetsFromFile = xlsx.parse(file_path)     
            let rangoObj = await Range.find({line:line})
            let FileLength = workSheetsFromFile[0].data.length
          

            workSheetsFromFile[0].data.forEach(function(val,j) {
                let cont = true    
                if(j === FileLength -1){ //for save the last element
                    flag = true
                }

                if(val.length === 0 || val.includes('COLOR') ){ /// dont let read headers or empty lines
                    console.log('esta wea esta vacia')
                    cont = false
                }
                
                if(val[0] !== undefined){
                        if(( typeof(val[0])== 'number' || val[0].includes('-') || val[0].includes(' ') ) && onelts.length > 0 && cont === true ) {
                            console.log(j,': ',val,'=> ',typeof(val), ' ::: ', FileLength) //This one are going to print just the PAINTS to create, except the lastone
                            savePresentation(onelts,fourlts,nineteenlts) 
                            onelts = []
                            fourlts= []
                            nineteenlts= []
                        }
                }
                if(cont === true){
                    workSheetsFromFile[0].data[j].forEach( function(value,i) {  
                        switch (i) {
                                case 0:
                                {
                                    if(typeof(value)== 'number' || value.includes('-') || value.includes(' '))
                                        paintName = value  
                                    break;
                                }
                                case 1:
                                {
                                    base = value
                                    break;
                                }
                                case 2:
                                {
                                    colorant = value
                                    break;
                                }
                                case 3:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 4:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 5:
                                {
                                    if(typeof(value) === "string"){
                                        if(value.includes('Y')){
                                            let  arr = valueSpliter(value)
                                            ounce = arr[0]
                                            ouncePart = arr[2]
                                            saveElement(i,colorant,ounce,ouncePart)
                                        }
                                    }else{
                                        ounce = 0
                                        ouncePart = value
                                        saveElement(i,colorant,ounce,ouncePart)
                                    }
                                    break;
                                }
                                case 6:
                                {

                                    if(value.includes('R-')){
                                        for (let index = 0; index < rangoObj.length; index++) {
                                                if(rangoObj[index].range === value) {
                                                        range = rangoObj[index]._id
                                                        break
                                                    }
                                        }                                        
                                    } 
                                                
                                    break
                                }
                                default:
                                    break
                        }//switch
                    });//foreach data[]
                }///if
            });// foreach data
    if (flag===true) {
        savePresentation(onelts,fourlts,nineteenlts)
    }   
    return 'Looks, like everything upload fine'    /// This could be de PAINTS obj that is commented on line: 244
    } catch (error) {
        return error
    }
}/// saveexcel

function valueSpliter(str){
    arr = str.split(" ")
    return arr
}

function saveElement(i,colorant,ounce,ouncePart){
    
    let element ={
        ink: colorant,
        ounce: ounce,
        ouncePart: ouncePart
    }
    
    //save our element in the array 
    switch (i) {
        case 3:
            {
                onelts.push(element)
                break;
            }
        case 4:
            {
                fourlts.push(element)
                break;
            }
        case 5:
            {
                nineteenlts.push(element)
                break;
            }            
    
        default:
            break;
    }

}

function savePresentation(onelts,fourlts,nineteenlts){
    let elementarr
    for (let index = 0; index < 3; index++) {
        switch (index) {
            case 0:
                {
                    presentationsName = '1L'
                    elementarr = onelts
                    break
                }
            case 1:
                {
                    presentationsName = '4L'
                    elementarr = fourlts
                    break
                }
            case 2:
                {
                    presentationsName = '19L'
                    elementarr = nineteenlts
                    break
                }
            default:
                break;
        }
        let presentation ={
            name: presentationsName,
            elements: elementarr
        }
        elementarr = []
       presentations.push(presentation)
    }
    savePaint(presentations)
    presentations = []
}

async function savePaint(presentations){

    try {
        let paint = new Paint ({
            color: paintName,
            category: category,
            presentations: presentations,
            base: base,
            line: line,
            range: range
        })
//        paints.push(paint) 
        paint = await paint.save()
    } catch (error) {
        console.log('dude, un error al save PAINT:  ', error)
        return error
    }
}

module.exports= {
    saveExcel
}