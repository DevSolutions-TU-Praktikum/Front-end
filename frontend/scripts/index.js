`use strict`

const container = document.querySelector(".form-container");
const registerBtn = document.querySelector(".btn-signup");
const loginBtn = document.querySelector(".btn-login");
const signUpForm = document.querySelector(".form-signUp");
const loginForm = document.querySelector(".form-login");
signUpForm.classList.add("hidden");

registerBtn.addEventListener("click", (e) => {
    container.classList.add("active");
    loginForm.classList.add("hidden");
    signUpForm.classList.remove("hidden");

});
loginBtn.addEventListener("click", (e) => {
    container.classList.remove("active");
    loginForm.classList.remove("hidden");
    signUpForm.classList.add("hidden");

});

const setRole = (data)=>{
  let role;
          if(data.username==='ADMIN'){
            role = "ADMIN";
          }else if (data.role === 0) {
            role="Client";
          } else if (data.role === 1) {
            role="Deliverer";
          } else if (data.role === 2) {
            role="Employee";
          } else {
            role;
          }
          return role;
}


const login = async function(e){
        e.preventDefault();

    
        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();
    
    
  
        if (!username || !password) {
          alert('Моля, попълни и двете полета.');
          return;
        }

    
        const data = {
          username: username,
          password: password
        };
        console.log(data);
    
        try {
          const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
    
          const result = await response.json();
          const role = setRole(result);
    
          if (response.ok) {
            document.cookie=`userId=${result.id}; path=/`;
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `role=${role}; path=/;`;
            window.location.href = 'dashboard.html';
          } else {
            alert('Грешка: ' + result.error);
          }
        } catch (error) {
          console.error('Грешка при заявката:', error);
          alert('Възникна грешка при свързване със сървъра.');
        }
}


const signUp=async function(e) {
  e.preventDefault();

    const username = e.target.username.value.trim();
    const phoneNumber = e.target.user_phone_number.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const data = {
        username,
        userPhoneNumber: phoneNumber,
        userEmail: email,
        password
    };

    try {
        const response = await fetch('http://localhost:8080/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const role = setRole(result);

        if (response.ok) {
            console.log(result);
            document.cookie=`userId=${result.id}; path=/`;
            document.cookie = `username=${username}; path=/;`;
            document.cookie = `role=${role}; path=/;`;
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Грешка: ' + (result.error || 'Нещо се обърка.'));
        }
    } catch (error) {
        console.error('Грешка при заявката:', error);
        alert('Възникна грешка при свързване със сървъра.');
    }
}


loginForm.addEventListener("submit", login);
signUpForm.addEventListener("submit", signUp);
