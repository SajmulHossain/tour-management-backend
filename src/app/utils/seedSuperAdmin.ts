/* eslint-disable no-console */
import { hash } from "bcryptjs";
import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model"

export const seedSuperAdmin = async () => {
    const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

    if(isSuperAdminExist) {
        console.log('Super admin already exist');
        return;
    }

    console.log('Trying to create super admin');

    const hashedPassword = await hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider : IAuthProvider = {
        provider: 'credentials',
        providerId: envVars.SUPER_ADMIN_EMAIL
    }

    const payload: IUser = {
        name: 'Super Admin',
        role: Role.SUPER_ADMIN,
        email: envVars.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        auths: [authProvider],
        isVerified: true
    }
    const superAdmin = await User.create(payload);

    console.log('Super admin created');
    console.log(superAdmin);
    return superAdmin;
} 