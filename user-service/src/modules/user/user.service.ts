import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

import { User } from 'src/entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(filter: FindOptionsWhere<User>): Promise<User | null> {
    return this.userRepository.findOne({
      where: { ...filter, active: true },
    });
  }

  async findOneWithPassword(
    filter: FindOptionsWhere<User>,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { ...filter, active: true },
      select: ['id', 'email', 'password'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser)
      throw new BadRequestException('User with this email already exists');

    const user = this.userRepository.create({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    });
    return this.userRepository.save(user);
  }

  async update(id: string, { password, ...dto }: UpdateUserDto): Promise<User> {
    const activeUser = await this.userRepository.findOneBy({
      id,
      active: true,
    });
    if (!activeUser) throw new BadRequestException('User not found');

    await this.userRepository.update(id, {
      ...dto,
      ...(password ? { password: await argon2.hash(password) } : {}),
    });
    return this.userRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.update(id, { active: false });
  }
}
