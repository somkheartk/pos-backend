import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Menu } from '../schemas/menu.schema';
import { Permission } from '../schemas/permission.schema';
import { Role } from '../schemas/role.schema';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name) private menuModel: Model<Menu>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
  ) {}

  async initializeDefaultData() {
    // สร้าง Permissions เริ่มต้น
    await this.createDefaultPermissions();
    
    // สร้าง Roles เริ่มต้น
    await this.createDefaultRoles();
    
    // สร้าง Menus เริ่มต้น
    await this.createDefaultMenus();
  }

  private async createDefaultPermissions() {
    const permissions = [
      // Dashboard
      { code: 'dashboard.view', name: 'ดูแดชบอร์ด', description: 'ดูหน้าแดชบอร์ด', module: 'dashboard', action: 'view' },
      
      // POS
      { code: 'pos.use', name: 'ใช้งาน POS', description: 'ใช้งานหน้าขายสินค้า', module: 'pos', action: 'use' },
      
      // Orders
      { code: 'orders.view', name: 'ดูออเดอร์', description: 'ดูรายการออเดอร์', module: 'orders', action: 'view' },
      { code: 'orders.create', name: 'สร้างออเดอร์', description: 'สร้างออเดอร์ใหม่', module: 'orders', action: 'create' },
      { code: 'orders.update', name: 'แก้ไขออเดอร์', description: 'แก้ไขข้อมูลออเดอร์', module: 'orders', action: 'update' },
      { code: 'orders.delete', name: 'ลบออเดอร์', description: 'ลบออเดอร์', module: 'orders', action: 'delete' },
      
      // Products
      { code: 'products.view', name: 'ดูสินค้า', description: 'ดูรายการสินค้า', module: 'products', action: 'view' },
      { code: 'products.create', name: 'เพิ่มสินค้า', description: 'เพิ่มสินค้าใหม่', module: 'products', action: 'create' },
      { code: 'products.update', name: 'แก้ไขสินค้า', description: 'แก้ไขข้อมูลสินค้า', module: 'products', action: 'update' },
      { code: 'products.delete', name: 'ลบสินค้า', description: 'ลบสินค้า', module: 'products', action: 'delete' },
      
      // Customers
      { code: 'customers.view', name: 'ดูลูกค้า', description: 'ดูรายการลูกค้า', module: 'customers', action: 'view' },
      { code: 'customers.create', name: 'เพิ่มลูกค้า', description: 'เพิ่มลูกค้าใหม่', module: 'customers', action: 'create' },
      { code: 'customers.update', name: 'แก้ไขลูกค้า', description: 'แก้ไขข้อมูลลูกค้า', module: 'customers', action: 'update' },
      { code: 'customers.delete', name: 'ลบลูกค้า', description: 'ลบลูกค้า', module: 'customers', action: 'delete' },
      
      // Reports
      { code: 'reports.view', name: 'ดูรายงาน', description: 'ดูรายงานต่างๆ', module: 'reports', action: 'view' },
      { code: 'reports.export', name: 'ส่งออกรายงาน', description: 'ส่งออกรายงาน', module: 'reports', action: 'export' },
      
      // Settings
      { code: 'settings.view', name: 'ดูการตั้งค่า', description: 'ดูการตั้งค่าระบบ', module: 'settings', action: 'view' },
      { code: 'settings.update', name: 'แก้ไขการตั้งค่า', description: 'แก้ไขการตั้งค่าระบบ', module: 'settings', action: 'update' },
      { code: 'users.manage', name: 'จัดการผู้ใช้', description: 'จัดการผู้ใช้งานระบบ', module: 'settings', action: 'manage' },
    ];

    for (const permission of permissions) {
      const exists = await this.permissionModel.findOne({ code: permission.code });
      if (!exists) {
        await this.permissionModel.create(permission);
      }
    }

    console.log('✅ Permissions initialized');
  }

  private async createDefaultRoles() {
    const roles = [
      {
        name: 'admin',
        displayName: 'แอดมิน',
        description: 'ผู้ดูแลระบบ มีสิทธิ์เต็ม',
        level: 0,
        permissions: [
          'dashboard.view',
          'orders.view', 'orders.create', 'orders.update', 'orders.delete',
          'products.view', 'products.create', 'products.update', 'products.delete',
          'customers.view', 'customers.create', 'customers.update', 'customers.delete',
          'reports.view', 'reports.export',
          'settings.view', 'settings.update', 'users.manage'
        ]
      },
      {
        name: 'manager',
        displayName: 'ผู้จัดการ',
        description: 'ผู้จัดการสาขา จัดการสินค้าและลูกค้า',
        level: 1,
        permissions: [
          'dashboard.view',
          'orders.view', 'orders.create', 'orders.update',
          'products.view', 'products.create', 'products.update',
          'customers.view', 'customers.create', 'customers.update',
          'reports.view', 'reports.export'
        ]
      },
      {
        name: 'cashier',
        displayName: 'แคชเชียร์',
        description: 'พนักงานขาย ใช้งาน POS',
        level: 2,
        permissions: [
          'dashboard.view',
          'pos.use',
          'orders.view', 'orders.create'
        ]
      }
    ];

    for (const role of roles) {
      const exists = await this.roleModel.findOne({ name: role.name });
      if (!exists) {
        await this.roleModel.create(role);
      }
    }

    console.log('✅ Roles initialized');
  }

  private async createDefaultMenus() {
    const menus = [
      {
        name: 'แดชบอร์ด',
        key: 'dashboard',
        path: '/',
        icon: 'DashboardIcon',
        description: 'ภาพรวมระบบ',
        order: 1,
        requiredPermissions: ['dashboard.view']
      },
      {
        name: 'ขายสินค้า',
        key: 'pos',
        path: '/pos',
        icon: 'PaymentIcon',
        description: 'หน้าขายสินค้า POS',
        order: 2,
        requiredPermissions: ['pos.use']
      },
      {
        name: 'จัดการออเดอร์',
        key: 'orders',
        path: '/orders',
        icon: 'ShoppingCartIcon',
        description: 'ดูและจัดการออเดอร์',
        order: 3,
        requiredPermissions: ['orders.view']
      },
      {
        name: 'จัดการสินค้า',
        key: 'products',
        path: '/products',
        icon: 'InventoryIcon',
        description: 'เพิ่ม แก้ไข ลบสินค้า',
        order: 4,
        requiredPermissions: ['products.view']
      },
      {
        name: 'จัดการลูกค้า',
        key: 'customers',
        path: '/customers',
        icon: 'PeopleIcon',
        description: 'ข้อมูลลูกค้าและสมาชิก',
        order: 5,
        requiredPermissions: ['customers.view']
      },
      {
        name: 'รายงาน',
        key: 'reports',
        path: '/reports',
        icon: 'BarChartIcon',
        description: 'รายงานยอดขายและสถิติ',
        order: 6,
        requiredPermissions: ['reports.view']
      },
      {
        name: 'ตั้งค่าระบบ',
        key: 'settings',
        path: '/settings',
        icon: 'SettingsIcon',
        description: 'การตั้งค่าและจัดการผู้ใช้',
        order: 7,
        requiredPermissions: ['settings.view']
      }
    ];

    for (const menu of menus) {
      const exists = await this.menuModel.findOne({ key: menu.key });
      if (!exists) {
        await this.menuModel.create(menu);
      }
    }

    console.log('✅ Menus initialized');
  }

  async getUserMenus(userPermissions: string[]) {
    const allMenus = await this.menuModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .exec();

    // Filter menus based on user permissions
    const accessibleMenus = allMenus.filter(menu => {
      if (menu.requiredPermissions.length === 0) {
        return true; // Public menu
      }
      
      // Check if user has at least one required permission
      return menu.requiredPermissions.some(permission => 
        userPermissions.includes(permission)
      );
    });

    return accessibleMenus;
  }

  async getRolePermissions(roleNames: string[]): Promise<string[]> {
    const roles = await this.roleModel
      .find({ name: { $in: roleNames }, isActive: true })
      .exec();

    let allPermissions: string[] = [];
    for (const role of roles) {
      allPermissions = allPermissions.concat(role.permissions || []);
    }

    return [...new Set(allPermissions)]; // Remove duplicates
  }

  async getAllRoles() {
    return this.roleModel
      .find({ isActive: true })
      .sort({ level: 1 })
      .exec();
  }
}
