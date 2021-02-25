import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const createCustomerService = container.resolve(CreateCustomerService);
    
    const {name, email} = request.body;

    const user = await createCustomerService.execute({
      name,
      email
    });

    if(!user){
      return response.status(401).send();
    }
    
    return response.status(201).json(user);
    
  }
}
