const CustomAPIError=require('./custom-error')
const BadRequestError=require('./bad-request')
const NotFoundError = require('./not-found')
const UnauthenticatedError=require('./unauthenticated')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
}

