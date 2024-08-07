import type { Ticket } from "../../lib/interfaces";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { axiosBackend } from "../../baseURL";

export const Details = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const navigator = useNavigate();

  function returnSeverityValues(id: number | undefined) {
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
  }

  async function deleteTicket() {
    try {
      await axiosBackend.delete(`/tickets/${id}`);
      navigator("/tickets");
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  }

  async function getTicket() {
    try {
      const res = await axiosBackend.get(`/tickets/${id}`);
      setTicket(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error("Failed to fetch ticket:", error);
    }
  }

  async function handleStatusChange(status: string) {
    try {
      await axiosBackend.patch(`/tickets/${id}`, {
        status,
      });
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  }

  async function handleSeverityChange(severity_id: string) {
    try {
      await axiosBackend.patch(`/tickets/${id}`, {
        severity_id: Number(severity_id),
      });
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  }

  useEffect(() => {
    getTicket();
  }, []);

  return (
    <div className="max-w-3xl p-4 mx-auto mt-5 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-center text-gray-700">
        {ticket?.title}
      </h1>
      <div className="flex flex-col gap-6 mt-2 text-sm">
        <div className="flex justify-between">
          <h2>
            <strong>ID:</strong> {ticket?.id}
          </h2>
          <button className="p-1 bg-red-600" onClick={deleteTicket}>
            <MdDeleteOutline size={20} color="white" />
          </button>
        </div>
        <div className="flex justify-between">
          <label className="flex flex-col gap-2">
            <span className="font-bold">Status</span>
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger
                className="w-[200px]"
                defaultValue={ticket?.status}
                value={ticket?.status}
              >
                <SelectValue
                  defaultValue={ticket?.status}
                  placeholder={ticket?.status}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-bold">Severity</span>
            <Select onValueChange={handleSeverityChange}>
              <SelectTrigger
                className="w-[200px]"
                defaultValue={returnSeverityValues(ticket?.severity_id)}
                value={returnSeverityValues(ticket?.severity_id)}
              >
                <SelectValue
                  defaultValue={returnSeverityValues(ticket?.severity_id)}
                  placeholder={returnSeverityValues(ticket?.severity_id)}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Severity</SelectLabel>
                  <SelectItem value="1">Issue high</SelectItem>
                  <SelectItem value="2">High</SelectItem>
                  <SelectItem value="3">Medium</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>
        </div>
        <div className="flex justify-between">
          <h2>
            <strong>Category:</strong> {ticket?.id}
          </h2>
          <h2>
            <strong>Subcategory:</strong> {ticket?.id}
          </h2>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Description</h2>
          <textarea
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none"
            value={ticket?.description}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Created at</h2>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none"
            value={
              ticket?.created_at
                ? new Date(ticket?.created_at).toLocaleString()
                : "N/A"
            }
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Completed at</h2>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none"
            value={
              ticket?.completed_at
                ? new Date(ticket?.completed_at).toLocaleString()
                : "N/A"
            }
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Details;
