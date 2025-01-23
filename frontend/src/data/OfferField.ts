import { z } from "zod";

export const OfferFields = [
  {
    name: "offerType.name",
    label: "Offer Type",
    type: "select",
    options: [
      { value: "Flat-Discount", label: "Flat Discount" },
      { value: "Plus-Offer", label: "Plus Offer" },
      { value: "Special-Offer", label: "Special Offer" },
      { value: "Discount-Dishes", label: "Discount Dishes" },
    ],
    validation: z.enum(
      ["Flat-Discount", "Plus-Offer", "Special-Offer", "Discount-Dishes"],
      { message: "Select a valid offer type" }
    ),
  },
  {
    name: "offerDescription.discountRate",
    label: "Discount Rate",
    type: "number",
    validation: z.number().min(0).optional(),
    dependsOn: "offerType.name",
  },
  {
    name: "offerDescription.minOrder",
    label: "Minimum Order Amount",
    type: "number",
    validation: z.number().min(0).optional(),
    dependsOn: "offerType.name",
  },
  {
    name: "offerDescription.plusOffers",
    label: "Plus Offers",
    type: "number",
    validation: z.number().min(0).optional(),
    dependsOn: "offerType.name",
  },
  {
    name: "offerDescription.specialOccasionDate",
    label: "Special Occasion Date",
    type: "date",
    validation: z.date().optional(),
    dependsOn: "offerType.name",
  },
  {
    name: "offerDescription.discountDishes",
    label: "Discount Dishes",
    type: "text",
    validation: z.string().optional(),
    dependsOn: "offerType.name",
  },
  {
    name: "offerDescription.numberOfVisits",
    label: "Number of Visits",
    type: "number",
    validation: z.number().min(0).optional(),
  },
  {
    name: "offerDescription.description",
    label: "Description",
    type: "input",
    validation: z.string().min(1, { message: "Description is required" }),
  },
  {
    name: "_isActive",
    label: "Is Active",
    type: "checkbox",
    validation: z.boolean().optional(),
  },
];
