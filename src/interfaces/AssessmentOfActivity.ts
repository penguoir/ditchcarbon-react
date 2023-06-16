import { EmissionFactors } from "./EmissionFactors";

export interface AssessmentOfActivity {
	region: string;
	year: number;
	declared_unit: string;
	ghg_emission_factors: EmissionFactors;
	source_url: string;
}