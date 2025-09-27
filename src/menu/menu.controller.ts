import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MenuService } from './menu.service';

@Controller('menu')
@UseGuards(JwtAuthGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get('user-menus')
  async getUserMenus(@Request() req) {
    const user = req.user;
    
    // ดึง permissions จาก roles ใน database
    const rolePermissions = await this.menuService.getRolePermissions(user.roles || []);
    
    // รวม permissions จาก roles และ direct permissions
    const allPermissions = rolePermissions.concat(user.permissions || []);
    const uniquePermissions = [...new Set(allPermissions)];
    
    return this.menuService.getUserMenus(uniquePermissions);
  }

  @Get('roles')
  async getAllRoles() {
    return this.menuService.getAllRoles();
  }
}
