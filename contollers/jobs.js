const Job = require('../models/job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res) =>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})

}

const getJob = async(req,res) =>{
    const {user:{userId},params:{id:jobId}} = req //Nested DEstructuring from a single request object 
    const job = await Job.findOne({_id:jobId,createdBy:userId})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    else{
        res.status(StatusCodes.OK).json({job})
    }
}

const createJob = async(req,res) =>{
    req.body.createdBy = req.user.userId //add createdBy property with jobs and position
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res) =>{
    const {
        body:{company,position},
        user:{userId},
        params:{ id:jobId }
    } = req 

    if(company == '' || position == '')
        throw new BadRequestError('Company or Position  fields cannot be empty')
    
    const job = await Job.findOneAndUpdate({_id:jobId,createdBy:userId},req.body,{new:true,runValidators:true})
    //req.body for jobs have to update, third optional parameters is options new is getting updated job and stored in (job) runValidators for to run Mongoose validator in new incoming jobs

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    else{
        res.status(StatusCodes.OK).json({job})
    }
}

const deleteJob = async(req,res) =>{
    const {
        user:{userId},
        params:{ id:jobId }
    } = req 

    const job = await Job.findOneAndDelete({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    else{
        res.status(StatusCodes.OK).send()
    }

}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}