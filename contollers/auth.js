const User = require('../models/user')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError}=require('../errors/') //by default we get back index.js thats why we are not so specific
// const bcrypt = require('bcryptjs') //used to store hashed passwords in database
const {UnauthenticatedError} = require('../errors/')
const register = async(req,res) =>{

    const user = await User.create({...req.body})
   
    res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token:user.createJWT() }) //sending back our token
}

const login = async(req,res) =>{
    const {email,password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    
    if(!user)
      throw new UnauthenticatedError('Invalid Credentials')

      const isPasswordCorrect = await user.comparePassword(password)
     
    if(!isPasswordCorrect)
      throw new UnauthenticatedError('Invalid Credentials')
// compare password

res.status(StatusCodes.OK).json({name:user.name,token:user.createJWT()})


}

module.exports = {
    register,
    login
}