import Form from "@/components/Form";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FC } from "react";
import { ShopFields } from "@/data/ShopField";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { API } from "@/utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const RegisterShop: FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // console.log("user emails", user?.primaryEmailAddress?.emailAddress);

  const handleRegister = async (
    data: Record<string, any>,
    resetForm: () => void
  ) => {
    const ownerId = user?.id;
    const email = user?.primaryEmailAddress?.emailAddress;

    const formData = new FormData();

    if (ownerId) {
      formData.append("ownerId", ownerId);
    }

    if (email) {
      formData.append("email", email);
    }

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    if (data.picture) {
      formData.append("picture", data.picture[0]);
    }

    try {
      await axios.post(`${API}/api/v1/shop`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Shop registered successfully!");
      navigate("/shop/manage");
      resetForm();
    } catch (error: any) {
      console.error("Error registering shop:", error);
      toast.error("Failed to register shop. Please try again.");
    }
  };

  return (
    <>
      <div className="px-6 md:px-[200px] flex flex-col ">
        <Navbar />
        <div className="flex-grow">
          <div className="flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Register Your Shop
              </h2>
              <Form
                fields={ShopFields}
                onSubmit={handleRegister}
                submitButtonText="Register Shop"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};
