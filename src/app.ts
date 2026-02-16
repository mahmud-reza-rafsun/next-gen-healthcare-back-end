import express, { Application, Request, Response } from "express";
import { prisma } from "./app/lib/prisma";
import { IndexRoute } from "./app/router";


const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", IndexRoute);

app.get("/", async (req: Request, res: Response) => {
    const speciality = await prisma.speciality.create({
        data: {
            title: "Cardiology",
            icon: ""
        }
    });
    res.status(200).json(
        {
            success: true,
            message: "Hello World!",
            data: speciality
        }
    );
});

export default app;