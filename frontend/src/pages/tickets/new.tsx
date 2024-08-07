import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Category } from "@/lib/interfaces.ts";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectGroup, SelectLabel } from "../../components/ui/select";
import { axiosBackend } from "../../baseURL";

interface createTicket {
  title: string;
  description: string;
  category_id: number;
  subcategory_id: number | null;
  severity_id: number;
}

export const New = () => {
  const navigate = useNavigate(); // Criar a instância do navigate

  async function handleNewTicket() {
    try {
      if (!title || !description || !categorySelected || !severitySelected) {
        alert("Fill in all fields");
        return;
      }

      const data: createTicket = {
        title,
        description,
        category_id: Number(categorySelected),
        subcategory_id: null,
        severity_id: Number(severitySelected),
      };

      await axiosBackend.post(`/tickets`, data);
      navigate("/tickets/list");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  }

  async function handleSeverityChange(severityId: string) {
    setSeveritySelected(Number(severityId));
  }

  async function handleCategoryChange(categoryId: string) {
    console.log(categoryId);
    setCategorySelected(Number(categoryId));
  }

  const listCategories = async () => {
    try {
      const res = await axiosBackend.get(`/categories`);
      const data = res.data.data.map((category: any) => {
        return {
          id: category.id,
          name: category.name,
        };
      });
      setCategories(data);
    } catch (error) {
      console.error("Failed get categories:", error);
    }
  };

  useEffect(() => {
    listCategories();
  }, []);

  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState();
  const [severitySelected, setSeveritySelected] = useState();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="flex text-2xl font-bold mb-4 justify-center text-gray-700">
        Create a new ticket
      </h2>

      <div>
        <div className="flex gap-6 flex-row bold mb-4 justify-between"></div>

        <div className="flex flex-row justify-between mb-6 mt-6 ">
          <label className="flex flex-row gap-2 text-gray-700 text-sm ">
            <p className="font-bold">Category:</p>
            <div className="flex flex-row  justify-between gap-2">
              <Select
                onValueChange={handleCategoryChange}
                value={categorySelected}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categories.map((category: Category) => (
                      <SelectItem
                        value={category.id}
                        selected={categorySelected === category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </label>

          <label className="flex flex-row gap-2  text-gray-700 text-sm ">
            <p className="font-bold">Severity:</p>
            <div className="flex flex-row  justify-between gap-2">
              <Select onValueChange={handleSeverityChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Severity</SelectLabel>
                    {/* <SelectItem value="1">Issue high</SelectItem> */}
                    <SelectItem value="2">High</SelectItem>
                    <SelectItem value="3">Medium</SelectItem>
                    <SelectItem value="4">Low</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Title
        </label>
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          className="shadow border rounded  py-2 px-3 w-[450px] text-gray-700 leading-tight"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
        />
      </div>

      <div>
        <Button onClick={handleNewTicket}>Create</Button>
      </div>
    </div>
  );
};

export default New;
