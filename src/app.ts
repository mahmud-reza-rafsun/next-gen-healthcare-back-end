import express, { Application, Request, Response } from "express";
import { IndexRoute } from "./app/router";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";


const app: Application = express();

app.set("view engine", "ejs");

app.use("/api/auth", toNodeHandler(auth))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", IndexRoute);

app.get("/", async (req: Request, res: Response) => {
    res.status(200).json(
        {
            success: true,
            message: "Hello World!",
        }
    );
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;