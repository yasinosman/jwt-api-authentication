//Import requirements
const express   = require('express')
const mongoose  = require('mongoose')
const dotenv    = require('dotenv')
const cors		= require('cors')
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())


//Connect to db
mongoose.connect(process.env.DATABASE_URI, {
	useNewUrlParser : true,
	useUnifiedTopology : true
}, (err) => {
	err ? console.log(err) : console.log('db connected')
})
//App config


//Import routes
const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')

//Route middlewares
app.use('/auth', authRouter)
app.use('/users', userRouter)

//Test private routes
const auth = require('./middleware/auth')
app.get('/posts', auth.verifyToken, (req, res) => {
	return res.json(
		{
			message	: "You hit the private route",
			user	: req.user
		}
	)
})



//Express listener 
const PORT = process.env.PORT || 3000
app.listen(PORT , (err) => {
    err ? console.log(err) : console.log(`Server is running on port ${PORT}`)
})