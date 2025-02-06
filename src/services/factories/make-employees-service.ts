import { PrismaEmployeesRepository } from "@/repositories/prisma/prisma-employees-repository";
import { EmployeesService } from "../employees-service";

export function makeEmployeesService() {
    const employeesRepository = new PrismaEmployeesRepository()
    return new EmployeesService(employeesRepository)
}