import express, { Application, Request, Response } from "express";
import { IndexRoute } from "./app/router";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import path from "path";
import cors from "cors"
import { envVars } from "./app/config/env";
import { PaymentController } from "./app/modules/payment/payment.controller";

const app: Application = express();


app.set('view engine', 'ejs');
app.set("views", path.resolve(process.cwd(), `src/app/templates`));

app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)


app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

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