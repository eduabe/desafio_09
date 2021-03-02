import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import {IProduct as IProductOrder} from '../dtos/ICreateOrderDTO';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    console.log(customer_id);

    if(!customer){
      throw new AppError('Usuário inválido');
    }

    const productsId = products.map(product => {return {id: product.id}});
    const findProducts = await this.productsRepository.findAllById(productsId);

    if(findProducts.length !== products.length){
      throw new AppError('Existe um ou mais produtos inválidos no pedido');
    }

    const orderedProducts: Product[] = []; 

    products.forEach(productParam => {
      const productMatch = findProducts.find(findProduct => findProduct.id === productParam.id);
      if(!productMatch){
        throw new AppError('Existe um ou mais produtos inválidos no pedido');
      }
      if(productMatch.quantity < productParam.quantity){
        throw new AppError('Existe um ou mais produtos com uma quantidade superior a disponível no estoque');
      }
      orderedProducts.push(productMatch);
    });

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: orderedProducts.filter(p=>p.id === product.id)[0].price
      
    }));

    const order = await this.ordersRepository.create({
      customer,
      products: serializedProducts
    });

    const orderedProductsQuantity = products.map(product => ({
      id:product.id,
      quantity: orderedProducts.filter(p => p.id === product.id)[0].quantity - product.quantity
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;

  }
}

export default CreateOrderService;
