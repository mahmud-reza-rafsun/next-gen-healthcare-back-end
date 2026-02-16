import app from "./app";

const PORT = process.env.PORT || 5000;
const bootstrap = () => {
    try {
        app.listen(PORT, () => {
            console.log(`next get health is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("something wrong", error);
    }
};

bootstrap();