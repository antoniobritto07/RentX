import fs from "fs"; //modulo nativo do node => fileSystem
import { parse } from "csv-parse";
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";

interface IImportCategory {
    name: string;
    description: string;
}

class ImportCategoryUseCase {
    constructor(private categoryRepository: ICategoriesRepository) { }

    loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
        return new Promise((resolve, reject) => {
            const categories: Array<IImportCategory> = []
            const stream = fs.createReadStream(file.path) //função que faz a leitura do arquivo em partes, melhorando a performance

            const parseFile = parse();

            stream.pipe(parseFile) //pipe é uma função que a cada pedaço lido, esse pipe vai mandando as infos aos poucos

            parseFile.on("data", async (line) => {
                const [name, description] = line;
                categories.push({
                    name,
                    description
                })
            })
                .on("end", () => {
                    fs.promises.unlink(file.path)
                    resolve(categories)
                })
                .on("error", (err) => {
                    reject(err)
                })
        })
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.loadCategories(file);

        categories.map((category) => {
            const { name, description } = category;

            const existCategory = this.categoryRepository.findByName(name);
            if (!existCategory) {
                this.categoryRepository.create({
                    name,
                    description
                })
            }
        })
    }
}

export { ImportCategoryUseCase }