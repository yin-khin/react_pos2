import Swal from "sweetalert2";


export const showAlert = (icon, title, timer = 2000) => {
  let timerInterval;
  return Swal.fire({
    icon,
    title,
    html: "Closing in <b></b> ms.",
    timer,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const popup = Swal.getPopup();
      popup.style.fontFamily = "sans-serif";
      const b = popup.querySelector("b");
      timerInterval = setInterval(() => {
        if (b) b.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  });
};


export const showConfirm = (title, text, confirmButtonText = "Yes, confirm!") => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText,
    didOpen: () => {
      Swal.getPopup().style.fontFamily = "sans-serif";
    },
  });
};
 