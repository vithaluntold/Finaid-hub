"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import axios from "axios";
import { backendBaseURL } from "@/assets/constants/constant";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "cleared" | "pending" | "reconciled";
  payee_id?: string;
  account_name?: string;
  payee_type?: string;
  payee_name?: string;
  account_class?: string;
  trx_type?: string;
  account_id?: string;
  [key: string]: any;
};

type TransactionTableProps = {
  filter: "all" | "income" | "expenses" | "pending";
  ledgerId: string;
  clientID: string;
};

export default function SyncDataTable({
  clientID,
  filter,
  ledgerId,
}: TransactionTableProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // functions

  async function getAllSyncDataTransactions() {
    console.log(clientID, "clientID");
    setIsLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `${backendBaseURL}/api/v1/ai-agent/vector/query`,
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        params: {
          client_company_id: clientID,
        },
      });

      if (response?.data?.success) {
        if (response?.data?.data?.length < 1) {
          setTransactions([]);
          showToast({
            title: "Fetch Successful!",
            description: "No sync found!",
          });
        } else {
          setTransactions(response?.data?.data);
          showToast({
            title: response?.data?.message,
            description: "",
          });
        }
      } else {
        showToast({
          title: "Error while trying to sync data!",
          description: "",
        });
        setTransactions([]);
      }
      setIsLoading(false);
      console.log(response, "Get all sync data response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "get all sync data api error");
    }
  }

  // renderings

  useEffect(() => {
    // In a real app, this would fetch from an API based on the ledgerId
    // const generateTransactions = () => {
    //   const categories = {
    //     income: ["Client Payment", "Consulting", "Interest", "Sales", "Refund"],
    //     expense: ["Office Supplies", "Software", "Utilities", "Rent", "Travel", "Marketing", "Salary"],
    //   }
    //   const descriptions = {
    //     income: [
    //       "Client payment - Project Alpha",
    //       "Monthly retainer - XYZ Corp",
    //       "Consulting services",
    //       "Product sales",
    //       "Interest income",
    //     ],
    //     expense: [
    //       "Office supplies from Staples",
    //       "Software subscription - Adobe",
    //       "Electricity bill",
    //       "Office rent",
    //       "Business travel - Conference",
    //       "Digital marketing campaign",
    //       "Employee salary",
    //     ],
    //   }
    //   const statuses = ["cleared", "pending", "reconciled"]
    //   const result: Transaction[] = []
    //   // Generate different number of transactions based on ledgerId to simulate different ledgers
    //   const transactionCount = ledgerId.includes("q1") ? 30 : ledgerId.includes("q2") ? 50 : 25
    //   // Generate random transactions over the last 30 days
    //   for (let i = 0; i < transactionCount; i++) {
    //     const type = Math.random() > 0.4 ? "expense" : "income"
    //     const categoryList = type === "income" ? categories.income : categories.expense
    //     const descriptionList = type === "income" ? descriptions.income : descriptions.expense
    //     const randomDate = new Date()
    //     randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))
    //     const transaction: Transaction = {
    //       id: `${ledgerId}-tr-${i}`,
    //       date: randomDate,
    //       description: descriptionList[Math.floor(Math.random() * descriptionList.length)],
    //       category: categoryList[Math.floor(Math.random() * categoryList.length)],
    //       amount: Number.parseFloat((Math.random() * (type === "income" ? 5000 : 2000) + 100).toFixed(2)),
    //       type,
    //       status: statuses[Math.floor(Math.random() * statuses.length)] as "cleared" | "pending" | "reconciled",
    //     }
    //     result.push(transaction)
    //   }
    //   return result
    // }

    getAllSyncDataTransactions();
  }, [ledgerId]);

  const handleSort = (column: keyof Transaction) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedTransactions = [...transactions]
    .filter((transaction) => {
      if (filter === "all") return true;
      if (filter === "income") return transaction.type === "income";
      if (filter === "expenses") return transaction.type === "expense";
      if (filter === "pending") return transaction.status === "pending";
      return true;
    })
    .sort((a, b) => {
      // if (sortColumn === "date") {
      //   return sortDirection === "asc"
      //     ? a?.date?.getTime() - b?.date.getTime()
      //     : b?.date?.getTime() - a?.date.getTime();
      // }

      if (sortColumn === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }

      const aValue = String(a[sortColumn]).toLowerCase();
      const bValue = String(b[sortColumn]).toLowerCase();

      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "cleared":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Cleared
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "reconciled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Reconciled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="h-[calc(100vh-20rem)] overflow-y-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[120px]">
                  Account Name
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  Type
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  Payee ID
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  Payee Type
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  Payee Name
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  Account Class
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead>
                  TRX Type
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
                <TableHead className="w-[100px]">Account ID</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(3)]?.map((eachItem, index) => {
                    return (
                      <TableRow key={"loading" + index}>
                        <TableCell className="font-medium">
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={100} height={15} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={10} height={20} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                : sortedTransactions?.length > 0
                ? sortedTransactions
                    ?.filter((eachItem) => {
                      if (!filter) {
                        return true;
                      } else {
                        return filter === eachItem?.type;
                      }
                    })
                    ?.map((transaction, index) => (
                      <TableRow key={(transaction?.payee_id || transaction.id) + index}>
                        <TableCell className="font-medium">
                          {transaction?.account_name}
                        </TableCell>
                        <TableCell>{transaction?.type}</TableCell>
                        <TableCell>{transaction?.payee_id}</TableCell>
                        <TableCell>
                          {transaction?.payee_type}
                          {/* <div className="flex items-center justify-end">
                      {transaction.type === "income" ? (
                        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </div> */}
                        </TableCell>
                        <TableCell>{transaction?.payee_name}</TableCell>
                        <TableCell>{transaction?.account_class}</TableCell>
                        <TableCell>{transaction?.trx_type}</TableCell>
                        <TableCell>
                          {transaction?.account_id}
                          {/* {getStatusBadge(transaction.status)} */}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {/* <DropdownMenuItem>Categorize</DropdownMenuItem>
                            <DropdownMenuItem>Split</DropdownMenuItem>
                            <DropdownMenuItem>Flag for review</DropdownMenuItem> */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                : ""}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
