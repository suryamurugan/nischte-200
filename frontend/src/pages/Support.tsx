import React, { FC, useState } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { API } from "@/utils/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Support: FC = () => {
  const { userId } = useParams();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) {
      toast.error("Please enter your description.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/v1/support`, { userId, description });
      toast.success("Your message has been sent successfully!");
      setDescription("");
    } catch (error) {
      toast.error("Failed to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen px-4 md:px-[200px]">
      <Navbar />
      <div className="flex-grow">
        <h2 className="text-2xl font-bold mb-4">Support</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Try to explain in detail..."
            rows={6}
            className="mb-4 resize-none h-auto min-h-[350px] max-h-[80vh] overflow-hidden "
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};
