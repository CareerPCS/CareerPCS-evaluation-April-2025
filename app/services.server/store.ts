// Companies, db, PostLocations, Posts

import type { AppLoadContext } from "react-router";

type Company = {
  id: string;
  data: {
    name: string;
    description: string;
    website: string;
  };
};
type Post = {
  id: string;
  data: {
    title: string;
    description: string;
    company: string;
    locations: Array<string>;
  };
};
type Location = {
  id: string;
  data: {
    name: string;
    state: string;
    company: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
};

const data = {
  companies: [
    {
      id: "company-1",
      data: {
        name: "Company A",
        description: "Description A",
        website: "https://companya.com",
      },
    },
    {
      id: "company-2",
      data: {
        name: "Company B",
        description: "Description B",
        website: "https://companyb.com",
      },
    },
    {
      id: "company-3",
      data: {
        name: "Company C",
        description: "Description C",
        website: "https://companyc.com",
      },
    },
    {
      id: "company-4",
      data: {
        name: "Company D",
        description: "Description D",
        website: "https://companyd.com",
      },
    },
  ] satisfies Array<Company>,
  posts: [
    {
      id: "post-1",
      data: {
        title: "Post A",
        description: "Description A",
        company: "company-1",
        locations: ["location-1", "location-2"],
      },
    },
    {
      id: "post-2",
      data: {
        title: "Post B",
        description: "Description B",
        company: "company-2",
        locations: ["location-3", "location-1"],
      },
    },
    {
      id: "post-3",
      data: {
        title: "Post C",
        description: "Description C",
        company: "company-3",
        locations: ["location-4"],
      },
    },
    {
      id: "post-4",
      data: {
        title: "Post D",
        description: "Description D",
        company: "company-4",
        locations: ["location-5", "location-6"],
      },
    },
  ] satisfies Array<Post>,
  locations: [
    {
      id: "location-1",
      data: {
        company: "company-1",
        name: "Location A",
        state: "New York",
        coordinates: {
          lat: 40.7128,
          lng: -74.006,
        },
      },
    },
    {
      id: "location-2",
      data: {
        company: "company-1",
        name: "Location B",
        state: "California",
        coordinates: {
          lat: 34.0522,
          lng: -118.2437,
        },
      },
    },
    {
      id: "location-3",
      data: {
        company: "company-2",
        name: "Location C",
        state: "Texas",
        coordinates: {
          lat: 29.7604,
          lng: -95.3698,
        },
      },
    },
    {
      id: "location-4",
      data: {
        company: "company-3",
        name: "Location D",
        state: "Illinois",
        coordinates: {
          lat: 41.8781,
          lng: -87.6298,
        },
      },
    },
    {
      id: "location-5",
      data: {
        company: "company-4",
        name: "Location E",
        state: "Florida",
        coordinates: {
          lat: 25.7617,
          lng: -80.1918,
        },
      },
    },
    {
      id: "location-6",
      data: {
        company: "company-4",
        name: "Location F",
        state: "Washington",
        coordinates: {
          lat: 47.6062,
          lng: -122.3321,
        },
      },
    },
  ] satisfies Array<Location>,
};

const QUERYABLE = Symbol("QUERYABLE");

type Queryable<T> = {
  [QUERYABLE]: () => T;
};

class Database {
  async fetch<T>(query: Queryable<T>): Promise<T> {
    return query[QUERYABLE]();
  }
}

export let db = (context: AppLoadContext) => {
  return new Database();
};

export let Companies = {
  all(): Queryable<Array<Company>> {
    return {
      [QUERYABLE]: () => data.companies,
    };
  },
  by_id(id: string): Queryable<Company> {
    return {
      [QUERYABLE]: () => {
        const company = data.companies.find((company) => company.id === id);
        if (!company) throw new Error("Company not found");
        return company;
      },
    };
  },
};
export let PostLocations = {
  all(): Queryable<Array<Location>> {
    return {
      [QUERYABLE]: () => data.locations,
    };
  },
  all_by_company(company_id: string): Queryable<Array<Location>> {
    return {
      [QUERYABLE]: () => {
        return data.locations.filter(
          (location) => location.data.company === company_id,
        );
      },
    };
  },
  all_by_post(post_id: string): Queryable<Array<Location>> {
    return {
      [QUERYABLE]: () => {
        const post = data.posts.find((post) => post.id === post_id);
        if (!post) return [];
        return data.locations.filter((location) =>
          post.data.locations.includes(location.id),
        );
      },
    };
  },
  by_id(id: string): Queryable<Location> {
    return {
      [QUERYABLE]: () => {
        const location = data.locations.find((location) => location.id === id);
        if (!location) throw new Error("Location not found");
        return location;
      },
    };
  },
};
export let Posts = {
  all(): Queryable<Array<Post>> {
    return {
      [QUERYABLE]: () => data.posts,
    };
  },
  all_by_location(location_id: string): Queryable<Array<Post>> {
    return {
      [QUERYABLE]: () => {
        return data.posts.filter((post) =>
          post.data.locations.includes(location_id),
        );
      },
    };
  },
  all_by_company(company_id: string): Queryable<Array<Post>> {
    return {
      [QUERYABLE]: () => {
        return data.posts.filter((post) => post.data.company === company_id);
      },
    };
  },
  by_id(id: string): Queryable<Post> {
    return {
      [QUERYABLE]: () => {
        const post = data.posts.find((post) => post.id === id);
        if (!post) throw new Error("Post not found");
        return post;
      },
    };
  },
};
