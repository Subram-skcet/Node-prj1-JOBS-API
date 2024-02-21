require('dotenv').config()
require('express-async-errors')

//extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter=require('express-rate-limit')

const express = require('express')
const app = express()

//connectDB
const connectDB=require('./db/connect')
const authenticateUser = require('./middleware/auth')
//routers
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

//error handler
const notFoundMIddleware = require('./middleware/not_found')
const errorHandlerMiddleware = require('./middleware/error_handler')

app.use(express.json())

app.set('trust proxy',1);
//extra packages
app.use(rateLimiter({
    windowMs:15 * 60 * 1000, //15 minutes
    max:100,  //limit each IP to requests 100 requests per windowMs
}))
app.use(helmet())
app.use(cors())
app.use(helmet())
app.use(xss())



app.get('/',(req,res)=>{
    res.send('jobs api')
})
//routes
app.use('/api/v1/auth',authRouter)   // /(must) before api
app.use('/api/v1/jobs',authenticateUser,jobsRouter)


app.use(notFoundMIddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start=async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port}..`))
    } catch (error) {
        console.log(error);
    }
}

start()