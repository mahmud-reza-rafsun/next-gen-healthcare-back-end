import app from "./app";
import { envVars } from "./app/config/env";
// import { seedSuperAdmin } from "./app/utils/seed";

const PORT = envVars.PORT || 5000;
const bootstrap = () => {
    try {
        // await seedSuperAdmin();
        app.listen(PORT, () => {
            console.log(`next get health is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("something wrong", error);
    }
};

bootstrap();