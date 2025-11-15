export function downloadCSVWithJSON(data) {
  // Convert JSON to CSV
  const csvContent = unparse(data);

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv" });

  // Create a temporary link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.csv";

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
