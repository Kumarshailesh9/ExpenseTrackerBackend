const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require(('jsonwebtoken'));


exports.getUser = async (req, res) => {
    const user = await User.findAll();

    res.json(user);
};

exports.postUser = async (req, res) => {
    try {
     const { name, email, password } = req.body;
    
     const hash = await bcrypt.hash(password, 10);

     const user = await User.create({
         name,
         email,
         password: hash,
         ispremiumuser: false
     });
 
     res.json(user);
    }
    catch(err){
     console.log(err);
    }
 };

 exports.postLogin = async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
    
    if(!user){
        return res.status(401).json({message: 'User Not Autherised!'});
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if(matchPassword){
        const token = jwt.sign({ userId: user.id, name: user.name , ispremiumuser: user.ispremiumuser}, `${process.env.LOGIN_SECRET_KEY}`);
        return res.status(200).json({ message: 'Login SuccessFully!', success: true, token});
    } else {
        return res.status(404).json({message: 'Invalid Email or Password!'});
    }
    }
    catch(err) {
        res.status(404).json({message: 'internal error'});
    }
};