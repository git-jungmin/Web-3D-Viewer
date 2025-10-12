import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserRole } from "../../user/entities/user-role.enum";
import { Reflector } from "@nestjs/core";
import { User } from "../../user/entities/user.entity";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 핸들러 메서드 또는 클래스 자체에 설정된 역할 가져오기
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ])
     
        // 설정된 역할이 없는 경우, 접근 전체 허용
        if (!requiredRoles) {
            return true;
        }

        // 요청 객체에서 사용자 정보 가져오기
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        return requiredRoles.some((role) => user.role === role);
    }
}