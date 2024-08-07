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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { MdDeleteOutline, MdDone, MdOutlineRemoveRedEye } from "react-icons/md";
import { axiosBackend } from "../../baseURL";
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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const fetchTickets = async () => {
    try {
      const res = await axiosBackend.get(`/tickets`);

      setTickets(res.data.data);
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatusDone = async (id: any) => {
    try {
      await axiosBackend.patch(`/tickets/${id}`, {
        status: "DONE",
      });

      fetchTickets();
    } catch (error) {
      console.error("Fetch tickets failed:", error);
    }
  };

  const handleDeleteTicket = async (id: any) => {
    try {
      await axiosBackend.delete(`/tickets/${id}`);

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
                    <TableCell>{convertSeverity(ticket.severity_id)}</TableCell>
                    <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    <TableCell>
                      {formatDate(ticket.completed_at)}
                    </TableCell>{" "}
                    <TableCell>
                      <Button
                        className="mr-2"
                        onClick={() => handleUpdateStatusDone(ticket.id)}
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
                        onClick={() => handleDeleteTicket(ticket.id)}
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
