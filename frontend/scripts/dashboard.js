`use strict`

const restaurantsArray = [];
const restaurantContainer = document.querySelector(".restaurants");
const profileInfo = document.querySelector(".right");
const deleteButton = document.querySelector('#delete');
const navBar = document.querySelector('.nav');

const toggleHidden= (element)=>{element.classList.toggle('hidden');}

const showProfile = ()=>{toggleHidden(document.querySelector('.profile'));}
const showUsers =()=>{toggleHidden(document.querySelector('.users'));}
const showDeliverers= ()=>{toggleHidden(document.querySelector('.deliverers'));}
const showEmployees =()=>{toggleHidden(document.querySelector('.employee'));}
const showOrders = ()=>{toggleHidden(document.querySelector('.orders'));}
const openMyOrders = ()=>{toggleHidden(document.querySelector('.my-orders'));}
const roleNavItems = {
    ADMIN: [
        { text: "Users", action: ()=> showUsers() },
        { text: "Deliverers", action: ()=> showDeliverers() },
        { text: "Employee", action: ()=> showEmployees() },
    ],
    Client: [
        { text: "Orders", action: () => showOrders() },
    ],
    Deliverer: [
        { text: "Active Orders", action: ()=> openMyOrders() },
        {text: 'My orders', action: ()=> openMyOrders() }
    ],
    Employee: [
        { text: "My Restaurants", action: () => showMyRestaurants() }
    ]
};




function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
const username = getCookie("username");
const role = getCookie("role");
const userId = getCookie('userId');


if (role == 'ADMIN') {
    deleteButton.classList.add('hidden');
}else{
    deleteButton.classList.remove('hidden');
}

function updateNavbar(role) {
    // const navbar = document.querySelector(".nav");
    const allowedItems = roleNavItems[role] || [];

    // Clear any role-based links first
    const roleLinksContainer = document.getElementById("roleOptions");
    roleLinksContainer.innerHTML = "";

    allowedItems.forEach(link => {
        const li = document.createElement('li');
        li.classList.add('nav-item');
        const a = document.createElement("a");
        a.textContent = link.text;
        a.style.cursor = 'pointer'; 
        a.classList.add('nav-link');

        // Add custom action to the anchor tag
        a.addEventListener('click', link.action);
        li.innerHTML=a;

        roleLinksContainer.appendChild(a);
    });
}

document.querySelector("#username").textContent=username;
document.querySelector("#role").textContent=role;



const modal = document.querySelector('.modals');
const overlay = document.querySelector('.overlay');

const openModel = ()=>{
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
}
const closeModal= ()=>{
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
}

overlay.addEventListener('click', closeModal);
document.addEventListener("keydown", function(e){
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

const createCard = (restaurant) => {
    // Create the card element
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.width = '15rem';
    card.style.height='auto';
     // You can adjust this as needed
    
    // Create and add the restaurant image to the card
    
    // Create and add the card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = restaurant.restaurantName; 
    
    const cardTextRating = document.createElement('p');
    cardTextRating.classList.add('card-text');
    cardTextRating.textContent = `Rating: ${restaurant.restaurantRating}`; 
    
    const cardTextPhone = document.createElement('p');
    cardTextPhone.classList.add('card-text');
    cardTextPhone.textContent = `Phone: ${restaurant.restaurantPhoneNumber}`; 

    const cardTextAddress = document.createElement('p');
    cardTextAddress.classList.add('card-text');
    cardTextAddress.textContent = `Address: ${restaurant.restaurantAddress}`;
    
    const cardButton = document.createElement('a');
    cardButton.href = '#';
    cardButton.onclick= openModel;
    cardButton.classList.add('btn', 'btn-primary');
    cardButton.textContent = 'Go to Restaurant';
    cardButton.onclick=()=>fetchMenuItems(restaurant.id);
  
    // Append elements to cardBody
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTextRating);
    cardBody.appendChild(cardTextPhone);
    cardBody.appendChild(cardTextAddress);
    cardBody.appendChild(cardButton);
    
    // Append cardBody to card
    card.appendChild(cardBody);
    
    return card;
};

function createFlipCard(cardData) {
    // Create card container and card elements
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    
    const card = document.createElement('div');
    card.className = 'card';
    
    // Create front side of the card
    const front = document.createElement('div');
    front.className = 'front';
    
    const frontImg = document.createElement('div');
    frontImg.className = 'img';
    if (cardData.frontImage) {
        frontImg.style.backgroundImage = `url(${cardData.frontImage})`;
        frontImg.style.backgroundSize = 'cover';
        frontImg.style.backgroundPosition = 'center';
    }
    
    const frontInfo = document.createElement('div');
    frontInfo.className = 'info';
    
    const frontTitle = document.createElement('h2');
    frontTitle.textContent = cardData.title || 'Card Title';
    
    const frontPrice = document.createElement('h3');
    frontPrice.textContent = `Price: ${cardData.price || '$0.00'}`;
    
    const frontButton = document.createElement('button');
    frontButton.textContent = 'Add to cart';
    if (cardData.onAddToCart) {
        frontButton.addEventListener('click', function(e) {
            toggleHidden(document.querySelector('.cart'));
            e.stopPropagation(); // Prevent card flip when clicking button
            cardData.onAddToCart();
        });
    }
    
    frontInfo.appendChild(frontTitle);
    frontInfo.appendChild(frontPrice);
    frontInfo.appendChild(frontButton);
    
    front.appendChild(frontImg);
    front.appendChild(frontInfo);
    
    // Create back side of the card
    const back = document.createElement('div');
    back.className = 'back';
    
    const backDescription = document.createElement('p');
    backDescription.textContent = cardData.description || 'Card description goes here.';
    
    back.appendChild(backDescription);
    
    // Assemble the card
    card.appendChild(front);
    card.appendChild(back);
    cardContainer.appendChild(card);
    
    // Add flip functionality
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
    
    return cardContainer;
}
const getAllUsers = function() {
    fetch('http://localhost:8080/users')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            return response.json();
        })
        .then(data => {
            console.log("Users:", data);
            const usersArray = []; 
            usersArray.push(...data);

            const userContainer = document.querySelector('#user-container');

            usersArray.forEach(user => {
                const card = createCard(user);
                userContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching users:", error.message); 
        });
};


const deleteUser = function() {
    const deleteText='DELETE';
    let userInput = prompt("PLEASE WRITE DELETE TO MAKE YOUR REQUEST");
    if(userInput===deleteText){
        fetch(`http://localhost:8080/users/delete/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                // Use response.text() to read error message from backend
                return response.text().then(errText => {
                    throw new Error('Failed to delete: ' + errText);
                });
            }
            logout();
            return response.text();
        })
        .then(message => {
            alert(message); // show success message
        })
        .catch(error => {
            console.error("Delete error:", error.message);
            alert(error.message); // show error message
        });

    }else{
        alert('Wrong input!');
    }
};

deleteButton.addEventListener('click', deleteUser);

const getRestaurants = function () {
  fetch("http://localhost:8080/restaurants")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
      return response.json();
    })
    .then(data => {
      console.log("Restaurants:", data);
      restaurantsArray.push(...data); 

      // Create and append each restaurant card
      restaurantsArray.forEach(restaurant => {
        const card = createCard(restaurant);
        restaurantContainer.appendChild(card);  // Append the card to the container
      });
    })
    .catch(error => {
      console.error("Error:", error);
    });
};


function renderMenuItems(menuItems) {
    const modalContent = document.querySelector(".menuItems");
    modalContent.innerHTML = "";

    menuItems.forEach(item => {
        const card = createFlipCard({
            frontImage: item.imageUrl || 'placeholder.jpg',
            title: item.itemName,
            price: item.itemPrice,
            description: item.itemDescription,
            onAddToCart: () => addToCart(item.id)
        });

        modalContent.appendChild(card);
    });
}

const fetchMenuItems = (restaurantId) => {
    fetch(`http://localhost:8080/menu/restaurants/${restaurantId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch menu items');
        }
        return response.json();
      })
      .then(menuItems => {
        console.log('Menu Items:', menuItems);
        renderMenuItems(menuItems);
        openModel(); // show modal
      })
      .catch(error => {
        console.error('Error fetching menu items:', error);
      });
};


const viewCart=(userId)=>{
    fetch(`http://localhost:8080/orders/cart?userId=${userId}`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error in view:', error)
    );      
}
const addToCart = (menuItemId) => {
    const userId = getCookie("userId"); 
    console.log(userId)

    fetch(`http://localhost:8080/orders/add-item?userId=${userId}&menuItemId=${menuItemId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Item added to cart:', data);

        if (data && data.items) {
            updateCartDisplay(data);
        } else {
            console.warn("No items in response, skipping cart display update.");
        }
    
        viewCart(userId);
    })
    .catch(error => {
        console.error('Error adding item to cart:', error);
    });
};


function updateCartDisplay(order) {
    const cartContainer = document.querySelector('.cart');
    cartContainer.innerHTML = ''; 

    if (!order || !Array.isArray(order.items)) {
        console.warn("updateCartDisplay: invalid order format", order);
        return;
    }

    order.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.textContent = `${item.itemName} - $${item.itemPrice}`;
        cartContainer.appendChild(cartItem);
    });
}

const checkout = () => {
    const userId = getCookie("userId");

    fetch(`http://localhost:8080/orders/checkout?userId=${userId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order finalized:', data);
        alert("Order sended!");
    })
    .catch(error => {
        console.error('Error finalizing order:', error);
    });
};


const logout = ()=>{
    window.location.href='index.html';
}



// Fetch restaurants on page load
updateNavbar(role);
window.addEventListener("DOMContentLoaded", getRestaurants);
window.addEventListener("DOMContentLoaded", getAllUsers);
