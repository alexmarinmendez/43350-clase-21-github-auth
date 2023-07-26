import express from 'express'
import session from 'express-session'
import mongoose from 'mongoose'
import passport from 'passport'
import handlebars from 'express-handlebars'
import myRouter from './routers/session.router.js'
import initializePassport from './config/passport.config.js'

const MONGO_URI = 'mongodb://localhost:27017'
const MONGO_DB_NAME = 'clase21'

const app = express()
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'recuerdoamiex',
    resave: true, saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => res.send('HOME'))
app.use('/api/session', myRouter)

mongoose.set('strictQuery')

try {
    await mongoose.connect(MONGO_URI, {
        dbName: MONGO_DB_NAME
    })
    app.listen(8080, () => console.log('Server Up!'))
} catch(err) {}

