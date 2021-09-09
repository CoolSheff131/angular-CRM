const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const keys = require('../config/keys')


module.exports.login = async function(req,res) {
    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //Проверить пароль
        //const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        
        if(req.body.password === candidate.password){
            //Генерация токена, пароли совпали

            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 60 * 60})
            res.status(200).json({
                token: `Bearer ${token}`
            })
        }else{
            //Неправильный пароль
            res.status(401).json({
                message: 'Пароль не правильный'
            })
        }
    }else{
        //Пользователь не существует
        res.status(404).json({
            message: 'Пользователь не найден'
        })
    }
}

module.exports.register = async function(req,res){
    //email password 
    const candidate = await User.findOne({email: req.body.email})

    if(candidate){
        //Пользователь существует
        res.status(409).json({
            message: 'Такой email занят'
        })
    }else{
        //Создать пользователя
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })

        try{
            await user.save()
            res.status(201).json(user)
        }catch(e){

            //Обработать ошибку
        }
        
    }
}