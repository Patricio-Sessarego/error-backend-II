//=> BCRYPT --> LIBRERIA PARA HASHEAR LAS PASSWORDS
import bcrypt from 'bcrypt'

const createHash = password => bcrypt.hashSync(password , bcrypt.genSaltSync(10))

//'(10)' GENERA UN SALT DE 10 CARACTERES
//'genSaltSync' => TOMA LA 'password' Y APLICA EL PROCESO DE HASHEO
//UN 'salt' ES UN STRING RANDOM QUE SE HACE PARA QUE EL PROCESO SEA IMPREDECIBLE

const isValidPassword = (password , user) => bcrypt.compareSync(password , user.password)

//AL COMPARAR LAS 'passwords' DEVUELVE TRUE O FALSE

export { createHash , isValidPassword }