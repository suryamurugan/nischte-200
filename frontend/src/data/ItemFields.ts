import { z } from "zod";

export const ItemFields = [
  {
    name: "itemName",
    label: "Item Name",
    type: "text",
    validation: z.string().min(1, { message: "Item name is required" }),
  },
  {
    name: "itemDescription",
    label: "Item Description",
    type: "text",
    validation: z.string().min(1, { message: "Item description is required" }),
  },
  {
    name: "price",
    label: "Price",
    type: "number",
    validation: z.string().transform((val) => parseFloat(val)),
  },
  {
    name: "picture",
    label: "Picture",
    type: "file",
    validation: z.any().optional(),
  },
];