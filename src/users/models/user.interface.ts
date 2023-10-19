export interface User {
    id?: number;
    name?: string;
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    isEmailVerified?: boolean;
    // profileImage?: string;
    // blogEntries?: BlogEntry[];
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',    
    EDITOR = 'editor',
    USER = 'user'
}

export interface UserEmailConfirmation  {
    email: string;
    name: string;
}