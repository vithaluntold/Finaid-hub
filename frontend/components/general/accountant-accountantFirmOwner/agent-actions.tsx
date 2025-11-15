"use client";

import { Button } from "@/components/ui/button";
import {
  FileSpreadsheet,
  Receipt,
  Calculator,
  PieChart,
  FileText,
  AlertCircle,
  RefreshCw,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { SpinnerLoading } from "@/components/ui/spinner/spinner";
import { TiTick } from "react-icons/ti";
import DatePickerInput from "@/components/ui/date-picker";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

// TypeScript Interfaces
interface AgentActionsProps {
  clientID: string;
  setSelectedAction: (action: string) => void;
}

interface SyncDateType {
  client_company_id?: string;
  from_date?: string;
  to_date?: string;
  [key: string]: any;
}

export default function AgentActions({ clientID, setSelectedAction }: AgentActionsProps) {
  const { showToast } = useToast();
  const [syncLoading, setSyncLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [synced, setSynced] = useState(false);
  const [syncDate, setSyncDate] = useState<SyncDateType>({});

  const handleAction = (action: string) => {
    console.log(`Performing action: ${action}`);
    // In a real app, this would trigger the AI agent to perform the action
  };

  // functions

  async function initiateSyncData() {
    setSelectedAction("");
    syncDate.client_company_id = clientID;
    // console.log(syncDate, "syncDate");
    setSyncLoading(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/ai-agent/vector/create`,
        syncDate,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.success) {
        showToast({
          title: "Synced successfully!",
          description: "",
        });
        setSynced(true);
      } else {
        showToast({
          title: "Unable to sync data!",
          description: "",
        });
      }
      setSyncLoading(false);
      console.log("Sync loading successful:", response);
    } catch (error: any) {
      setSyncLoading(false);
      console.log(error?.message, "Initiate sync data error");
    }
  }

  async function deleteSyncData() {
    setSelectedAction("");

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
        showToast({
          title: response?.data?.message,
          description: "",
        });
      } else {
        showToast({
          title: "Unable to delete sync data!",
          description: "",
        });
      }
      setIsLoading(false);
      console.log(response, "Delete all clients response");
    } catch (error: any) {
      setIsLoading(false);
      console.log(error?.message, "Delete all clients error");
    }
  }

  return (
    <div className="space-y-2">
      <div
        className={`border rounded-md p-2 ${
          synced
            ? "pointer-events-none"
            : syncLoading && "pointer-events-none opacity-50"
        }`}
      >
        <div
          className={`flex gap-2 items-center my-2 max-lg1425:flex-col ${
            synced && "opacity-50"
          }`}
        >
          <DatePickerInput
            state={syncDate}
            setState={setSyncDate}
            name="from_date"
            format="Y-m-d"
            placeholder="From Date"
          />
          <DatePickerInput
            state={syncDate}
            setState={setSyncDate}
            name="to_date"
            format="Y-m-d"
            placeholder="To Date"
          />
        </div>
        <Button
          variant="outline"
          disabled={syncLoading}
          className={`w-full justify-between ${
            synced ? "text-white bg-primary" : ""
          } ${
            syncDate?.to_date && syncDate?.from_date
              ? ""
              : "pointer-events-none opacity-40"
          }`}
          onClick={initiateSyncData}
        >
          <span className="flex items-center gap-2">
            <RefreshCw
              className={`mr-2 h-4 w-4 ${syncLoading ? "animate-spin" : ""}`}
            />
            {synced ? "Synced Successfully!" : "Initiate Sync Data"}
          </span>
          {syncLoading ? <SpinnerLoading /> : synced ? <TiTick /> : ""}
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={deleteSyncData}
      >
        {isLoading ? (
          <RefreshCw className={`mr-2 h-4 w-4 animate-spin`} />
        ) : (
          <Trash className="mr-2 h-4 w-4" />
        )}
        Delete Sync Data
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => setSelectedAction("syncData")}
      >
        <Receipt className="mr-2 h-4 w-4" />
        Get Synced Data
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => setSelectedAction("runQuincy")}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Run Quincy
      </Button>

      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => setSelectedAction("allRuns")}
      >
        <Calculator className="mr-2 h-4 w-4" />
        Get All Runs
      </Button>
    </div>
  );
}
