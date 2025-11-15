import nextId from "react-id-generator";

export const backendBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9003";

export const headerList = [
  { keyId: nextId(), name: "Type", id: "type" },
  { keyId: nextId(), name: "Date", id: "date" },
  {
    keyId: nextId(),
    name: "Description",
    id: "description",
    width: "w-56",
  },
  // { keyId: nextId(), name: "Category ID", id: "category_id" },
  {
    keyId: nextId(),
    name: "Category Name",
    id: "category_name",
    width: "w-56",
  },
  { keyId: nextId(), name: "Payee", id: "payee" },
  { keyId: nextId(), name: "Receipt", id: "receipt" },
  { keyId: nextId(), name: "Amount", id: "amount" },
  // { keyId: nextId(), name: "Completed", id: "completed" },
  // { keyId: nextId(), name: "Vector Found", id: "vectorFound" },
  { keyId: nextId(), name: "Comments", id: "comments", width: "w-56" },
  {
    keyId: nextId(),
    name: "Parsed Description",
    id: "parsedDescription",
    width: "w-56",
  },
  { keyId: nextId(), name: "Parsed Type", id: "parsedType" },
  { keyId: nextId(), name: "Vector found", id: "vectorFound" },
  // { keyId: nextId(), name: "Action", id: "action" },
];
