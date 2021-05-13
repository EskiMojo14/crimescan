import React from "react";
import { CrimeEntry } from "./types";
import { IconPropT } from "@rmwc/types";
import { iconObject } from "./functions";

export const queryIcons: Record<string, IconPropT> = {
  month: "date_range",
  year: "date_range",
  lat: iconObject(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 4C15 4 17.5 5.6 18.9 8H5.1C6.5 5.6 9 4 12 4M12 20C9 20 6.5 18.4 5.1 16H18.9C17.5 18.4 15 20 12 20M4.3 14C4.1 13.4 4 12.7 4 12S4.1 10.6 4.3 10H19.8C20 10.6 20.1 11.3 20.1 12S20 13.4 19.8 14H4.3Z" />
    </svg>
  ),
  lng: iconObject(
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 2A10 10 0 1 0 22 12A10.03 10.03 0 0 0 12 2M9.4 19.6A8.05 8.05 0 0 1 9.4 4.4A16.45 16.45 0 0 0 7.5 12A16.45 16.45 0 0 0 9.4 19.6M12 20A13.81 13.81 0 0 1 9.5 12A13.81 13.81 0 0 1 12 4A13.81 13.81 0 0 1 14.5 12A13.81 13.81 0 0 1 12 20M14.6 19.6A16.15 16.15 0 0 0 14.6 4.4A8.03 8.03 0 0 1 20 12A7.9 7.9 0 0 1 14.6 19.6Z" />
    </svg>
  ),
};

export const exampleData: CrimeEntry[] = [
  {
    category: "anti-social-behaviour",
    location_type: "Force",
    location: {
      latitude: "51.378370",
      street: {
        id: 539044,
        name: "On or near Shopping Area",
      },
      longitude: "-2.359207",
    },
    context: "",
    outcome_status: null,
    persistent_id: "",
    id: 82806818,
    location_subtype: "",
    month: "2020-04",
  },
  {
    category: "public-order",
    location_type: "Force",
    location: {
      latitude: "51.378370",
      street: {
        id: 539044,
        name: "On or near Shopping Area",
      },
      longitude: "-2.359207",
    },
    context: "",
    outcome_status: {
      category: "Court result unavailable",
      date: "2020-10",
    },
    persistent_id: "6a4e4a4f2565ffcc71d6962ec79ca9a0237fad47668bf92612daa9737c20acb6",
    id: 82814102,
    location_subtype: "",
    month: "2020-04",
  },
  {
    category: "public-order",
    location_type: "Force",
    location: {
      latitude: "51.378370",
      street: {
        id: 539044,
        name: "On or near Shopping Area",
      },
      longitude: "-2.359207",
    },
    context: "",
    outcome_status: {
      category: "Court result unavailable",
      date: "2020-10",
    },
    persistent_id: "53a2d3d174f73dcbe4dce9d44e2689bd485fcb4b5bebcf68f3ba33e6a9158a01",
    id: 82812901,
    location_subtype: "",
    month: "2020-04",
  },
  {
    category: "violent-crime",
    location_type: "Force",
    location: {
      latitude: "51.378370",
      street: {
        id: 539044,
        name: "On or near Shopping Area",
      },
      longitude: "-2.359207",
    },
    context: "",
    outcome_status: {
      category: "Unable to prosecute suspect",
      date: "2020-04",
    },
    persistent_id: "726434b6a68c7555ef983d0af31bb81cb66801bc83b1d1fedfed5be584657f5a",
    id: 82809488,
    location_subtype: "",
    month: "2020-04",
  },
  {
    category: "violent-crime",
    location_type: "Force",
    location: {
      latitude: "51.378370",
      street: {
        id: 539044,
        name: "On or near Shopping Area",
      },
      longitude: "-2.359207",
    },
    context: "",
    outcome_status: {
      category: "Court result unavailable",
      date: "2020-11",
    },
    persistent_id: "0866a8e6ead67e40e1f5d3a2dd3295f0a7fd0ab79aaa8e527be26e4bb7f6eb59",
    id: 82811909,
    location_subtype: "",
    month: "2020-04",
  },
];
