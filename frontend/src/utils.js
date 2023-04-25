import swal from "sweetalert2";

export function showError( error) {
  swal.fire({
    icon: "error",
    title: "Error",
    text: error,
    confirmButtonColor: "#1da1f2",
  });
}
