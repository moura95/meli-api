import { Button } from "@/components/ui/button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Category } from "@/lib/interfaces.ts";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface createTicket {
  title: string;
  description: string;
  category_id: number;
  subcategory_id: number | null;
  severity_id: number;
}

export const New = () => {
  const navigate = useNavigate(); // Criar a instância do navigate

  const handlerNewTicket = async (data: createTicket) => {
    try {
      await axios.post(`http://127.0.0.1:8080/tickets`, data);

      navigate("/tickets");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      categorySelected === null ||
      severitySelected === null ||
      !title ||
      !description
    ) {
      console.error("All fields are required.");
      return;
    }

    const data: createTicket = {
      title,
      description,
      category_id: categorySelected,
      subcategory_id: null,
      severity_id: severitySelected,
    };

    handlerNewTicket(data);
  };
  const listCategories = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8080/categories`);
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
  const [categorySelected, setCategorySelected] = useState("");
  const [severitySelected, setSeveritySelected] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="flex text-2xl font-bold mb-4 justify-center text-gray-700">
        Create a new ticket
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <div className="flex gap-6 flex-row bold mb-4 justify-between"></div>

          <div className="flex flex-row justify-between mb-6 mt-6 ">
            <label className="flex flex-row gap-2 text-gray-700 text-sm ">
              <p className="font-bold">Category:</p>
              <div className="flex flex-row  justify-between gap-2">
                <Select onValueChange={(value) => setCategorySelected(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </label>

            <label className="flex flex-row gap-2  text-gray-700 text-sm ">
              <p className="font-bold">Severity:</p>
              <div className="flex flex-row  justify-between gap-2">
                <Select onValueChange={(value) => setSeveritySelected(value)}>
                  <SelectTrigger defaultValue="4" className="w-[180px]">
                    <SelectValue defaultValue="4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Low</SelectItem>
                    <SelectItem value="3">Medium</SelectItem>
                    <SelectItem value="2">High</SelectItem>
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
          <Button
            onClick={() =>
              handlerNewTicket({
                title,
                description,
                category_id: Number(categorySelected),
                subcategory_id: null,
                severity_id: Number(severitySelected),
              })
            }
          >
            Create
          </Button>
        </div>
      </form>
    </div>
  );
};

export default New;
