import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticationToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(401).json({message: "Access denied"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({message: "Invalid token"});
        req.user = user;
        next();
    });
};

// Routes
// Register
app.post('/api/auth/register', async(req,res) => {
    try{
        const {username, email, password} = req.body;

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {email},
                    {username}
                ]
            }
        });

        if (existingUser){
            return res.status(409).json({message: "User already exists"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
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

        // Generate token
        const token = jwt.sign(
            {id: newUser.id, username: newUser.username}, process.env.JWT_SECRET,{expiresIn: '7d'}
        );

        res.status(201).json({token, user:newUser});
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Login
app.post('/api/auth/login', async(req,res) => {
    try{
        const {email, password} = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            return res.status(401).json({message: "Invalid credentials"});
        }

        // Generate Token
        const token = jwt.sign(
            {id: user.id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '7d'}
        );

        res.json({token, user: 
            {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Habits CRUD operations
// Get all habits for a user
app.get('/api/habits', authenticationToken, async (req, res) => {
    try{
        const habits = await prisma.habit.findMany({
            where: {
                userId: req.user.id
            }, 
            include: {
                completedDates: {
                    select: {
                        completedDate: true
                    }
                }
            }
        });

        // Format the response to match the expected structure
        const formattedHabits = habits.map(habit => ({
            id: habit.id,
            name: habit.name,
            completed: habit.completed,
            createdAt: habit.createdAt,
            completedDates: habit.completedDates.map(date => date.completedDate.toISOString().split('T')[0])
        }));
        res.json(formattedHabits);

    } catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});
    
// Create a habit
app.post('/api/habits', authenticationToken, async(req, res) => {
    try{
        const {name} = req.body;

        const newHabit = await prisma.habit.create({
            data: {
                name, 
                userId: req.user.id
            }
        });

        res.status(201).json({
            ...newHabit,
            completedDates: []
        });
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"}); 
    }
});

// Delete a habit
app.delete('/api/habits/:id', authenticationToken, async(req, res) => {
    try{
        const {id} = req.params;

        // Check if habit exists
        const habit = await prisma.habit.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            }
        });

        if(!habit){
            return res.status(404).json({message: "Habit not found"});
        }

        await prisma.habit.delete({
            where: {
                id: parseInt(id)
            }
        });
        res.json({message: "Habit deleted"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

// Toggle habit completion
app.patch('/api/habits/:id/toggle', authenticationToken, async(req, res) => {
    try{
        const {id} = req.params;
        const {date} = req.body;

        // Check if habit exists
        const habit = await prisma.habit.findFirst({
            where: {
                id: parseInt(id),
                userId: req.user.id
            },
            include: {
                completedDates: true
            }
        });

        if (!habit){
            return res.status(404).json({message: "Habit not found"});
        }

        // Check if date exists
        const dateObj = new Date(date);
        const existingDate = habit.completedDates.find(d => d.completedDate.toISOString().split('T')[0] === date);

        if (existingDate){
            // Remove date if it exists
            await prisma.completedDate.delete({
                where: {
                    id: existingDate.id
                }
            });      
        }
        // Add date if it doesn't exist
        else {
            await prisma.completedDate.create({
                data: {
                    habitId: parseInt(id),
                    completedDate: dateObj
                }
            });
        }

        // Update habit completion status
        const updatedHabit = await prisma.habit.findUnique({
            where: {
                id: parseInt(id)
            },
            include:{
                completedDates: {
                    select:{
                        completedDate: true
                    }
                }
            }
        });

        // Format the response
        const formattedHabit = {
            ...updatedHabit,
            completedDates: updatedHabit.completedDates.map(date => date.completedDate.toISOString().split('T')[0])
        };
        res.json(formattedHabit);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});