




window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-1");
    loader.classList.add("loader-1--hidden");
    loader.addEventListener("transitioned", () =>{
        document.body.removeChild(loader);
    })
})
  
