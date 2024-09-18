import { createHash, isValidPassword } from '../utils/util.js'
import generateToken from '../utils/jsonwebtoken.js'
import UserModel from '../models/user.model.js'
import passport from 'passport'
import Router from 'express'
const router = Router()

// router.post('/register' , async (req , res) => {
//     const { first_name , last_name , email , password , age} = req.body

//     try{
//         const isExistEmail = await UserModel.findOne({ email: email })

//         if(isExistEmail){
//             return res.send('YA EXISTE UN USUARIO CON ESTE MAIL')
//         }

//         const newuser = await UserModel.create({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password),
//             age
//         })

//         req.session.user = {
//             first_name: newuser.first_name,
//             last_name: newuser.last_name,
//             email: newuser.email,
//             age: newuser.age
//         }

//         req.session.login = true

//         res.status(201).send('USUARIO CREADO CON EXITO')
//     }catch(error){
//         console.error(error)
//         res.status(500).send('ERROR EN EL SERVIDOR')
//     }
// })

//REGISTER CON PASSPORT
// router.post('/register' , passport.authenticate('register' , {}) , async (req , res) => {
//     try{
//         if(!req.user) return res.send('CREDENCIALES INVALIDAS')

//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             email: req.user.email,
//             age: req.user.age
//         }

//         req.session.login = true

//         res.redirect('/profile')
//     }catch(error){
//         console.error(error)
//         res.status(500).send('ERROR EN EL SERVIDOR')
//     }
// })

//REGISTER CON JWT
router.post("/register" , async (req , res) => {
    const { first_name , last_name , email , password , age} = req.body

    try{
        const isExistUser = await UserModel.findOne({ email })

        if(isExistUser){
            return res.send("EL EMAIL YA ESTA REGISTRADO")
        }

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        })

        const token = generateToken({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email
        })

        res.status(201).send({ message: "USUARIO CREADO" , token})
    }catch(error){
        console.error(error)
        res.status(500).send("ERROR DEL SERVIDOR")
    }
})

// router.post('/login' , async (req , res) => {
//     const { email , password } = req.body

//     try{
//         const searchedUser = await UserModel.findOne({ email: email })

//         if(searchedUser){
//             if(isValidPassword(password , searchedUser)){
//                 req.session.user = {
//                     first_name: searchedUser.first_name,
//                     last_name: searchedUser.last_name,
//                     email: searchedUser.email,
//                     age: searchedUser.age
//                 }
        
//                 req.session.login = true

//                 res.redirect('/profile')
//             }else{
//                 res.status(401).send('WRONG PASSWORD')
//             }
//         }else{
//             res.status(404).send('NO EXISTE UN USUARIO CON ESE MAIL')
//         }
//     }catch(error){
//         console.error(error)
//         res.status(500).send('ERROR DEL SERVIDOR')
//     }
// })

//LOGIN PARA PASSPORT
// router.post('/login' , passport.authenticate('login' , { failureRedirect: '/failedLogin' } , async (req , res) => {
//     try{
//         if(!req.user) return res.send('CREDENCIALES INVALIDAS')

//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             email: req.user.email,
//             age: req.user.age
//         }

//         req.session.login = true

//         res.redirect('/profile')
//     }catch(error){
//         console.error(error)
//         res.status(500).send('ERROR EN EL SERVIDOR')
//     }
// }))

//LOGIN CON JWT
router.post("/login" , async (req , res) => {
    const { email , password } = req.body
    try{
        const user = await UserModel.findOne({ email })

        if(!user){ //EMAIL INVALIDO
            return res.send("USUARIO NO ENCONTRADO")
        }

        if(!isValidPassword(password , user)){ //WRONG PASS
            return res.send("WRONG PASSWORD")
        }

        //GENERAMOS EL TOKEN
        const token = generateToken({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        })

        res.send({ message: "LOGIN SUCCESFUL" , token})
    }catch(error){
        console.error(error)
        res.status(500).send("ERROR DEL SERVIDOR")
    }
})

//FAILED LOGIN
router.get('/failedLogin' , (req , res) => {
    res.send('FAILED ON LOGIN')
})

//LOGOUT
router.get('/logout' , (req , res) => {
    if(req.session.login){
        req.session.destroy()
    }

    res.redirect('/login')
})

//GITHUB
router.get('/github' , passport.authenticate("github" , { scope: [ "user:email" ] }) , (req , res) => {

})

router.get('/githubcallback' , passport.authenticate("github" , { failureRedirect: "/login"}) , async (req , res) => {
    req.session.user = req.user
    req.session.login = true
    res.redirect("/profile")
})

export default router