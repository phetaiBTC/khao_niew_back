import * as bcrypt from 'bcrypt';
export const bcryptUtil = {
    async compare(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    },
    async hash(password: string) {
        return bcrypt.hash(password, 10);
    }
}