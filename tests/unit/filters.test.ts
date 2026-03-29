import { describe, it, expect } from "vitest";
import { parseFiltersFromParams, filtersToQueryString, DEFAULT_FILTERS } from "@/features/dashboard/filters";

describe("parseFiltersFromParams", () => {
  it("returns default filters when params are empty", () => {
    const result = parseFiltersFromParams(new URLSearchParams());
    expect(result).toEqual(DEFAULT_FILTERS);
  });

  it("parses dateRange from search params", () => {
    const params = new URLSearchParams("dateRange=7d");
    const result = parseFiltersFromParams(params);
    expect(result.dateRange).toBe("7d");
  });

  it("parses region from search params", () => {
    const params = new URLSearchParams("region=europe");
    const result = parseFiltersFromParams(params);
    expect(result.region).toBe("europe");
  });

  it("parses all filters from a full query string", () => {
    const params = new URLSearchParams(
      "dateRange=90d&region=asia-pacific&segment=smb&feature=api"
    );
    const result = parseFiltersFromParams(params);
    expect(result).toEqual({
      dateRange: "90d",
      region: "asia-pacific",
      segment: "smb",
      feature: "api",
    });
  });

  it("works with a plain Record object", () => {
    const result = parseFiltersFromParams({ region: "latam", dateRange: "7d" });
    expect(result.region).toBe("latam");
    expect(result.dateRange).toBe("7d");
  });
});

describe("filtersToQueryString", () => {
  it("serializes filters to query string", () => {
    const qs = filtersToQueryString({ region: "europe", dateRange: "30d" });
    const params = new URLSearchParams(qs);
    expect(params.get("region")).toBe("europe");
    expect(params.get("dateRange")).toBe("30d");
  });

  it("produces an empty string for empty input", () => {
    const qs = filtersToQueryString({});
    expect(qs).toBe("");
  });
});
