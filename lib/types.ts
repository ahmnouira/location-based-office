export type OfficeAdvisor = {
  name: string;
  phone: string;
};

export type OfficeType =
  | "Serviced Office"
  | "Managed Office"
  | "Coworking";

export type OfficeListing = {
  id: string;
  name: string;
  type: OfficeType;
  area: string;
  borough: string;
  address: string;
  desks: number;
  price_per_desk: number | null;
  amenities: string[];
  available_from: string;
  description: string;
  image_url: string | null;
  advisor: OfficeAdvisor;
  featured: boolean;
};
