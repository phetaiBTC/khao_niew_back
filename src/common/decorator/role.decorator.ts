
import { SetMetadata } from '@nestjs/common';
import { EnumRole } from 'src/modules/users/entities/user.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: EnumRole[]) => SetMetadata(ROLES_KEY, roles);
