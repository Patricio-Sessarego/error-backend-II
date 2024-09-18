import { createHash, isValidPassword } from '../utils/util.js'
import UserModel from '../models/user.model.js'
import GitHubStrategy from 'passport-github2'
import local from 'passport-local'
import passport from 'passport'

const LocalStrategy = local.Strategy

const initializePassport = () => {
    //ESTRATEGIA PARA REGISTER
    passport.use('register' , new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true //ACCESO AL OBJETO REQUEST
    }, async (req , username , password , done) => {
        const { first_name , last_name , email , age } = req.body

        try{
            let user = await UserModel.findOne({ email })

            if(user) return done(null , false)

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser)

            return done(null , result)
        }catch(error){
            return done(error)
        }
    }))

    //ESTRATEGIA PARA LOGIN
    passport.use('login' , new LocalStrategy({
        usernameField: 'email',
    }, async (email , password , done) => {
        try{
            let user = await UserModel.findOne({ email })

            if(!user) return done(null , false)

            if(!isValidPassword(password , user)) return done(null , false)

            return done(null , user)
        }catch(error){
            return done(error)
        }
    }))

    passport.serializeUser((user , done) => {
        done(null , user._id)
    })

    passport.deserializeUser(async (id , done) => {
        let user = await UserModel.findById({ _id: id })
        done(null , user)
    })

    //ESTRATEGIA CON GITHUB
    passport.use("github" , new GitHubStrategy({
        clientID: "Iv23li377IMa5eIGCHfH",
        clienteSecret: "7a93ebf5562cf4267f1fe345fb28821b65d37467",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken , refreshToken , profile , done) => {
        //MOSTRAMOS EL PROFILE POR CONSOLA
        console.log("PROFILE: " , profile)

        try{
            let user = await UserModel.findOne({ email: profile._json.email })

            if(!user){ //USUARIO NUEVO
                let newUser = {
                    first_name: "profile._json.name",
                    last_name: "",
                    age: 19,
                    email: profile._json.email,
                    passoword: ""
                }

                let result = await UserModel.create(newUser)
                return done(null , result)
            }else{ //USUARIO YA EXISTENTE
                done(null , user)
            }
        }catch(error){
            return done(error)
        }
    }))
}

export default initializePassport