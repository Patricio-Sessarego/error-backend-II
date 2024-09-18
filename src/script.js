import initializePassport from './config/passport.config.js'
import sessionRouter from './routes/sessions.router.js'
import viewRouter from './routes/views.router.js'
import { connectDB } from './config/index.js'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import express from 'express'

//CLASE 4 | ESTRATEGIAS DE AUTENTICACION
//=> AUTENTICACION POR TERCEROS EN GITHUB
//=> RUTA INICIAL --> MANDA A LLAMAR A PASSPORT Y ACTIVA LA REDIRECCION
//=> RUTA CALLBACK --> DONDE LLEGA EL DATO DEL USUARIO FINAL OTORGADO POR PASSPORT

//=> npm i passport-github2
//=> CLIENT ID --> Client ID: Iv23li377IMa5eIGCHfH
//=> RUTA --> http://localhost:8080/api/sessions/githubcallback

//=> JWT | JSON WEB TOKEN
//=> PAGINA --> https://jwt.io/
//=> DEPENDENCIA --> npm i jsonwebtoken
//=> EL SERVIDOR GENERARA UN TOKEN CON LA INFORMACION DEL USUARIO Y LA ENVIARA AL NAVEGADOR
//=> EL NAVEGADOR ALAMACENARA DICHO TOKEN Y PROCEDERA A ENVIARLO EN CADA REQUEST POR MEDIO DE LOS HEADERS
//=> EL SERVIDOR RECIBLE LAS PETICIONES, BUSCA EL TOKEN DE JWT EN LOS HEADERS. SI LO ENCUENTRA, PODRA ACCEDER, SI NO, REQUERIRA AUTENTICACION NUEVAMENTE

const app = express()
const PORT = 8080

//HANDLEBARS
app.engine("handlebars" , handlebars.engine())
app.set("view engine" , "handlebars")
app.set("views" , "./src/views")

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//SESSION
app.use(session({
    resave: true,
    secret: "secretCoder",
    saveUninitialized: true,

    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Patricio-Sessarego:Patricio2005@clustercoderhouse.jdm36.mongodb.net/BackendII?retryWrites=true&w=majority&appName=ClusterCoderHouse',
    })
}))

//PASSPORT
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

//CONNECT
connectDB()

//RUTAS
app.use("/api/sessions" , sessionRouter)
app.use("/" , viewRouter)

app.listen(PORT , () => {
    console.log(`ESCUCHANDO EN EL PUERTO ${PORT}`)
})