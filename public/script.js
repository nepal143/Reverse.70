function hoverin(){
    document.getElementById("change").src = "ima/icons8-arrow-100 (1).png";
}

function hoverout(){
    document.getElementById("change").src = "ima/icons8-arrow-100.png";
}

function gotolink(link){
    location.href = '/register';
} 
  
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader--hidden");
    loader.addEventListener("transitioned", () =>{
        document.body.removeChild(loader);
    })
}) 

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission
  
    // Get form data
    const formData = new FormData(this);
    const username = formData.get('username');
    const password = formData.get('password');
  
    // Perform client-side validation
    if (!username || !password) {
      alert('Please enter username and password');
      return;
    }
  
    // Submit the form
    try {
      const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Login successful');
        window.location.href = '/dashboard'; // Redirect to dashboard page
      } else {
        alert('Login failed. Please check your username and password');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error logging in. Please try again later.');
    }
  });