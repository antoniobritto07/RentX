import { Request, Response } from "express";
import { ListCategoriesUseCase } from "./ListCategoriesUseCase";

class ListCategoriesController {
    constructor(private lisCategoriesUseCase: ListCategoriesUseCase) { }

    handle(request: Request, response: Response): Response {
        const all = this.lisCategoriesUseCase.execute()

        return response.json(all)
    }
}

export { ListCategoriesController }