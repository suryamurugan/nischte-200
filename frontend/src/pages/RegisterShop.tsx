import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const shopSchema = z.object({
  name: z.string().min(1, { message: "Shop name is required" }),
  email: z.string().email(),
  address: z.string().min(1, { message: "Address is required" }),
  contact: z
    .string()
    .min(1, { message: "Contact number is required" })
    .regex(/^\d{10}$/, { message: "Contact number must be 10 digits" }),
  picture: z.any().optional(),
});

type ShopForm = z.infer<typeof shopSchema>;

export const RegisterShop: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopForm>({
    resolver: zodResolver(shopSchema),
  });

  const onSubmit = (data: ShopForm) => {
    console.log("form data", data);
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Register Your Shop
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full max-w-sm items-center gap-2">
              <Label htmlFor="name" className="font-bold  text-gray-800">
                Shop Name:{" "}
              </Label>
              <Input {...register("name")} id="name" type="text" />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="w-full max-w-sm items-center gap-2">
              <Label htmlFor="name" className="font-bold  text-gray-800">
                Email:{" "}
              </Label>
              <Input {...register("email")} id="email" type="email" />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="address" className="font-bold  text-gray-800">
                Address:{" "}
              </Label>
              <Input {...register("address")} id="address" type="text" />
              {errors.address && (
                <p className="text-red-500">{errors.address.message}</p>
              )}
            </div>
            <div className="w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="contact" className="font-bold  text-gray-800">
                Contact No:{" "}
              </Label>
              <Input {...register("contact")} id="contact" type="number" />
              {errors.contact && (
                <p className="text-red-500">{errors.contact.message}</p>
              )}
            </div>
            <div className="w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture" className="font-bold  text-gray-800">
                Picture
              </Label>
              <Input {...register("picture")} id="picture" type="file" />
            </div>
            <Button className="mt-4 items-center justify-center w-full">
              Register
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
