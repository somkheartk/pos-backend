import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get('search')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  @Get('barcode/:barcode')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findByBarcode(@Param('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }

  @Get(':id')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(['admin', 'manager'])
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @Roles(['admin', 'manager'])
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(['admin', 'manager'])
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Put(':id/stock')
  @Roles(['admin', 'manager', 'cashier'])
  async updateStock(@Param('id') id: string, @Body() { quantity, operation }: { quantity: number, operation: 'add' | 'subtract' }) {
    return this.productsService.updateStock(id, quantity, operation);
  }

  @Get('categories/list')
  @Roles(['admin', 'manager', 'cashier', 'viewer'])
  async getCategories() {
    return this.productsService.getCategories();
  }
}
