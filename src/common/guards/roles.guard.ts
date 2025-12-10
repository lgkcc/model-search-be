import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../const/const';
import { DbService } from '../../db/db.service';
import { Session } from '../types/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dbService: DbService,
  ) {} // Reflector помогает читать метаданные

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем список ролей, требуемых для обработчика (из декоратора @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если роли не указаны, доступ разрешен для всех
    if (!requiredRoles) {
      return true;
    }

    // Получаем объект пользователя из запроса (должен быть добавлен стратегией JWT/Auth)
    const http = context.switchToHttp();
    const req = http.getRequest<{
      session: Session;
    }>();

    const session = req.session;

    if (!session) {
      throw new ForbiddenException('Пользователь не авторизован');
    }

    const user = await this.dbService.user.findUnique({
      where: { id: session.id },
    });
    if (!user) {
      throw new ForbiddenException('Пользователь не авторизован');
    }
    const userRoles = user.roles;
    // Проверяем, есть ли у пользователя хотя бы одна из требуемых ролей
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return hasRole;
  }
}
