import rawListings from "@/data/listings.json";
import { OfficeListingPage } from "@/components/office-listing-page";
import type { OfficeListing } from "@/lib/types";

export default function Page() {
  const listings = rawListings as OfficeListing[];

  return <OfficeListingPage listings={listings} />;
}
