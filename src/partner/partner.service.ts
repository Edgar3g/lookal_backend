import { Injectable, NotFoundException } from '@nestjs/common';
import { Partner, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPartnerDto: CreatePartnerDto) {
    const { ...data } = createPartnerDto;

    try {
      const partner = await this.prisma.partner.create({
        data,
      });
      return partner;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          console.log(
            'Não Pode criar Socios com Dados Repedidos, por favor Altere',
          );
        }
      }
      throw e;
    }
  }

  async findAll(): Promise<Partner[]> {
    const partners = await this.prisma.partner.findMany();
    if (!partners || partners.length === 0) {
      throw new NotFoundException(`Nenhum socio encontrado`);
    }
    return partners;
  }

  async partnerDetail(id: string): Promise<Partner> {
    const partnerProfile = await this.prisma.partner.findUnique({
      where: { id },
    });
    if (!partnerProfile) {
      throw new NotFoundException(`Socio Não Encontrado`);
    }
    return partnerProfile;
  }

  async update(
    id: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    const partner = await this.prisma.partner.update({
      where: { id },
      data: updatePartnerDto,
    });
    if (!partner) {
      throw new NotFoundException(`Socio Não Encontrado`);
    }
    return partner;
  }

  async findByData(data: string): Promise<Partner> {
    const partner = await this.prisma.partner.findFirst({
      where: {
        OR: [{ email: data }, { phone: data }, { ref: data }, { doc: data }],
      },
    });
    if (!partner) {
      throw new NotFoundException(
        `Socio Não Encontrado com o dado fornecido: ${data}`,
      );
    }
    return partner;
  }

  async remove(id: string): Promise<Partner> {
    const partner = await this.prisma.partner.delete({
      where: { id },
    });
    if (!partner) {
      throw new NotFoundException(`Socio Não Encontrado`);
    }
    return partner;
  }
}
