const sendJSONresponse = require('./shared').sendJSONresponse
const Employee = require('../models/employee')

async function employee_create (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let employee = new Employee(req.body)
    //employee = Object.assign(employee, req.body)
    employee.subsidiary = subsidiary_id

    employee = await employee.save()

    sendJSONresponse(res, 201, employee)
  } catch(e) {
    console.log(e)
    return next(e)
  }
}

async function employee_list (req, res, next) {
  try {
    const subsidiary_id = req.params.subsidiary_id

    let employees = await Employee.find({subsidiary: subsidiary_id}, 'email enable full_name role')

    sendJSONresponse(res, 200, employees)
  } catch(e) {
    return next(e)
  }
}

async function employee_update (req, res, next) {
  try {
    const employee_id = req.params.employee_id
    let employee = await Employee.findById(employee_id)
    employee = Object.assign(employee, req.body)
    employee = await employee.save()
    delete employee.password

    sendJSONresponse(res, 200, employee)
  } catch (e) {
    return next(e)
  }
}

async function employee_change_state (req, res, next) {
  try {
    const employee_id = req.params.employee_id

    let employee = await Employee.findByIdAndUpdate(employee_id, req.body, { new: true, fields: 'full_name email role subsidiary enable' })

    sendJSONresponse(res, 200, employee)
  }catch (e) {
    return next(e)
  }
}

module.exports = {
  employee_create,
  employee_list,
  employee_update,
  employee_change_state
}
