"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Mail, Edit, CheckCircle, XCircle } from "lucide-react";
import { backendBaseURL } from "@/assets/constants/constant";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";

export function EmployeeManagement() {
  const { showToast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(false);
  const [accountantList, setAccountantList] = useState([]);
  const [newAccountant, setNewAccountant] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    // permissions: [] as string[],
  });

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setNewAccountant({
        ...newAccountant,
        permissions: [...newAccountant.permissions, permissionId],
      });
    } else {
      setNewAccountant({
        ...newAccountant,
        permissions: newAccountant.permissions.filter(
          (id) => id !== permissionId
        ),
      });
    }
  };

  const handleAddAccountant = async () => {
    // const accountant = {
    //   id: `EMP${String(accountantList.length + 1).padStart(3, "0")}`,
    //   ...newAccountant,
    //   status: "pending",
    // };

    // setAccountantList([...accountantList, accountant]);
    // setNewAccountant({
    //   name: "",
    //   email: "",
    //   designation: "",
    //   team: "",
    //   permissions: [],
    // });
    // setIsAddDialogOpen(false);
    setIsLoading(true);
    try {
      let response = await axios.post(
        `${backendBaseURL}/api/v1/users/accountant/invite`,
        newAccountant,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response, "Invite accountant API response");
      if (response?.status === 200) {
        showToast({
          title: "Created Successfully!",
          description: response?.data?.message,
        });
        setNewAccountant({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
        });
        setLocalRefresh((prev) => !prev);
        setIsAddDialogOpen(false);
        // setLocalLoading((prev) => !prev);
      } else {
        showToast({
          title: "Error",
          description: "Error while trying to invite accountant!",
        });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showToast({
        title: "Error",
        description: "Error while trying to invite accountant!",
      });
      console.log(error, "Invite accountant error");
    }
  };

  // const handleSendInvite = (employeeId: string) => {
  //   // In a real application, this would send an email invitation
  //   alert(`Invitation sent to accountant ${employeeId}`);
  // };

  // const toggleEmployeeStatus = (employeeId: string) => {
  //   setAccountantList(
  //     accountantList?.map((emp) => {
  //       if (emp.id === employeeId) {
  //         return {
  //           ...emp,
  //           status: emp.status === "active" ? "inactive" : "active",
  //         };
  //       }
  //       return emp;
  //     })
  //   );
  // };

  // functions

  async function getAllAccountants() {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${backendBaseURL}/api/v1/users/accountant/invited`,
        {
          headers: {
            Authorization: `Bearer ${localStorage?.getItem("accessToken")}`,
          },
        }
      );

      if (response?.data?.data?.length > 0) {
        setAccountantList(response?.data?.data);
      }

      setIsLoading(false);
      console.log(response, "Get all accountants response");
    } catch (error) {
      setIsLoading(false);
      console.log(error?.message, "Get all accountants error");
    }
  }

  // renderings

  useEffect(() => {
    getAllAccountants();
  }, [localRefresh]);

  useEffect(() => {
    let allCountriesStorage = localStorage.getItem("allCountries")
      ? JSON.parse(localStorage.getItem("allCountries"))
      : "";
    setAllCountries(allCountriesStorage);
  }, []);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Accountant List</h2>
          <p className="text-sm text-muted-foreground">
            Manage your Accountants and their access permissions
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Accountant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Accountant</DialogTitle>
              <DialogDescription>
                Add a new accountant to your firm. They will receive an email
                invitation to set up their account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  value={newAccountant.first_name}
                  onChange={(e) =>
                    setNewAccountant({
                      ...newAccountant,
                      first_name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  value={newAccountant.last_name}
                  onChange={(e) =>
                    setNewAccountant({
                      ...newAccountant,
                      last_name: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newAccountant?.email}
                  onChange={(e) =>
                    setNewAccountant({
                      ...newAccountant,
                      email: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Phone
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Select
                    value={newAccountant?.countryCode}
                    onValueChange={(value) =>
                      setNewAccountant((prev) => {
                        return { ...prev, countryCode: value };
                      })
                    }
                  >
                    <SelectTrigger id="country" className="w-[100px] px-1">
                      <SelectValue placeholder="Country Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCountries?.length > 0 &&
                        allCountries?.map((eachCountry, index) => {
                          const phoneCode = eachCountry?.phone_code;
                          if (!phoneCode) return null;
                          return (
                            <SelectItem
                              key={phoneCode + index}
                              value={phoneCode}
                            >
                              {`${eachCountry?.name}(${phoneCode})`}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex. 8373524715"
                    value={newAccountant?.phone}
                    onChange={(e) =>
                      setNewAccountant((prev) => {
                        return { ...prev, phone: e.target.value };
                      })
                    }
                  />
                </div>
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="designation" className="text-right">
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={newAccountant.designation}
                  onChange={(e) =>
                    setNewAccountant({
                      ...newAccountant,
                      designation: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Team
                </Label>
                <Select
                  value={newAccountant.team}
                  onValueChange={(value) =>
                    setNewAccountant({ ...newAccountant, team: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-2">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`permission-${permission.id}`}
                        checked={newAccountant.permissions.includes(
                          permission.id
                        )}
                        onCheckedChange={(checked) =>
                          handlePermissionChange(
                            permission.id,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={`permission-${permission.id}`}>
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                onClick={handleAddAccountant}
              >
                {isLoading ? "Inviting..." : "Add Accountant & Send Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead>Accountant</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead> */}
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton width={100} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={100} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={80} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={70} height={15} />
              </TableCell>
              <TableCell>
                <Skeleton width={70} height={15} />
              </TableCell>
              <TableCell className="text-left">
                <div className="flex justify-start gap-2">
                  <Button variant="ghost" size="icon">
                    <Skeleton width={50} height={15} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Skeleton width={50} height={15} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            accountantList?.length > 0 &&
            accountantList.map((accountant) => (
              <TableRow key={accountant?._id}>
                {/* <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/placeholder.svg?height=32&width=32`}
                        alt={accountant.name}
                      />
                      <AvatarFallback>{accountant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{accountant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {accountant.email}
                      </div>
                    </div>
                  </div>
                </TableCell> */}
                <Link href={`/accountant/userprofile/${accountant?._id}`}>
                  <TableCell className="hover:underline">
                    {accountant?.first_name}
                  </TableCell>
                </Link>
                <TableCell>{accountant?.last_name}</TableCell>
                <TableCell>{accountant?.email}</TableCell>
                <TableCell>{accountant?.mobile}</TableCell>
                <TableCell>{accountant?.status}</TableCell>
                {/* <TableCell>
                  <Badge
                    variant={
                      accountant.status === "active"
                        ? "default"
                        : accountant.status === "inactive"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {accountant.status}
                  </Badge>
                </TableCell> */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {accountant.status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => handleSendInvite(accountant.id)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Send Invite
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => toggleEmployeeStatus(accountant.id)}
                      title={
                        accountant.status === "active"
                          ? "Deactivate"
                          : "Activate"
                      }
                    >
                      {accountant.status === "active" ? (
                        <XCircle className="h-4 w-4 text-destructive" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
