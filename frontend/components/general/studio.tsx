"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LedgerList from "@/components/general/accountant-accountantFirmOwner/ledger-list";
import AgentActions from "@/components/general/accountant-accountantFirmOwner/agent-actions";
import ActivityLog from "@/components/general/accountant-accountantFirmOwner/activity-log";
import { useEffect, useState } from "react";
import SyncDataTable from "./accountant-accountantFirmOwner/sync-data-table";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import FinaidPredictor from "@/components/accountant/forms/finaid-predictor";
import ChatDrawer from "../chatdrawer";
import EachRunTransactionTable from "./accountant-accountantFirmOwner/transactions-run";
import { Button } from "../ui/button";
import { Expand, Minimize } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export default function StudioComponent({ clientId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const [clientDetailsWithProfile, setClientDetailsWithProfile] = useState({});
  const [finaidProfile, setFinaidProfile] = useState({});
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedRun, setSelectedRun] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");

  // functions

  async function getSingleClient() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/client-companies`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.length > 0) {
        let findClientCompany = response?.data?.filter(
          (eachClientCompany) => eachClientCompany?._id === clientId
        );
        if (findClientCompany?.length > 0) {
          setClientDetails(findClientCompany[0]);

          const findClientFromCompanies = await axios.get(
            `${backendBaseURL}/api/v1/clients`,
            {
              headers: {
                Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
              },
            }
          );

          let allClients = findClientFromCompanies?.data?.data;

          if (
            findClientFromCompanies?.data?.success &&
            allClients?.length > 0
          ) {
            let findClient = allClients?.filter(
              (eachCliet) => findClientCompany[0]?.client_id === eachCliet?._id
            );
            if (findClient?.length > 0) {
              setClientDetailsWithProfile(findClient[0]);

              let finaidProfileResponse = await await axios.get(
                `${backendBaseURL}/api/v1/finaid-profiles/filter?finaid_profile_id=${findClient[0]?.profile_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage?.getItem(
                      "accessToken"
                    )}`,
                  },
                }
              );

              if (finaidProfileResponse?.data?.data?.length > 0) {
                setFinaidProfile(finaidProfileResponse?.data?.data[0]);
              } else {
                setFinaidProfile({});
              }

              // console.log(finaidProfileResponse, "finaidProfile");
            }
            console.log(findClient, "find client single");
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error?.message, "Get single client from all clients error");
    }
  }

  // renderings

  useEffect(() => {
    getSingleClient();
  }, []);

  return (
    <div className="container px-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Agent Profile, Actions, and Log */}
        <div className="lg:col-span-1 space-y-6">
          {/* Agent Profile Card */}
          <Card>
            <CardHeader className="pb-5">
              <CardTitle>Agent Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={finaidProfile?.image} alt="AI Agent" />
                  <AvatarFallback>
                    {finaidProfile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold mr-2">
                      {isLoading ? (
                        <Skeleton width={100} height={15} />
                      ) : (
                        finaidProfile?.name
                      )}
                    </h3>
                    {/* <Badge className="bg-green-500">Online</Badge> */}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isLoading ? (
                      <div>
                        <Skeleton width={200} height={15} />
                        <Skeleton width={200} height={15} />
                        <Skeleton width={90} height={15} />
                      </div>
                    ) : finaidProfile?.desc ? (
                      finaidProfile?.desc
                    ) : (
                      ""
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentActions
                clientID={clientId}
                setSelectedAction={setSelectedAction}
              />
            </CardContent>
          </Card>

          {/* Activity Log */}
          {/* <Card className="">
            <CardHeader className="pb-3">
              <CardTitle>Ask Luca</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityLog />
            </CardContent>
          </Card> */}
        </div>

        {/* Right side - Ledger List */}
        <div className="lg:col-span-2">
          {selectedAction === "eachRun" ? (
            <Card className="h-[calc(100vh-8rem)] relative">
              <CardContent className="p-0">
                <EachRunTransactionTable
                  clientID={clientId}
                  setSelectedAction={setSelectedAction}
                  selectedRun={selectedRun}
                />
              </CardContent>
            </Card>
          ) : selectedAction === "allRuns" ? (
            <Card className="h-[calc(100vh-3.5rem)]">
              <CardHeader>
                <CardTitle>All Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <LedgerList
                  clientID={clientId}
                  setSelectedAction={setSelectedAction}
                  setSelectedRun={setSelectedRun}
                />
              </CardContent>
            </Card>
          ) : selectedAction === "runQuincy" ? (
            <Card className="h-[calc(100vh-3.5rem)] overflow-auto">
              <CardHeader>
                <CardTitle>Run Quincy</CardTitle>
              </CardHeader>
              <CardContent>
                <FinaidPredictor
                  clientID={clientId}
                  clientDetailsWithProfile={clientDetailsWithProfile}
                  setSelectedAction={setSelectedAction}
                />
              </CardContent>
            </Card>
          ) : selectedAction === "syncData" ? (
            <Card className="h-[calc(100vh-3.5rem)]">
              <CardHeader>
                <CardTitle>All Synced Documents</CardTitle>
              </CardHeader>
              <div className="flex items-center justify-between pl-2 pr-6">
                <Tabs defaultValue="all" className="w-max p-4">
                  <TabsList>
                    <TabsTrigger
                      value="all"
                      onClick={() => setSelectedFilter("")}
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="payee"
                      onClick={() => setSelectedFilter("payee")}
                    >
                      Payee
                    </TabsTrigger>
                    <TabsTrigger
                      value="transaction"
                      onClick={() => setSelectedFilter("transaction")}
                    >
                      Transaction
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  variant="outline"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="mb-2"
                >
                  {isExpanded ? <Minimize /> : <Expand />}
                </Button>
              </div>
              <CardContent>
                {!isExpanded && (
                  <SyncDataTable
                    clientID={clientId}
                    filter={selectedFilter}
                    ledgerId={""}
                  />
                )}
                <DiaglogTable
                  isExpanded={isExpanded}
                  setIsExpanded={setIsExpanded}
                  clientId={clientId}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-3.5rem)]">
              <CardHeader>
                <CardTitle>All Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <LedgerList
                  clientID={clientId}
                  setSelectedAction={setSelectedAction}
                  setSelectedRun={setSelectedRun}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <ChatDrawer />
    </div>
  );
}

const DiaglogTable = ({ isExpanded, setIsExpanded, clientId }) => {
  const [selectedFilter, setSelectedFilter] = useState("");

  return (
    <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-none overflow-auto p-6">
        <div className="flex flex-col h-full space-y-4">
          <DialogHeader>
            <DialogTitle>All Synced Documents</DialogTitle>
            <DialogDescription>
              Detailed information about the sync data
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="all" className="w-max">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setSelectedFilter("")}>
                All
              </TabsTrigger>
              <TabsTrigger
                value="payee"
                onClick={() => setSelectedFilter("payee")}
              >
                Payee
              </TabsTrigger>
              <TabsTrigger
                value="transaction"
                onClick={() => setSelectedFilter("transaction")}
              >
                Transaction
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <SyncDataTable
            clientID={clientId}
            filter={selectedFilter}
            ledgerId={""}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
