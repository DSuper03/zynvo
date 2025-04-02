/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import helmet from 'helmet'
import { z } from 'zod';
import dotenv from 'dotenv';
import morgan from 'morgan';


dotenv.config();
const app=express();
const PORT =process.env.PORT || 5000
export const prisma=new PrismaClient();


//middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/posts', postRoutes);

//Error Handler 
app.use((err:Error, req:Request,res:Response,next:NextFunction)=>{
    
    console.error(err.stack);
    res.status(500)
.json({
    message:'Something is wrong',
    error:process.env.NODE_ENV==='production'?'':err.stack,
});
});

app.listen(PORT, ()=>{
    console.log('Server is running on localhost 8080');

})

process.on('SIGINT', async()=>{
await prisma.$disconnect();
console.log('Disconnected from database');
process.exit(0);
})