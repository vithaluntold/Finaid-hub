"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerInput from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { backendBaseURL } from "@/assets/constants/constant";

// TypeScript Interfaces
interface BankAccount {
  Id: string;
  Name: string;
  AccountType: string;
  [key: string]: any;
}

interface FinaidPredictorProps {
  clientID: string;
  clientDetailsWithProfile: {
    platform?: string;
    client_integration?: string;
    model?: string;
    [key: string]: any;
  };
  setSelectedAction: (action: string) => void;
}

interface FormDataType {
  input_date_start: string;
  input_date_end: string;
  input_date_dayfirst: boolean;
  input_bank_id: string;
  input_bank_name: string;
  input_bank_account_type: string;
  input_match_bill: boolean;
  input_match_invoice: boolean;
  input_match_payment_advise: boolean;
  input_match_check: boolean;
  input_match_history: boolean;
  client_company_id: string;
  platform?: string;
  integration?: string;
  model_identifier?: string;
  [key: string]: any;
}

export default function FinaidPredictor({
  clientID,
  clientDetailsWithProfile,
  setSelectedAction,
}: FinaidPredictorProps) {
  const { showToast } = useToast();
  const [bankData, setBankData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allBankAccounts, setAllBankAccounts] = useState<BankAccount[]>([]);
  const [selectedFinaid, setSelectedFinaid] = useState("");

  const [formData, setFormData] = useState<FormDataType>({
    input_date_start: "",
    input_date_end: "",
    input_date_dayfirst: false,
    input_bank_id: "",
    input_bank_name: "",
    input_bank_account_type: "",
    input_match_bill: false,
    input_match_invoice: false,
    input_match_payment_advise: false,
    input_match_check: false,
    input_match_history: false,
    client_company_id: "",
  });

  // useEffect(() => {
  //   // Fetch bank data from your endpoint
  //   fetch("/api/bank")
  //     .then((res) => res.json())
  //     .then((data) => setBankData(data));
  // }, []);

  const handleCheckboxToggle = (key: keyof typeof formData) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // const handleFinaidToggle = (finaidName: string) => {
  //   setFormData((prev) => {
  //     const alreadySelected = prev.selectedFinaids.includes(finaidName);
  //     return {
  //       ...prev,
  //       selectedFinaids: alreadySelected
  //         ? prev.selectedFinaids.filter((name) => name !== finaidName)
  //         : [...prev.selectedFinaids, finaidName],
  //     };
  //   });
  // };

  // const handleInputChange = (section: string, field: string, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [section]: {
  //       ...prev[section],
  //       [field]: value,
  //     },
  //   }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    formData.client_company_id = clientID;
    formData.platform = clientDetailsWithProfile?.platform;
    formData.integration = clientDetailsWithProfile?.client_integration;
    formData.model_identifier = clientDetailsWithProfile?.model;

    let filterBank = allBankAccounts?.filter(
      (eachBank) => eachBank?.Id === formData?.input_bank_id
    );

    if (filterBank?.length > 0) {
      formData.input_bank_name = filterBank[0]?.Name;
      formData.input_bank_account_type = filterBank[0]?.AccountType;
    }

    // console.log(formData, "form data");
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value) && value !== null) {
        Object.entries(value).forEach(([subKey, subVal]) => {
          form.append(`${key}.${subKey}`, String(subVal));
        });
      } else {
        form.append(
          key,
          Array.isArray(value) ? value.join(",") : String(value)
        );
      }
    });

    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/ai-agent/run`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response, "Run Quincy API response");
      if (response?.data?.success) {
        showToast({
          title: "Quincy ran Successfully!",
          description: response?.data?.message,
        });
        setSelectedAction("allRuns");
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to run quincy!",
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      showToast({
        title: "Error",
        description: error?.response?.data?.message,
      });
      setIsLoading(false);
      console.log(error, "Error while trying to run quincy!");
    }
  };

  // functions

  async function fetchBankAccounts() {
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/quickbooks/accounts/bank`,
        { client_company_id: clientID },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response?.data?.QueryResponse?.Account?.length > 0) {
        setAllBankAccounts(response?.data?.QueryResponse?.Account);
        // showToast({
        //   title: "Synced successfully!",
        //   description: "",
        // });
      } else {
        setAllBankAccounts([]);
        // showToast({
        //   title: "Unable to sync data!",
        //   description: "",
        // });
      }

      console.log("Fetch bank accounts", response);
    } catch (error: any) {
      console.log(error?.message, "Fetch bank accounts error");
    }
  }

  // renderings

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Date Start</Label>
        <DatePickerInput
          state={formData}
          setState={setFormData}
          name="input_date_start"
          format="Y-m-d"
          placeholder="Date Start"
        />
      </div>

      <div className="space-y-2">
        <Label>Date End</Label>
        <DatePickerInput
          state={formData}
          setState={setFormData}
          name="input_date_end"
          format="Y-m-d"
          placeholder="Date End"
        />
      </div>

      {/* <div className="space-y-2">
        <Label>First Date</Label>
        <DatePickerInput
          state={formData}
          setState={setFormData}
          name="input_date_dayfirst"
          format="Y-m-d"
          placeholder="First Date"
        />
      </div> */}

      {/* Select Bank Info */}
      <div className="space-y-2">
        <Label>Select Bank</Label>
        <Select
          value={formData.input_bank_id}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, input_bank_id: val }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Bank ID" />
          </SelectTrigger>
          <SelectContent>
            {allBankAccounts?.length > 0 &&
              allBankAccounts?.map((bank) => (
                <SelectItem key={bank?.Id} value={bank?.Id}>
                  {/* {`${bank.Name} (${bank?.Id})`} */}
                  {`${bank.Name} (${bank?.AccountType})`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div className="space-y-2">
        <Label>Bank Name</Label>
        <Select
          value={formData.input_bank_name}
          onValueChange={(val) =>
            setFormData((prev) => ({ ...prev, input_bank_name: val }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Bank Name" />
          </SelectTrigger>
          <SelectContent>
            {bankData.map((bank) => (
              <SelectItem key={bank.id} value={bank.name}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Bank Account Type</Label>
        <Select
          value={formData.input_bank_account_type}
          onValueChange={(val) =>
            setFormData((prev) => ({
              ...prev,
              input_bank_account_type: val,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Account Type" />
          </SelectTrigger>
          <SelectContent>
            {bankData.map((bank) => (
              <SelectItem key={bank.id} value={bank.accountType}>
                {bank.accountType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* Match Checkboxes */}
      {[
        "input_date_dayfirst",
        "input_match_bill",
        "input_match_invoice",
        "input_match_payment_advise",
        "input_match_check",
        "input_match_history",
      ].map((key) => (
        <div key={key} className="flex items-center justify-between py-2 w-52">
          <Label className="capitalize">
            {key.replace("input_match_", "").replace(/_/g, " ")}
          </Label>
          <Switch
            checked={formData[key as keyof typeof formData]}
            onCheckedChange={() =>
              handleCheckboxToggle(key as keyof typeof formData)
            }
          />
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="file_csv_transactions">Upload Transactions CSV</Label>
        <Input
          id="file_csv_transactions"
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({
                ...prev,
                file_csv_transactions: file,
              }));
            }
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`mt-4 px-4 py-2 bg-primary text-white rounded ${
          isLoading && "opacity-30 pointer-events-none"
        }`}
      >
        {isLoading ? "Submitting" : "Submit"}
      </button>
    </form>
  );
}
