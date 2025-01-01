import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import cookieParser from "cookie-parser"
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import httpStatus from 'http-status';

const app: Application = express();
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://shop-sagaa.netlify.app",
        "https://shop-saga.vercel.app"
    ],
    credentials: true,
}));
app.use(cookieParser())

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send("Server is running...")
});

app.use('/api', router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
})


export default app;