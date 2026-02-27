import { prisma } from "../src/app/lib/prisma";
import { Role } from "../src/generated/prisma/enums";

async function promoteToAdmin() {
    const userEmail = "admin@gmail.com";

    const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: { role: Role.ADMIN } //
    });
    const newAdmin = await prisma.admin.create({
        data: {
            name: updatedUser.name || "System Admin",
            email: updatedUser.email,
            userId: updatedUser.id,
            contactNumber: "017XXXXXXXX"
        }
    });

    console.log("Admin promoted and profile created:", newAdmin);
}

promoteToAdmin();