import { CltINSSTable } from "@/services/taxes-services/interfaces/base-inss-service-interface";
import { BaseINSSService } from "./base-inss-service";

export class INSS2025CltService extends BaseINSSService {
    protected table: CltINSSTable = {
        salaryRanges: [
            { min: 0, max: 1412.00 },
            { min: 1412.01, max: 2666.68 },
            { min: 2666.69, max: 4000.03 },
            { min: 4000.03, max: 7786.02 }
        ],
        aliquots: [7.5, 9.0, 12.0, 14.0],
        deductions: [0, 21.18, 101.18, 181.18],
        tableDescription: "INSS Clt 2025 Table - INSS2025CltService"
    }
}
