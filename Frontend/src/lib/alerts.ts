import Swal from "sweetalert2";

export async function confirmAction(title: string, text: string) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
  });

  return result.isConfirmed;
}

export function showSuccess(title: string, text?: string) {
  return Swal.fire({ title, text, icon: "success", confirmButtonColor: "#2563eb" });
}

export function showError(title: string, text?: string) {
  return Swal.fire({ title, text, icon: "error", confirmButtonColor: "#2563eb" });
}
