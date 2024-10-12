const themeBtn = document.querySelector(".theme");

themeBtn.addEventListener("click", () => {
  console.log("click");
  document.body.classList.toggle("dark");
});
