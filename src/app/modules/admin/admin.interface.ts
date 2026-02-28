export interface ICreateSuperAdmin {
    password: string;
    superAdmin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber: string;
    };
}

export interface IAdminUpdate {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
}