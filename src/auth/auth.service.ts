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
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const defaultUser = new this.userModel({
        username: 'admin',
        password: hashedPassword,
        name: 'ผู้ดูแลระบบ',
        roles: ['admin', 'manager'],
        isActive: true,
      });
      await defaultUser.save();
      console.log('✅ สร้าง Admin user เริ่มต้นแล้ว (admin/password)');
    }
  }
}
