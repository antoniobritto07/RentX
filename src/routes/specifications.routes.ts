import { Router } from "express";
import { SpecificationsRepository } from "../modules/cars/repositories/SpecificationsRepository";
import { CreateSpecificationService } from "../modules/cars/services/CreateSpecificationService";

const specificationsRoutes = Router();

const speficationsRepository = new SpecificationsRepository();

specificationsRoutes.post('/', (request, response) => {
    const { name, description } = request.body;
    const createSpecificationService = new CreateSpecificationService(speficationsRepository)

    createSpecificationService.execute({ name, description });

    return response.status(201).send();
})

export { specificationsRoutes }