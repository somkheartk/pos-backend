import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

// Mock User interface
interface MockUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  isActive: boolean;
}

@Injectable()
export class AuthService {
  private mockUsers: MockUser[] = [
    {
      id: '1',
      username: 'admin',
      password: 'password', // In real app, this would be hashed
      name: 'ผู้ดูแลระบบ',
      role: 'admin',
      isActive: true,
    },
    {
      id: '2',
      username: 'cashier',
      password: 'cashier123',
      name: 'พนักงานแคชเชียร์',
      role: 'cashier',
      isActive: true,
    },
  ];

  constructor(private jwtService: JwtService) {
    console.log('✅ Mock Auth Service initialized with demo users:');
    console.log('   - admin/password (ผู้ดูแลระบบ)');
    console.log('   - cashier/cashier123 (พนักงานแคชเชียร์)');
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // หา user ใน mock data
    const user = this.mockUsers.find(
      (u) => u.username === username && u.isActive,
    );

    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // ตรวจสอบรหัสผ่าน (แบบง่าย ไม่ใช้ hash)
    if (user.password !== password) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // สร้าง JWT token
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(userId: string): Promise<MockUser | null> {
    return this.mockUsers.find((user) => user.id === userId) || null;
  }

  createDefaultUser() {
    // Mock method - users already created in constructor
    console.log('✅ Mock users ready for authentication');
  }
}
