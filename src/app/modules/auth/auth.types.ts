export type TRegisterPatientResponse = {
    patient: {
        id: string;
        name: string;
        email: string;
        userId: string;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        profilePhoto: string | null;
        contactNumber: string | null;
        address: string | null;
    };
    accessToken: string;
    refreshToken: string;
    token: string | null;
};