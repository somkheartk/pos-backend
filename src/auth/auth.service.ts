import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // หา user ในฐานข้อมูล
    const user = await this.userModel.findOne({ username, isActive: true });
    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // สร้าง JWT token
    const payload = { 
      sub: user._id, 
      username: user.username,
      name: user.name,
      roles: user.roles 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        roles: user.roles,
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }

  async register(registerDto: { username: string; password: string; name: string; roles: string[] }) {
    const { username, password, name, roles } = registerDto;

    // ตรวจสอบว่า username ซ้ำไหม
    const existingUser = await this.userModel.findOne({ username });
    if (existingUser) {
      throw new UnauthorizedException('ชื่อผู้ใช้นี้มีอยู่แล้ว');
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      name,
      roles,
      isActive: true,
    });

    await newUser.save();

    return {
      message: 'สร้างผู้ใช้สำเร็จ',
      user: {
        id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        roles: newUser.roles,
      },
    };
  }

  async createDefaultUser() {
    const existingUser = await this.userModel.findOne({ username: 'admin' });
    
    // ถ้า user เดิมมี role แค่ตัวเดียวให้ลบและสร้างใหม่
    if (existingUser && (!existingUser.roles || existingUser.roles.length <= 1)) {
      console.log('🔄 อัพเดต Admin user ให้มีหลาย roles');
      await this.userModel.deleteOne({ username: 'admin' });
    }
    
    // สร้าง user ใหม่หรือสร้างถ้าไม่มี
    const user = await this.userModel.findOne({ username: 'admin' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const defaultUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        name: 'แอดมิน',
        roles: ['admin', 'manager', 'cashier'],
        isActive: true,
      });
      await defaultUser.save();
      console.log('✅ สร้าง Admin user ใหม่แล้ว (admin/password) พร้อม 3 roles');
    } else {
      console.log(`ℹ️  Admin user มีอยู่แล้ว พร้อม ${user.roles?.length || 0} roles`);
    }

    // สร้าง sample users อื่นๆ
    await this.createSampleUsers();
  }

  async createSampleUsers() {
    const sampleUsers = [
      {
        username: 'manager1',
        password: 'password',
        name: 'ผู้จัดการ สาขาหลัก',
        roles: ['manager', 'cashier']
      },
      {
        username: 'cashier1',
        password: 'password', 
        name: 'แคชเชียร์ เวรเช้า',
        roles: ['cashier', 'viewer']
      },
      {
        username: 'viewer1',
        password: 'password',
        name: 'ผู้ดู รายงาน',
        roles: ['viewer']
      }
    ];

    for (const userData of sampleUsers) {
      const existingUser = await this.userModel.findOne({ username: userData.username });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = new this.userModel({
          ...userData,
          password: hashedPassword,
          isActive: true,
        });
        await newUser.save();
        console.log(`✅ สร้าง ${userData.name} (${userData.username}) แล้ว`);
      }
    }
  }
}
