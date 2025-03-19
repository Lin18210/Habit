const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('./prisma/client');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());


//Authentication middleware
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) return res.status(401).json({message: "Access denied"})

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: "Invalid token"})
        req.user = user
        next()
    })
}

//Routes
//Register
app.post('/api/auth/register', async(req,res) => {
    try{
        const {username, email, password} = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                OR: [
                    {email},
                    {username}
                ]
            }
        })

        if (existingUser){
            return res.status(409).json({message: "User already exists"})
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //Create new user
        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword
            },
            select:{
                id: true,
                username: true,
                email: true
            }
        });

        //Generate token
        const token = jwt.sign(
            {id: newUser.id, username: newUser.username}, process.env.JWT_SECRET,{expiresIn: '7d'}
        )

        res.status(201).json({token, user:newUser})
    } catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
})

//Login
app.post('/api/auth/login', async(req,res) => {
    try{
        const {email, password} = req.body;

        //Check if user exists
        const user = await prisma.user.findUnique({
            where: {email}
        })

        if(!user) {return res.status(401).json({message: "Invalid credentials"})
        }

        //Check password
        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return res.status(401).json({message: "Invalid credentials"})
        }

        //Generate Token
        const token = jwt.sign(
            {id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '7d'}
        )

        res.json({token, user: 
            {
                id: user.id,
                username: user.username,
                email: user.email
            }
        })
    } catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
})
    