import app from "./app";
import { envVars } from "./app/config/env";

const PORT = envVars.PORT || 5000;
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