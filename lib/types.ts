export type OfficeListing = {
  id: string;
  name: string;
  area: string;
  officeType: "Serviced Office" | "Managed Office" | "Coworking";
  address: string;
  nearestStation: string;
  desksMin: number;
  desksMax: number;
  pricePerDesk: number;
  budgetBand: "£" | "££" | "£££";
  features: string[];
  availability: string;
  description: string;
};
