import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorator/role.decorator';
import { EnumRole } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<EnumRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const { user } = context.switchToHttp().getRequest();
        if (!user) throw new ForbiddenException('No user found');

        // ถ้า route มี @Roles() → เช็คตรงกับ role เดียว
        if (requiredRoles && requiredRoles.length > 0) {
            if (!requiredRoles.includes(user.role)) {
                throw new ForbiddenException('Access denied');
            }
            return true;
        }

        // ถ้า route ไม่มี @Roles() → default admin
        if (user.role !== EnumRole.ADMIN) {
            throw new ForbiddenException('Access denied: Admin only');
        }

        return true;
    }
}
