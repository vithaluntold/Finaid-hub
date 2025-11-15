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
import {
  ArrowUpDown,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Download,
  UploadCloud,
  LoaderCircle,
  Expand,
  Minimize,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { backendBaseURL, headerList } from "@/assets/constants/constant";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { downloadCSVWithJSON } from "@/assets/functions/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

type Transaction = {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  status: "cleared" | "pending" | "reconciled";
};

type TransactionTableProps = {
  filter: "all" | "income" | "expenses" | "pending";
  ledgerId: string;
  clientID: string;
  setSelectedAction: (action: string) => void;
  selectedRun: any;
};

export default function EachRunTransactionTable({
  clientID,
  filter,
  ledgerId,
  setSelectedAction,
  selectedRun: selectedLedger,
}: TransactionTableProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPushingQb, setIsPushingQb] = useState(false);
  // const [selectedLedger, setSelectedLedger] = useState({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsEditable, setTransactionsEditable] = useState<
    Transaction[]
  >([]);
  const [failedTransactionsList, setFailedTransactionsList] = useState([]);
  const [sortColumn, setSortColumn] = useState<keyof Transaction>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [pushedQB, setPushedQB] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // functions

  async function getAllOutputSingleRun() {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "get",
        url: `${backendBaseURL}/api/v1/ai-agent/run/${selectedLedger?.run_id}`,
        headers: {
          Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.success) {
        if (response?.data?.data?.output?.length < 1) {
          setTransactions([]);
          setTransactionsEditable([]);
          // showToast({
          //   title: "Fetch Successful!",
          //   description: "No sync found!",
          // });
        } else {
          let failedTransactions = response?.data?.data?.output
            .filter((item: any) => !item.completed)
            .map(
              ({
                type,
                date,
                transaction_description,
                amount,
                vector_found,
                completed,
                message,
              }: any) => ({
                date,
                transaction_description,
                type,
                amount,
                comment: message,
                create_vendor: "",
                create_customer: "",
                payee_name: "",
              })
            );
          setTransactions(response?.data?.data?.output);
          setTransactionsEditable(response?.data?.data?.output);
          setFailedTransactionsList(failedTransactions);
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
        setTransactionsEditable([]);
      }
      setIsLoading(false);
      console.log(response, "get all runs output for single run response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "get all runs output for single run error");
    }
  }

  async function pushToQuickbooks() {
    let payload = {
      client_company_id: selectedLedger?.client_company_id,
      accountant_id: selectedLedger?.accountant_id,
      run_id: selectedLedger?.run_id,
      data: transactions,
    };
    // console.log(transactions, "transactions final");
    // console.log(selectedLedger, "selectedLedger");
    // console.log(clientID, "clientID");
    // setIsLoading(true);
    setIsPushingQb(true);

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/post-agent/quickbooks`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response?.data?.status === "success" ||
        response?.data?.data?.length > 0
      ) {
        showToast({
          title: "Successfully Pushed!",
          description: response?.data?.message,
        });
        setSelectedAction("allRuns");
        setPushedQB(true);
      } else {
        showToast({
          title: "Error While trying to push to quickbooks!",
          description: response?.data?.message,
        });
      }
      // setIsLoading(false);
      setIsPushingQb(false);
      console.log("Push to Quickbooks Response", response);
    } catch (error: any) {
      // setIsLoading(false);
      setIsPushingQb(false);
      showToast({
        title: "Error While trying to push to quickbooks!",
        description: "",
      });
      console.log(error?.message, "Push to Quickbooks Response error");
    }
  }

  // renderings

  useEffect(() => {
    if (selectedLedger?.run_id) {
      getAllOutputSingleRun();
    }
  }, [selectedLedger]);

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
    <div>
      <Tabs defaultValue="all" className="w-full p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedAction("allRuns")}
              className="mb-2"
            >
              ← Back to Ledgers
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="mb-2"
            >
              {isExpanded ? <Minimize /> : <Expand />}
            </Button>

            {getStatusBadge(selectedLedger?.status)}
          </div>

          <div className="flex items-center justify-between gap-2 max-lg1425:flex-col mb-2">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="debit">Debit</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
            </TabsList>
            <div
              className={`flex gap-2 ${
                isLoading && "pointer-events-none opacity-30"
              }`}
            >
              {failedTransactionsList?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => downloadCSVWithJSON(failedTransactionsList)}
                >
                  <Download />
                  Exception Report
                </Button>
              )}
              {!(selectedLedger?.synced_to_quickbooks || pushedQB) && (
                <Button variant="default" onClick={pushToQuickbooks}>
                  <UploadCloud className="w-5 h-5" />
                  Push to Quickbooks
                </Button>
              )}
            </div>
          </div>
          {/* <TabsContent value="all" className="mt-0">
            <TransactionTable filter="all" ledgerId={selectedLedger.id} />
          </TabsContent>
          <TabsContent value="income" className="mt-0">
            <TransactionTable filter="income" ledgerId={selectedLedger.id} />
          </TabsContent>
          <TabsContent value="expenses" className="mt-0">
            <TransactionTable filter="expenses" ledgerId={selectedLedger.id} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <TransactionTable filter="pending" ledgerId={selectedLedger.id} />
          </TabsContent> */}
        </div>
        <div className="h-[calc(100vh-20rem)] overflow-y-auto">
          <div className="min-w-[1000px] mt-4">
            <TabsContent value="all" className="mt-0">
              {!isExpanded && (
                <RunsTransactionsTable
                  filter="all"
                  isLoading={isLoading}
                  sortedTransactions={sortedTransactions}
                  transactionsEditable={transactionsEditable}
                  setTransactions={setTransactions}
                  clientID={clientID}
                  isPushingQb={isPushingQb}
                  pushedQB={pushedQB}
                  selectedLedger={selectedLedger}
                />
              )}
              <DiaglogTable
                filterType="all"
                selectedLedger={selectedLedger}
                isLoading={isLoading}
                sortedTransactions={sortedTransactions}
                transactionsEditable={transactionsEditable}
                setTransactions={setTransactions}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                pushedQB={pushedQB}
                pushToQuickbooks={pushToQuickbooks}
                clientID={clientID}
                isPushingQb={isPushingQb}
              />
            </TabsContent>
            <TabsContent value="debit" className="mt-0">
              {!isExpanded && (
                <RunsTransactionsTable
                  filter="debit"
                  isLoading={isLoading}
                  sortedTransactions={sortedTransactions}
                  transactionsEditable={transactionsEditable}
                  setTransactions={setTransactions}
                  clientID={clientID}
                  isPushingQb={isPushingQb}
                  pushedQB={pushedQB}
                  selectedLedger={selectedLedger}
                />
              )}
              <DiaglogTable
                filterType="debit"
                selectedLedger={selectedLedger}
                isLoading={isLoading}
                sortedTransactions={sortedTransactions}
                transactionsEditable={transactionsEditable}
                setTransactions={setTransactions}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                pushedQB={pushedQB}
                pushToQuickbooks={pushToQuickbooks}
                clientID={clientID}
                isPushingQb={isPushingQb}
              />
            </TabsContent>
            <TabsContent value="credit" className="mt-0">
              {!isExpanded && (
                <RunsTransactionsTable
                  filter="credit"
                  isLoading={isLoading}
                  sortedTransactions={sortedTransactions}
                  transactionsEditable={transactionsEditable}
                  setTransactions={setTransactions}
                  clientID={clientID}
                  isPushingQb={isPushingQb}
                  pushedQB={pushedQB}
                  selectedLedger={selectedLedger}
                />
              )}
              <DiaglogTable
                filterType="credit"
                selectedLedger={selectedLedger}
                isLoading={isLoading}
                sortedTransactions={sortedTransactions}
                transactionsEditable={transactionsEditable}
                setTransactions={setTransactions}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                pushedQB={pushedQB}
                pushToQuickbooks={pushToQuickbooks}
                clientID={clientID}
                isPushingQb={isPushingQb}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
      {/* {isPushingQb && (
        <div className="absolute top-0 left-0 bg-gray-300 opacity-50 z-10 w-full h-full">
          <LoaderCircle className="h-20 w-20 absolute top-1/3 left-2/4 animate-spin" />
        </div>
      )} */}
    </div>
  );
}

const DiaglogTable = ({
  filterType,
  selectedLedger,
  isLoading,
  sortedTransactions,
  transactionsEditable,
  setTransactions,
  isExpanded,
  setIsExpanded,
  pushedQB,
  pushToQuickbooks,
  clientID,
  isPushingQb,
}: any) => {
  return (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-none overflow-auto p-6">
        <div className="flex flex-col h-full space-y-4">
          <DialogHeader>
            <DialogTitle>All Transactions History</DialogTitle>
            <DialogDescription>
              Detailed information about the transaction history
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            {!(selectedLedger?.synced_to_quickbooks || pushedQB) && (
              <Button variant="default" onClick={pushToQuickbooks}>
                <UploadCloud className="w-5 h-5" />
                Push to Quickbooks
              </Button>
            )}
          </div>
          <RunsTransactionsTable
            filter={filterType}
            ledgerId={selectedLedger?.id}
            isLoading={isLoading}
            sortedTransactions={sortedTransactions}
            transactionsEditable={transactionsEditable}
            setTransactions={setTransactions}
            clientID={clientID}
            isPushingQb={isPushingQb}
            selectedLedger={selectedLedger}
            pushedQB={pushedQB}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

const RunsTransactionsTable = ({
  filter,
  isLoading,
  sortedTransactions,
  transactionsEditable,
  setTransactions,
  clientID,
  isPushingQb,
  pushedQB,
  selectedLedger,
}: any) => {
  const [transactionListResponse, setTransactionListResponse] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [allPayee, setAllPayee] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);
  const [allBills, setAllBills] = useState([]);

  async function fetchPayee() {
    setIsLoadingLocal(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/quickbooks/unified/payees`,
        {
          client_company_id: clientID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status && response?.data?.data?.length > 0) {
        setAllPayee(response?.data?.data);
      } else {
        setAllPayee([]);
      }
      setIsLoadingLocal(false);

      console.log("get all payee", response);
    } catch (error) {
      setAllPayee([]);
      setIsLoadingLocal(false);
      console.log("get all payee error", error);
    }
  }

  async function fetchCategories() {
    setIsLoadingLocal(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/quickbooks/unified/categories`,
        {
          client_company_id: clientID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status && response?.data?.data?.length > 0) {
        setAllCategories(response?.data?.data);
      } else {
        setAllCategories([]);
      }
      setIsLoadingLocal(false);

      console.log("get all categories", response);
    } catch (error) {
      setAllCategories([]);
      setIsLoadingLocal(false);
      console.log("get all categories error", error);
    }
  }

  async function fetchInvoices() {
    setIsLoadingLocal(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/quickbooks/unified/invoices`,
        {
          client_company_id: clientID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status && response?.data?.data?.length > 0) {
        setAllInvoices(response?.data?.data);
      } else {
        setAllInvoices([]);
      }
      setIsLoadingLocal(false);

      console.log("get all invoices", response);
    } catch (error) {
      setAllInvoices([]);
      setIsLoadingLocal(false);
      console.log("get all invoices error", error);
    }
  }

  async function fetchBills() {
    setIsLoadingLocal(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/quickbooks/unified/bills`,
        {
          client_company_id: clientID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response?.data?.status && response?.data?.data?.length > 0) {
        setAllBills(response?.data?.data);
      } else {
        setAllBills([]);
      }
      setIsLoadingLocal(false);

      console.log("get all bills", response);
    } catch (error) {
      setAllBills([]);
      setIsLoadingLocal(false);
      console.log("get all bills error", error);
    }
  }

  useEffect(() => {
    fetchPayee();
    fetchCategories();
    fetchInvoices();
    fetchBills();
  }, []);

  // console.log(sortedTransactions, "sortedTransactions");
  return (
    <>
      {isPushingQb && (
        <div className="absolute top-0 left-0 bg-gray-300 opacity-50 z-10 w-full h-full">
          <LoaderCircle className="h-20 w-20 absolute top-1/3 left-2/4 animate-spin" />
        </div>
      )}
      <Table>
        <TableHeader
          className={`sticky top-0 ${isPushingQb ? "" : "bg-background"} z-10`}
        >
          <TableRow>
            {headerList?.map((eachItem, index) => {
              return (
                <TableHead
                  key={eachItem?.keyId}
                  className={`${
                    eachItem?.width ? eachItem?.width : "w-[220px]"
                  } p-2`}
                >
                  {eachItem?.name}
                  {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                </TableHead>
              );
            })}
            {transactionListResponse?.length > 0 && (
              <TableHead className="w-[120px]">Transaction Status</TableHead>
            )}
            {/* <TableHead className="w-[100px]">Account ID</TableHead> */}
            {/* <TableHead className="w-[50px]"></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? [...Array(3)]?.map((eachItem, index) => {
                return (
                  <TableRow key={"loading" + index}>
                    <TableCell className="font-medium">
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={65} height={15} />
                    </TableCell>
                    {/* <TableCell>
                    <Skeleton width={10} height={20} />
                  </TableCell> */}
                  </TableRow>
                );
              })
            : sortedTransactions?.length > 0
            ? sortedTransactions
                ?.filter((eachItem: any) => {
                  if (filter === "debit") {
                    return eachItem?.type?.toLowerCase() === "debit";
                  } else if (filter === "credit") {
                    return eachItem?.type?.toLowerCase() === "credit";
                  } else {
                    return eachItem;
                  }
                })
                ?.map((transaction: any, index: any) => {
                  return (
                    <EachTransactionRow
                      key={transaction._id || index}
                      transaction={transaction}
                      transactionsEditable={transactionsEditable}
                      setTransactions={setTransactions}
                      index={index}
                      transactionListResponse={transactionListResponse}
                      allPayee={allPayee}
                      allCategories={allCategories}
                      allInvoices={allInvoices}
                      allBills={allBills}
                      selectedLedger={selectedLedger}
                      pushedQB={pushedQB}
                    />
                  );
                })
            : ""}
        </TableBody>
      </Table>
    </>
  );
};

const EachTransactionRow = ({
  transaction,
  index,
  transactionListResponse,
  transactionsEditable,
  setTransactions,
  allPayee,
  allCategories,
  allInvoices,
  allBills,
  pushedQB,
  selectedLedger,
}: any) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("categorize");
  const [updatedValue, setUpdatedValue] = useState({});

  const handleMethodChange = (value: any) => {
    setSelectedMethod(value);
  };

  const payeeType = transaction?.payee?.type?.toLowerCase();

  const conditionalType =
    payeeType === "vendor" && transaction?.type?.toLowerCase() === "credit"
      ? ["VENDOR_CREDIT"] // array of vendor types
      : payeeType === "customer" && transaction?.type?.toLowerCase() === "debit"
      ? ["REFUND_RECEIPT"] // array of vendor types
      : payeeType === "vendor"
      ? ["BILL_ADVANCE", "PURCHASE", "BILL_PAYMENT"] // array of vendor types
      : payeeType === "customer"
      ? ["INVOICE_PAYMENT", "SALES_RECEIPT", "INVOICE_ADVANCE"] // array of customer types
      : [];

  return (
    <>
      <TableRow
        key={transaction?.id + index}
        onClick={() => setIsSettingsOpen((prev) => !prev)}
      >
        <TableCell className="font-medium">
          {transaction?.type ? transaction?.type : "-"}
        </TableCell>
        <TableCell>{transaction?.date ? transaction?.date : "-"}</TableCell>
        <TableCell>
          {transaction?.transaction_description
            ? transaction?.transaction_description
            : "-"}
        </TableCell>
        <TableCell className="text-left">
          {transaction?.category_name ? transaction?.category_name : "-"}
        </TableCell>
        <TableCell className="text-left">
          {transaction?.payee?.name ? transaction?.payee?.name : "-"}
        </TableCell>
        <TableCell className="text-left">
          {transaction?.receipt?.type ? transaction?.receipt?.type : "-"}
        </TableCell>
        <TableCell className="text-left">
          {transaction?.amount ? transaction?.amount : "-"}
        </TableCell>
        <TableCell>
          {transaction?.message ? transaction?.message : ""}
        </TableCell>
        <TableCell>
          {transaction?.parsed_description
            ? transaction?.parsed_description
            : ""}
        </TableCell>
        <TableCell>
          {transaction?.parsed_type ? transaction?.parsed_type : ""}
        </TableCell>
        <TableCell>
          {transaction?.vector_found_desc
            ? transaction?.vector_found_desc?.toString()
            : "-" + "," + transaction?.vector_found_payee
            ? transaction?.vector_found_payee?.toString()
            : ""}
        </TableCell>
        {transactionListResponse?.length > 0 && (
          <TableCell>
            {transaction?.responseStatus ? transaction?.responseStatus : "-"}
          </TableCell>
        )}
      </TableRow>

      {/* Expandable content row */}
      {isSettingsOpen && (
        <TableRow className="bg-slate-200 hover:bg-slate-200">
          <TableCell colSpan={11} className="py-6 px-2">
            {/* <div className="w-[800px] px-4">
              <RadioGroup
                value={selectedMethod}
                onValueChange={handleMethodChange}
                className="w-full grid grid-cols-1 md:grid-cols-4 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="categorize"
                    id={"Categorize" + transaction?.id + index}
                  />
                  <Label htmlFor={"Categorize" + transaction?.id + index}>
                    Categorize
                  </Label>
                </div>
                <div className="flex items-center space-x-2 pointer-events-none opacity-60">
                  <RadioGroupItem
                    value="match"
                    id={"Match" + transaction?.id + index}
                  />
                  <Label htmlFor={"Match" + transaction?.id + index}>
                    Match
                  </Label>
                </div>
                <div className="flex items-center space-x-2 pointer-events-none opacity-60">
                  <RadioGroupItem
                    value="transfer"
                    id={"Record-ad-transfer" + transaction?.id + index}
                  />
                  <Label
                    htmlFor={"Record-ad-transfer" + transaction?.id + index}
                  >
                    Record ad transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2 pointer-events-none opacity-60">
                  <RadioGroupItem
                    value="creditCardPayment"
                    id={
                      "Record-as-credit-card-payment" + transaction?.id + index
                    }
                  />
                  <Label
                    htmlFor={
                      "Record-as-credit-card-payment" + transaction?.id + index
                    }
                  >
                    Record as credit card payment
                  </Label>
                </div>
              </RadioGroup>
            </div> */}
            {selectedMethod === "categorize" && (
              <div className="mt-2 ml-4">
                <div className="flex gap-8">
                  <Label htmlFor={"payee" + index}>
                    <div className="mb-2">Select Payee</div>
                    <Select
                      // value={updatedValue?.payee}
                      onValueChange={(value: any) => {
                        setUpdatedValue((prev: any) => {
                          return { ...prev, payee: value?.payee_name };
                        });

                        let editTransactionID = transaction?.id;
                        // console.log(value, "editable value", transaction);

                        /* all conditions */
                        let condition1 =
                          transaction?.type?.toLowerCase() === "credit" &&
                          value?.payee_type?.toLowerCase() === "vendor";
                        let condition2 =
                          transaction?.type?.toLowerCase() === "debit" &&
                          value?.payee_type?.toLowerCase() === "customer";

                        setTransactions((prevTransactions: any) =>
                          prevTransactions?.map((transactionEditable: any) =>
                            transactionEditable?.id === editTransactionID
                              ? {
                                  ...transactionEditable,
                                  // Update the field(s) you want, for example:
                                  payee: {
                                    id: value?.payee_id,
                                    type: value?.payee_type,
                                    name: value?.payee_name,
                                  },
                                  receipt: {
                                    document_ids: [],
                                    receipt_ids: [],
                                    type: condition1
                                      ? "VENDOR_CREDIT"
                                      : condition2
                                      ? "REFUND_RECEIPT"
                                      : "",
                                  },
                                }
                              : transactionEditable
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Payee" />
                      </SelectTrigger>
                      <SelectContent>
                        {allPayee?.map((eachPayee: any, index: any) => {
                          return (
                            <SelectItem
                              key={eachPayee?.payee_id + index}
                              value={eachPayee}
                            >
                              {eachPayee?.payee_name +
                                ` (${eachPayee?.payee_type})`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Label>
                  <Label htmlFor={"type" + index}>
                    <div className="mb-2">Select Type</div>
                    <Select
                      value={transaction?.receipt?.type || ""}
                      onValueChange={(value: any) => {
                        setUpdatedValue((prev: any) => {
                          return { ...prev, type: value };
                        });

                        let editTransactionID = transaction?.id;
                        // console.log(value, "edit type", transaction);

                        setTransactions((prevTransactions: any) =>
                          prevTransactions?.map((transactionEditable: any) =>
                            transactionEditable?.id === editTransactionID
                              ? {
                                  ...transactionEditable,
                                  receipt: {
                                    document_ids: [],
                                    receipt_ids: [],
                                    type: value,
                                  },
                                }
                              : transactionEditable
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionalType?.map((eachType, index) => {
                          return (
                            <SelectItem key={eachType + index} value={eachType}>
                              {eachType}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </Label>
                  {transaction?.receipt?.type === "PURCHASE" && (
                    <Label htmlFor={"category" + index}>
                      <div className="mb-2">Select Category</div>
                      <Select
                        // value={updatedValue?.payee}
                        onValueChange={(value: any) => {
                          setUpdatedValue((prev: any) => {
                            return { ...prev, category: value?.account_name };
                          });

                          let editTransactionID = transaction?.id;
                          console.log(value, "editable value");
                          console.log(
                            transactionsEditable,
                            "editable transactions"
                          );

                          setTransactions((prevTransactions: any) =>
                            prevTransactions?.map((transactionEditable: any) =>
                              transactionEditable?.id === editTransactionID
                                ? {
                                    ...transactionEditable,
                                    // Update the field(s) you want, for example:
                                    category_name: value?.account_name,
                                    category_id: value?.account_id,
                                  }
                                : transactionEditable
                            )
                          );
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {allCategories
                            ?.filter((eachItem: any) => {
                              const transactionType =
                                transaction?.type?.toLowerCase();
                              const accountClass =
                                eachItem?.account_class?.toLowerCase();

                              if (
                                transactionType === "debit" &&
                                accountClass === "expense"
                              ) {
                                return true;
                              }

                              if (
                                transactionType === "credit" &&
                                accountClass === "revenue"
                              ) {
                                return true;
                              }

                              return false;
                            })
                            ?.map((eachCategory: any, index: any) => {
                              return (
                                <SelectItem
                                  key={eachCategory?.payee_id + index}
                                  value={eachCategory}
                                >
                                  {eachCategory?.account_name +
                                    `(${eachCategory?.account_id})`}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </Label>
                  )}
                  {transaction?.receipt?.type === "BILL_PAYMENT" && (
                    <div className="space-y-2 flex flex-col">
                      <Label>Select Bills</Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-[250px] justify-between"
                          >
                            {transaction?.receipt?.receipt_ids?.length > 0
                              ? `${transaction?.receipt?.receipt_ids?.length} selected`
                              : "Select bills"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto p-2">
                          {allBills
                            ?.filter(
                              (eachItem: any) =>
                                transaction?.payee?.id === eachItem?.payee_id
                            )
                            ?.map((eachBill: any) => {
                              const isChecked =
                                transaction?.receipt?.receipt_ids?.includes(
                                  eachBill.id
                                );

                              return (
                                <div
                                  key={eachBill.id}
                                  className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded-sm"
                                >
                                  <Checkbox
                                    id={`checkbox-${eachBill.id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const editTransactionID = transaction?.id;

                                      setTransactions((prevTransactions: any) =>
                                        prevTransactions.map(
                                          (transactionEditable: any) => {
                                            if (
                                              transactionEditable?.id !==
                                              editTransactionID
                                            )
                                              return transactionEditable;

                                            const {
                                              receipt_ids = [],
                                              document_ids = [],
                                            } =
                                              transactionEditable?.receipt ||
                                              {};

                                            let newReceiptIds = [
                                              ...receipt_ids,
                                            ];
                                            let newDocumentIds = [
                                              ...document_ids,
                                            ];

                                            const index = receipt_ids.findIndex(
                                              (id: any) => id === eachBill.id
                                            );

                                            if (checked) {
                                              if (index === -1) {
                                                newReceiptIds.push(eachBill.id);
                                                newDocumentIds.push(
                                                  eachBill.id_document || ""
                                                );
                                              }
                                            } else {
                                              if (index !== -1) {
                                                newReceiptIds.splice(index, 1);
                                                newDocumentIds.splice(index, 1);
                                              }
                                            }

                                            return {
                                              ...transactionEditable,
                                              receipt: {
                                                ...transactionEditable.receipt,
                                                receipt_ids: newReceiptIds,
                                                document_ids: newDocumentIds,
                                              },
                                            };
                                          }
                                        )
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={`checkbox-${eachBill.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {eachBill.id} ({eachBill.id_document || "-"}
                                    )
                                  </label>
                                </div>
                              );
                            })}
                        </PopoverContent>
                      </Popover>

                      {/* Display selected IDs */}
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <div>
                          <strong>Receipt IDs:</strong>{" "}
                          {(transaction?.receipt?.receipt_ids || []).join(
                            ", "
                          ) || "-"}
                        </div>
                        <div>
                          <strong>Document IDs:</strong>{" "}
                          {(transaction?.receipt?.document_ids || []).join(
                            ", "
                          ) || "-"}
                        </div>
                      </div>
                    </div>
                  )}
                  {transaction?.receipt?.type === "INVOICE_PAYMENT" && (
                    <div className="space-y-2 flex flex-col">
                      <Label>Select Invoices</Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-[250px] justify-between"
                          >
                            {transaction?.receipt?.receipt_ids?.length > 0
                              ? `${transaction?.receipt?.receipt_ids?.length} selected`
                              : "Select invoices"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto p-2">
                          {allInvoices
                            ?.filter(
                              (eachItem: any) =>
                                transaction?.payee?.id === eachItem?.payee_id
                            )
                            ?.map((eachInvoice: any) => {
                              const isChecked =
                                transaction?.receipt?.receipt_ids?.includes(
                                  eachInvoice.id
                                );

                              return (
                                <div
                                  key={eachInvoice.id}
                                  className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded-sm"
                                >
                                  <Checkbox
                                    id={`checkbox-${eachInvoice.id}`}
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const editTransactionID = transaction?.id;

                                      setTransactions((prevTransactions: any) =>
                                        prevTransactions.map(
                                          (transactionEditable: any) => {
                                            if (
                                              transactionEditable?.id !==
                                              editTransactionID
                                            )
                                              return transactionEditable;

                                            const {
                                              receipt_ids = [],
                                              document_ids = [],
                                            } =
                                              transactionEditable?.receipt ||
                                              {};

                                            let newReceiptIds = [
                                              ...receipt_ids,
                                            ];
                                            let newDocumentIds = [
                                              ...document_ids,
                                            ];

                                            const index = receipt_ids.findIndex(
                                              (id: any) => id === eachInvoice.id
                                            );

                                            if (checked) {
                                              if (index === -1) {
                                                newReceiptIds.push(
                                                  eachInvoice.id
                                                );
                                                newDocumentIds.push(
                                                  eachInvoice.id_document || ""
                                                );
                                              }
                                            } else {
                                              if (index !== -1) {
                                                newReceiptIds.splice(index, 1);
                                                newDocumentIds.splice(index, 1);
                                              }
                                            }

                                            return {
                                              ...transactionEditable,
                                              receipt: {
                                                ...transactionEditable.receipt,
                                                receipt_ids: newReceiptIds,
                                                document_ids: newDocumentIds,
                                              },
                                            };
                                          }
                                        )
                                      );
                                    }}
                                  />
                                  <label
                                    htmlFor={`checkbox-${eachInvoice.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {eachInvoice.id} (
                                    {eachInvoice.id_document || "-"})
                                  </label>
                                </div>
                              );
                            })}
                        </PopoverContent>
                      </Popover>

                      {/* Display selected IDs */}
                      <div className="mt-2 text-sm text-muted-foreground space-y-1">
                        <div>
                          <strong>Receipt IDs:</strong>{" "}
                          {(transaction?.receipt?.receipt_ids || []).join(
                            ", "
                          ) || "-"}
                        </div>
                        <div>
                          <strong>Document IDs:</strong>{" "}
                          {(transaction?.receipt?.document_ids || []).join(
                            ", "
                          ) || "-"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
