"use client";

import { useMemo, useState } from "react";
import type { OfficeListing, OfficeType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type Props = {
  listings: OfficeListing[];
};

const officeTypes: Array<OfficeType | "All"> = [
  "All",
  "Serviced Office",
  "Managed Office",
  "Coworking",
];

const deskRanges = ["Any", "1-8", "9-20", "21+"] as const;

const faqItems = [
  {
    question: "What is included in a serviced office in London?",
    answer:
      "Most serviced offices include rent, utilities, furniture, broadband, reception support and access to shared amenities within one monthly cost.",
  },
  {
    question: "Can you compare coworking, managed and serviced offices?",
    answer:
      "Yes. Coworking suits flexibility, managed space gives more control over layout and branding, and serviced offices are the fastest route to a private ready-to-use office.",
  },
  {
    question: "What happens if the price is listed as POA?",
    answer:
      "POA means pricing is available on request. This is common for premium or limited-availability suites where landlords prefer to quote based on lease terms and requirements.",
  },
  {
    question: "Can an advisor help us shortlist by borough and move-in date?",
    answer:
      "Yes. Advisors can narrow options by preferred London areas, target move-in window, headcount and budget, then coordinate suitable viewings.",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPrice(value: number | null) {
  return value === null ? "POA" : formatCurrency(value);
}

function formatMoveInDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getAreas(listings: OfficeListing[]) {
  return Array.from(new Set(listings.map((listing) => listing.area))).sort();
}

function getBoroughs(listings: OfficeListing[]) {
  return Array.from(new Set(listings.map((listing) => listing.borough))).sort();
}

function getPricedListings(listings: OfficeListing[]) {
  return listings.filter(
    (listing): listing is OfficeListing & { price_per_desk: number } =>
      listing.price_per_desk !== null,
  );
}

function getDeskRangeLabel(desks: number) {
  if (desks <= 8) return "1-8 desks";
  if (desks <= 20) return "9-20 desks";
  return "21+ desks";
}

function getDeskRangeMatch(filter: (typeof deskRanges)[number], desks: number) {
  if (filter === "Any") return true;
  if (filter === "1-8") return desks <= 8;
  if (filter === "9-20") return desks >= 9 && desks <= 20;
  return desks >= 21;
}

function getListingAccent(listing: OfficeListing) {
  if (listing.featured) {
    return "from-amber-100 via-orange-50 to-white";
  }

  if (listing.type === "Coworking") {
    return "from-sky-100 via-cyan-50 to-white";
  }

  if (listing.type === "Managed Office") {
    return "from-emerald-100 via-lime-50 to-white";
  }

  return "from-stone-100 via-white to-white";
}

export function OfficeListingPage({ listings }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [officeType, setOfficeType] =
    useState<(typeof officeTypes)[number]>("All");
  const [area, setArea] = useState("All");
  const [borough, setBorough] = useState("All");
  const pricedListings = useMemo(() => getPricedListings(listings), [listings]);
  const maxAvailablePrice = useMemo(
    () =>
      pricedListings.length > 0
        ? Math.max(...pricedListings.map((listing) => listing.price_per_desk))
        : 1000,
    [pricedListings],
  );
  const minAvailablePrice = useMemo(
    () =>
      pricedListings.length > 0
        ? Math.min(...pricedListings.map((listing) => listing.price_per_desk))
        : 0,
    [pricedListings],
  );
  const [maxPrice, setMaxPrice] = useState(maxAvailablePrice);
  const [deskCount, setDeskCount] =
    useState<(typeof deskRanges)[number]>("Any");

  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        const matchesSearch =
          searchTerm.trim().length === 0 ||
          [
            listing.name,
            listing.area,
            listing.borough,
            listing.address,
            listing.advisor.name,
          ]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesType = officeType === "All" || listing.type === officeType;
        const matchesArea = area === "All" || listing.area === area;
        const matchesBorough = borough === "All" || listing.borough === borough;
        const matchesBudget =
          listing.price_per_desk === null || listing.price_per_desk <= maxPrice;
        const matchesDesks = getDeskRangeMatch(deskCount, listing.desks);

        return (
          matchesSearch &&
          matchesType &&
          matchesArea &&
          matchesBorough &&
          matchesBudget &&
          matchesDesks
        );
      })
      .sort((left, right) => {
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1;
        }

        return left.name.localeCompare(right.name);
      });
  }, [area, borough, deskCount, listings, maxPrice, officeType, searchTerm]);

  const areas = getAreas(listings);
  const boroughs = getBoroughs(listings);
  const featuredCount = listings.filter((listing) => listing.featured).length;
  const advisorCount = new Set(listings.map((listing) => listing.advisor.name))
    .size;
  const soonestDate = [...listings].sort(
    (left, right) =>
      new Date(left.available_from).getTime() -
      new Date(right.available_from).getTime(),
  )[0]?.available_from;
  const maxDeskCount = Math.max(...listings.map((listing) => listing.desks));

  return (
    <main className="pb-16">
      <section className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-white/60 bg-hero-grid px-6 py-10 shadow-panel sm:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <Badge className="mb-4 bg-white/70 text-foreground">
                London Workspace Search
              </Badge>
              <h1 className="font-display text-4xl leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Find flexible offices with live London availability
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Search serviced offices, managed suites and coworking spaces
                across London. Compare boroughs, desk counts, move-in dates and
                advisor-backed listings in one place.
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
                    active listings
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">
                    {formatCurrency(minAvailablePrice)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    lowest listed desk rate
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">
                    {featuredCount}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    featured spaces
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl text-foreground">
                    {maxDeskCount}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    desks in the largest option
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-[24px] bg-muted/70 p-4 text-sm text-muted-foreground">
                Earliest move-in:{" "}
                <span className="font-semibold text-foreground">
                  {soonestDate ? formatMoveInDate(soonestDate) : "On request"}
                </span>{" "}
                across{" "}
                <span className="font-semibold text-foreground">
                  {boroughs.length} boroughs
                </span>
                .
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="p-5 sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[1.3fr_repeat(5,minmax(0,1fr))]">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, area, borough or advisor"
                aria-label="Search offices"
              />
              <Select
                value={officeType}
                onChange={(event) =>
                  setOfficeType(
                    event.target.value as (typeof officeTypes)[number],
                  )
                }
              >
                {officeTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Select
                value={area}
                onChange={(event) => setArea(event.target.value)}
              >
                <option value="All">All areas</option>
                {areas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Select
                value={borough}
                onChange={(event) => setBorough(event.target.value)}
              >
                <option value="All">All boroughs</option>
                {boroughs.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
              <Select
                value={deskCount}
                onChange={(event) =>
                  setDeskCount(
                    event.target.value as (typeof deskRanges)[number],
                  )
                }
              >
                {deskRanges.map((item) => (
                  <option key={item}>{item}</option>
                ))}
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
                  min={minAvailablePrice}
                  max={maxAvailablePrice}
                  step={10}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                  aria-label="Maximum budget"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-accent text-accent-foreground">
                  {advisorCount} advisors
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  {boroughs.length} boroughs
                </Badge>
                <Badge className="bg-accent text-accent-foreground">
                  POA pricing included
                </Badge>
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
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className="group flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-primary/20"
            >
              <div
                className={`relative border-b border-border/70 bg-gradient-to-br ${getListingAccent(listing)} p-6`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={
                        listing.featured
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }
                    >
                      {listing.type}
                    </Badge>
                    {listing.featured ? (
                      <Badge className="bg-white/80 text-foreground">
                        Featured
                      </Badge>
                    ) : null}
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2 text-right shadow-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      From
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(listing.price_per_desk)}
                    </p>
                  </div>
                </div>
                <h2 className="mt-5 font-display text-3xl leading-tight text-foreground">
                  {listing.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {listing.area}, {listing.borough}
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <span>{listing.desks} desks</span>
                  <span>•</span>
                  <span>{formatMoveInDate(listing.available_from)}</span>
                  <span>•</span>
                  <span>
                    {listing.image_url ? "Photo supplied" : "Preview pending"}
                  </span>
                </div>
              </div>

              <div className="flex h-full flex-col p-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  {listing.description}
                </p>

                <dl className="mt-6 grid grid-cols-2 gap-4 rounded-[24px] bg-muted/60 p-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Desk range</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {getDeskRangeLabel(listing.desks)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Move-in from</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {formatMoveInDate(listing.available_from)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Address</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {listing.address || `${listing.area}, ${listing.borough}`}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground">Advisor</dt>
                    <dd className="mt-1 font-semibold text-foreground">
                      {listing.advisor.name} · {listing.advisor.phone}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-wrap gap-2">
                  {listing.amenities.map((feature) => (
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
                Try widening your budget, removing a borough filter, or speak to
                an advisor for off-market options and POA-only availability.
              </p>
            </Card>
          </div>
        ) : null}
      </section>

      <section className="px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden border-primary/20 bg-[linear-gradient(135deg,rgba(33,74,50,1),rgba(20,54,35,1))] p-8 text-primary-foreground shadow-[0_28px_80px_rgba(20,54,35,0.28)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/75">
                  Need a smarter shortlist?
                </p>
                <h3 className="mt-3 font-display text-4xl leading-tight text-white">
                  Match your team with the right London workspace faster
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/90">
                  We can narrow the market, explain POA pricing, recommend
                  boroughs and line up viewings around your budget, team size
                  and target move-in date.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/15 bg-[rgba(247,250,244,0.12)] p-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-3 text-primary-foreground/90">
                    <span>Typical response time</span>
                    <strong className="text-white">Under 1 hour</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-3 text-primary-foreground/90">
                    <span>Borough guidance</span>
                    <strong className="text-white">Included</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.08)] px-4 py-3 text-primary-foreground/90">
                    <span>Viewing coordination</span>
                    <strong className="text-white">Handled for you</strong>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button className="bg-white text-primary shadow-none hover:bg-white/90">
                    Book a Call
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/25 bg-[rgba(255,255,255,0.04)] text-white hover:bg-[rgba(255,255,255,0.12)]"
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
              Common questions about flexible offices in London
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
