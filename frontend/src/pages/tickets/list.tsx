/* eslint-disable react-hooks/rules-of-hooks */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MdDeleteOutline, MdDone, MdOutlineRemoveRedEye } from "react-icons/md";
interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  severity_id: number;
  created_at: string;
  completed_at: string | null;
}

export const List = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const fetchTickets = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8080/tickets");

      setTickets(res.data.data);
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const handlerUpdateStatusDone = async (id: any) => {
    try {
      await axios.patch(`http://127.0.0.1:8080/tickets/${id}`, {
        status: "DONE",
      });

      fetchTickets();
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };

  const handlerDeleteTicket = async (id: any) => {
    try {
      await axios.delete(`http://127.0.0.1:8080/tickets/${id}`);

      fetchTickets();
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <div className="mt-2">
      <div className="flex justify-end pr-4">
        <a href="/tickets/new">
          <Button>New Ticket</Button>
        </a>
      </div>
      <div className="mt-2 overflow-y-scroll h-[700px]]">
        {!tickets || tickets.length === 0 ? (
          <p className="text-center text-gray-500">No tickets available.</p>
        ) : (
          <Table>
            <TableCaption>A list of your recent tickets.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Completed At</TableHead>
                <TableHead>Actions</TableHead>
                {/* <TableHead className="text-right">Amount</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => {
                return (
                  <TableRow key={ticket.id}>
                    <a href={`/tickets/${ticket.id}`}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                    </a>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.severity_id}</TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>
                      {formatDate(ticket.completed_at)}
                    </TableCell>{" "}
                    <TableCell>
                      <Button
                        className="mr-2"
                        onClick={() => handlerUpdateStatusDone(ticket.id)}
                        variant="secondary"
                        size="ssm"
                      >
                        <MdDone />
                      </Button>

                      <a href={`/tickets/${ticket.id}`}>
                        <Button className="mr-2" variant="default" size="ssm">
                          <MdOutlineRemoveRedEye />
                        </Button>
                      </a>
                      <Button
                        onClick={() => handlerDeleteTicket(ticket.id)}
                        variant="destructive"
                        size="ssm"
                      >
                        <MdDeleteOutline />
                      </Button>
                    </TableCell>{" "}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
