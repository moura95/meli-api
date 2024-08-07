import { Button } from "@/components/ui/button.tsx";
import type { Ticket } from "@/lib/interfaces.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

export const Details = () => {
  const convertSeverity = (id: number) => {
    switch (id) {
      case 1:
        return "Issue High";
      case 2:
        return "High";
      case 3:
        return "Medium";
      case 4:
        return "Low";
      default:
        return "N/A";
    }
  };
  const { id } = useParams<{ id: string }>();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [statusSelected, setStatusSelected] = useState<string>("");

  const navigator = useNavigate();
  const handlerDeleteTicket = async (id: any) => {
    try {
      console.log(id);
      await axios.delete(`http://127.0.0.1:8080/tickets/${id}`);

      navigator("/tickets");
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };

  useEffect(() => {
    const getTicket = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8080/tickets/${id}`);
        setTicket(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Failed to fetch ticket:", error);
      }
    };

    getTicket();
  }, [id]);
  const [severitySelected, setSeveritySelected] = useState("");

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h2 className="flex text-2xl font-bold mb-4 justify-center text-gray-700">
        {ticket.title}
      </h2>
      <form>
        <div>
          <div className="flex gap-6 flex-row bold mb-4 justify-between">
            <div className="flex flex-row  gap-2">
              <p>ID:</p>
              <p>{ticket.id}</p>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => handlerDeleteTicket(id)}
                variant="destructive"
                size="ssm"
              >
                <MdDeleteOutline />
              </Button>
            </div>
            <div></div>
          </div>

          <div className="flex flex-row justify-between mb-6 mt-6 ">
            <label className="flex flex-row gap-2  text-gray-700 text-sm ">
              <p className="font-bold text-gray-700">Status:</p>
              <div className="flex flex-row justify-between gap-2">
                <Select onValueChange={(value) => setStatusSelected(value)}>
                  <SelectTrigger
                    defaultValue={statusSelected}
                    className="w-[180px]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="DONE">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </label>

            <label className="flex flex-row gap-2 text-gray-700 text-sm ">
              <p className="font-bold">Severity:</p>
              <p>{convertSeverity(ticket.severity_id)}</p>
            </label>
          </div>
        </div>

        <div className="flex flex-row  justify-between gap-2">
          <label className="flex flex-row gap-2 text-gray-700 text-sm ">
            <p className="font-bold text-gray-700 gap-2">Category:</p>
            <p>{ticket.category.name}</p>
          </label>

          <label className="flex flex-row gap-2 text-gray-700 text-sm mb-6 ">
            <p className="font-bold">Subcategory:</p>
            <p>{ticket.subcategory.name}</p>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            value={ticket.description}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created At
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            type="text"
            value={new Date(ticket.created_at).toLocaleString()}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Completed At
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            type="text"
            value={
              ticket.completed_at
                ? new Date(ticket.completed_at).toLocaleString()
                : "N/A"
            }
            readOnly
          />
        </div>
      </form>
    </div>
  );
};

export default Details;
