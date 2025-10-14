import * as bcrypt from 'bcrypt';
export const bcryptUtil = {
    async compare(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    },
    async hash(password: string) {
        console.log('New password:', password);
        return bcrypt.hash(password, 10);
    }
}