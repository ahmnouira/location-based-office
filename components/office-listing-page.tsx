"use client";

import { useMemo, useState } from "react";
import type { OfficeListing } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  listings: OfficeListing[];
};

const faqItems = [
  {
    question: "What is included in a serviced office in London?",
    answer:
      "Most serviced offices include rent, utilities, business rates, furniture, fast internet, reception support and meeting room access within a single monthly fee.",
  },
  {
    question: "How quickly can we move into a London serviced office?",
    answer:
      "Many suites are ready immediately, especially for teams taking smaller private offices. Managed spaces usually need a few weeks for fit-out and branding.",
  },
  {
    question: "Are serviced offices more expensive than a traditional lease?",
    answer:
      "Desk rates can look higher on paper, but serviced offices often reduce upfront costs, fit-out spend and long lease commitments, which makes them attractive for growing teams.",
  },
  {
    question: "Can you help shortlist offices across different London areas?",
    answer:
      "Yes. A workspace advisor can compare neighbourhoods, commute patterns, budget bands and availability so you only view offices that genuinely fit your brief.",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function getBudgetOptions(listings: OfficeListing[]) {
  return Array.from(new Set(listings.map((listing) => listing.budgetBand)));
}

function getAreas(listings: OfficeListing[]) {
  return Array.from(new Set(listings.map((listing) => listing.area))).sort();
}

export function OfficeListingPage({ listings }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [officeType, setOfficeType] = useState("All");
  const [area, setArea] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1200);
  const [deskCount, setDeskCount] = useState("Any");

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchesSearch =
        searchTerm.trim().length === 0 ||
        `${listing.name} ${listing.area} ${listing.address} ${listing.nearestStation}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesType =
        officeType === "All" || listing.officeType === officeType;
      const matchesArea = area === "All" || listing.area === area;
      const matchesBudget = listing.pricePerDesk <= maxPrice;
      const matchesDesks =
        deskCount === "Any" ||
        (deskCount === "1-10" && listing.desksMin <= 10) ||
        (deskCount === "10-25" &&
          listing.desksMax >= 10 &&
          listing.desksMin <= 25) ||
        (deskCount === "25+" && listing.desksMax >= 25);

      return (
        matchesSearch &&
        matchesType &&
        matchesArea &&
        matchesBudget &&
        matchesDesks
      );
    });
  }, [area, deskCount, listings, maxPrice, officeType, searchTerm]);

  const areas = getAreas(listings);
  const budgetOptions = getBudgetOptions(listings);

  return (
    <main className="pb-16">
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-white/60 bg-hero-grid px-6 py-10 shadow-panel sm:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/70 text-foreground">
                London Office Search
              </Badge>
              <h1 className="font-display text-4xl leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Serviced Offices in London
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Compare flexible offices across London’s leading business
                districts. Shortlist spaces by budget, desk count and area, then
                speak to an advisor for tailored recommendations and fast
                viewings.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button>Speak to an Advisor</Button>
                <Button variant="outline">Download Availability Guide</Button>
              </div>
            </div>

            <Card className="overflow-hidden border-primary/10 bg-white/75 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Market Snapshot
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="font-display text-3xl text-foreground">
                    {listings.length}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    London offices live
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">
                    From £450
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    per desk / month
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">
                    12 areas
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    from Mayfair to Hammersmith
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">1-100</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    desks supported
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="p-5 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, neighbourhood or station"
                aria-label="Search offices"
              />
              <Select
                value={officeType}
                onChange={(event) => setOfficeType(event.target.value)}
              >
                <option>All</option>
                <option>Serviced Office</option>
                <option>Managed Office</option>
                <option>Coworking</option>
              </Select>
              <Select
                value={area}
                onChange={(event) => setArea(event.target.value)}
              >
                <option>All</option>
                {areas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Select
                value={deskCount}
                onChange={(event) => setDeskCount(event.target.value)}
              >
                <option>Any</option>
                <option>1-10</option>
                <option>10-25</option>
                <option>25+</option>
              </Select>
              <div className="rounded-2xl border border-input bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-foreground">
                    Budget
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Up to {formatCurrency(maxPrice)}
                  </span>
                </div>
                <input
                  className="mt-3 h-2 w-full accent-[hsl(var(--primary))]"
                  type="range"
                  min={450}
                  max={1200}
                  step={25}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  aria-label="Maximum budget"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {budgetOptions.map((band) => (
                  <Badge
                    key={band}
                    className="bg-accent text-accent-foreground"
                  >
                    {band} budget options
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredListings.length}
                </span>{" "}
                of {listings.length} offices
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing, index) => (
            <Card
              key={listing.id}
              className="group flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    className={
                      index % 3 === 0 ? "bg-accent text-accent-foreground" : ""
                    }
                  >
                    {listing.officeType}
                  </Badge>
                  <h2 className="mt-4 font-display text-3xl leading-tight text-foreground">
                    {listing.name}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {listing.area} • {listing.nearestStation}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-2 text-right">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    From
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(listing.pricePerDesk)}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {listing.description}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-[24px] bg-muted/60 p-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Desk range</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {listing.desksMin}-{listing.desksMax} desks
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {listing.availability}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Address</dt>
                  <dd className="mt-1 font-semibold text-foreground">
                    {listing.address}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap gap-2">
                {listing.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <Button className="w-full">Arrange a Viewing</Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 ? (
          <div className="mx-auto mt-6 max-w-7xl">
            <Card className="p-8 text-center">
              <h3 className="font-display text-3xl text-foreground">
                No offices match that brief
              </h3>
              <p className="mt-3 text-muted-foreground">
                Try widening your budget or desk range, or speak to an advisor
                for off-market options.
              </p>
            </Card>
          </div>
        ) : null}
      </section>

      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden border-primary/10 bg-primary p-8 text-primary-foreground sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
                  Need a smarter shortlist?
                </p>
                <h3 className="mt-3 font-display text-4xl leading-tight">
                  Speak to a London office advisor today
                </h3>
                <p className="mt-4 max-w-2xl text-primary-foreground/80">
                  We can narrow the market, negotiate terms and line up viewings
                  around your budget, headcount and preferred neighbourhoods.
                </p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                    <span>Typical response time</span>
                    <strong>Under 1 hour</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                    <span>Neighbourhood guidance</span>
                    <strong>Included</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 px-4 py-3">
                    <span>Viewing coordination</span>
                    <strong>Handled for you</strong>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Book a Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 bg-transparent text-white hover:bg-white/10"
                  >
                    Email an Advisor
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 max-w-3xl">
            <Badge>London Office FAQ</Badge>
            <h3 className="mt-4 font-display text-4xl text-foreground">
              Common questions about serviced offices in London
            </h3>
          </div>
          <div className="grid gap-4">
            {faqItems.map((item) => (
              <Card key={item.question} className="p-6">
                <h4 className="text-lg font-semibold text-foreground">
                  {item.question}
                </h4>
                <p className="mt-2 max-w-4xl text-sm leading-7 text-muted-foreground">
                  {item.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
