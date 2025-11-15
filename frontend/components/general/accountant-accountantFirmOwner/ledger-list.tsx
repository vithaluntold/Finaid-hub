"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronRight,
  FileText,
  Calendar,
  Hash,
  Clock,
  RefreshCw,
} from "lucide-react";
import TransactionTable from "@/components/general/accountant-accountantFirmOwner/transaction-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import moment from "moment";
import { useToast } from "@/hooks/use-toast";

type Ledger = {
  id: string;
  name: string;
  period: string;
  transactionCount: number;
  lastUpdated: Date;
  status: "success" | "error" | "pending";
  updated_at?: string;
  [key: string]: any;
};

interface LedgerListProps {
  clientID: string;
  setSelectedAction: (action: string) => void;
  setSelectedRun: (run: Ledger) => void;
}

export default function LedgerList({
  clientID,
  setSelectedAction,
  setSelectedRun,
}: LedgerListProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [allRuns, setAllRuns] = useState<Ledger[]>([]);

  const handleLedgerSelect = (ledger: Ledger) => {
    setSelectedAction("eachRun");
    setSelectedRun(ledger);
  };

  const getStatusBadge = (status: Ledger["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Success
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-400 text-red-700 border-red-500"
          >
            Failed
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
      default:
        return null;
    }
  };

  // functions

  async function getAllRuns() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/ai-agent/runs`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
          params: {
            company_id: clientID
          }
        }
      );

      if (response?.data?.success && response?.data?.data?.length > 0) {
        setAllRuns(response?.data?.data);
      } else {
        setAllRuns([]);
      }

      setIsLoading(false);
      console.log(response, "Get all runs response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Get all runs error");
    }
  }

  async function reloadSpecificRun(run_id: string) {
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/ai-agent/run/${run_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );
      setIsReload((prev) => !prev);
      if (response?.data?.success) {
        showToast({
          title: "Successfully reloaded!",
          description: response?.data?.message,
        });
      } else {
        showToast({
          title: "",
          description: response?.data?.message,
        });
      }
      console.log(response, "Is reload response");
    } catch (error: any) {
      showToast({
        title: "Error",
        description: "Unable to reload!",
      });
      console.log(error?.message, "Is reload error");
    }
  }

  // renderings

  useEffect(() => {
    getAllRuns();
  }, [isReload]);

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-4 pr-4">
        {isLoading
          ? [...Array(4)]?.map((_, index) => {
              return (
                <Card
                  key={"ledgerLoading" + index}
                  className="hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">
                            <Skeleton height={20} width={140} />
                          </h3>
                          <span>
                            <Skeleton height={15} width={50} />
                          </span>
                        </div>
                        <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Skeleton height={15} width={100} />
                          </div>
                          <div className="flex items-center justify-center">
                            <Skeleton height={15} width={100} />
                          </div>
                          <div className="flex items-center">
                            <Skeleton height={15} width={100} />
                          </div>
                        </div>
                      </div>
                      <Skeleton height={10} width={30} />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          : allRuns?.length > 0
          ? allRuns
              .sort((a, b) => new Date(b?.updated_at || 0).getTime() - new Date(a?.updated_at || 0).getTime())
              ?.map((ledger) => (
                <EachCard
                  ledger={ledger}
                  handleLedgerSelect={handleLedgerSelect}
                  getStatusBadge={getStatusBadge}
                  reloadSpecificRun={reloadSpecificRun}
                />
              ))
          : "No Runs Found!"}
      </div>
    </ScrollArea>
  );
}

interface EachCardProps {
  ledger: Ledger;
  handleLedgerSelect: (ledger: Ledger) => void;
  getStatusBadge: (status: Ledger["status"]) => JSX.Element | null;
  reloadSpecificRun: (run_id: string) => void;
}

const EachCard = ({
  ledger,
  handleLedgerSelect,
  getStatusBadge,
  reloadSpecificRun,
}: EachCardProps) => {
  const [isRetry, setIsRetry] = useState(false);

  return (
    <Card
      key={ledger?._id}
      className={`${
        (ledger?.status === "success" || ledger?.status === "pending") &&
        "hover:bg-accent/50"
      } cursor-pointer transition-colors`}
      onClick={() => {
        if (ledger?.status === "success") {
          handleLedgerSelect(ledger);
        }
      }}
    >
      <CardContent
        className={`p-4 ${
          ledger?.status === "error" && "opacity-60 cursor-not-allowed"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1 justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">
                  {ledger?.uploaded_file_name
                    ? ledger?.uploaded_file_name
                    : ledger?.run_id}
                </h3>
                {getStatusBadge(ledger?.status)}
              </div>
              {ledger?.status === "pending" && (
                <div>
                  <Button
                    className={`p-2 py-1 mb-2 ${
                      isRetry && "pointer-events-none opacity-40"
                    }`}
                    variant="default"
                    onClick={async () => {
                      setIsRetry(true);
                      await reloadSpecificRun(ledger?.run_id);
                      setIsRetry(false);
                    }}
                  >
                    <RefreshCw
                      className={`h-3 w-3 ${isRetry && "animate-spin"}`}
                    />
                    {isRetry ? "Loading..." : "Reload Run"}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {ledger?.start_date &&
                  moment(ledger?.start_date).format("MMMM Do YYYY")}
                {" - "}
                {ledger?.end_date &&
                  moment(ledger?.end_date).format("MMMM Do YYYY")}
              </div>
              <div className="flex items-center justify-center">
                <Hash className="h-2 w-2 mr-1" />
                {ledger?.total_transactions
                  ? ledger?.total_transactions
                  : 0}{" "}
                transactions
              </div>
              <div className="flex items-center justify-end pr-4">
                <Clock className="h-4 w-4 mr-2" />
                <div>
                  <div>
                    Updated {moment(ledger?.updated_at).format("MMMM Do YYYY")}{" "}
                  </div>
                  <div>{moment(ledger?.updated_at).format("h:mm:ss a")}</div>
                </div>
              </div>
            </div>
          </div>
          {/* <ChevronRight className="h-5 w-5 text-muted-foreground" /> */}
        </div>
      </CardContent>
    </Card>
  );
};
