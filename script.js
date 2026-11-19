/**
 * ====================================================================
 * PetJoy - Pet Food, Toys & Pet Accessories Automated Subscription
 * Simple, Clean & Well-Commented JavaScript
 * All Prices in Indian Rupees (₹)
 * ====================================================================
 * 
 * Concepts Used in this File:
 * 1. Variables & Arrays of Objects (to store pet products & subscriptions)
 * 2. Functions (to perform actions like calculating price & showing tabs)
 * 3. DOM Manipulation (using document.getElementById and innerHTML)
 * 4. Events (onclick, onchange)
 * 5. localStorage (to save data so it does not disappear on page refresh)
 */

// ====================================================================
// PART 0: AUTHENTICATION & DEMO ACCOUNTS (User vs Admin)
// ====================================================================

const AUTH_ACCOUNTS = {
  user: {
    email: "user@petjoy.in",
    password: "user123",
    role: "user",
    name: "Priya Sharma",
    avatar: "👤",
    roleLabel: "Customer"
  },
  admin: {
    email: "admin@petjoy.in",
    password: "admin123",
    role: "admin",
    name: "Store Administrator",
    avatar: "👑",
    roleLabel: "Admin"
  }
};

// Get currently logged-in account from localStorage
function getCurrentUser() {
  const saved = localStorage.getItem("petjoy_current_user");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  // Default to Customer on first visit for instant demo exploration
  localStorage.setItem("petjoy_current_user", JSON.stringify(AUTH_ACCOUNTS.user));
  return AUTH_ACCOUNTS.user;
}

// Set or clear active logged-in account
function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("petjoy_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("petjoy_current_user");
  }
  updateAuthUI();
}

// Check credentials and sign in
function login(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();

  if (cleanEmail === AUTH_ACCOUNTS.user.email.toLowerCase() && password === AUTH_ACCOUNTS.user.password) {
    setCurrentUser(AUTH_ACCOUNTS.user);
    return { success: true, user: AUTH_ACCOUNTS.user };
  }

  if (cleanEmail === AUTH_ACCOUNTS.admin.email.toLowerCase() && password === AUTH_ACCOUNTS.admin.password) {
    setCurrentUser(AUTH_ACCOUNTS.admin);
    return { success: true, user: AUTH_ACCOUNTS.admin };
  }

  return {
    success: false,
    message: "Invalid credentials! Use user@petjoy.in / user123 (Customer) or admin@petjoy.in / admin123 (Admin)."
  };
}

// 1-Click quick login for demo and presentation ease
function quickLogin(role) {
  const account = AUTH_ACCOUNTS[role];
  if (!account) return;

  setCurrentUser(account);
  closeLoginModal();

  alert(`✅ Signed in as ${account.name} (${account.roleLabel})`);

  // Direct user to relevant section
  if (role === "admin") {
    showSection("admin");
  } else {
    showSection("my-subs");
  }
}

// Handle manual login form submit
function handleManualLogin(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  const result = login(email, pass);
  if (result.success) {
    closeLoginModal();
    alert(`✅ Welcome back, ${result.user.name} (${result.user.roleLabel})!`);

    if (result.user.role === "admin") {
      showSection("admin");
    } else {
      showSection("my-subs");
    }
  } else {
    alert(result.message);
  }
}

// Log out active user
function logout() {
  setCurrentUser(null);
  alert("👋 You have logged out successfully.");
  showSection("login");
}

// Open Login Modal with optional message
function openLoginModal(noticeMessage) {
  // If user opens login, navigate directly to the dedicated login page section
  showSection("login");
  const notice = document.getElementById("modalNotice");
  if (notice && noticeMessage) {
    notice.textContent = noticeMessage;
    notice.style.display = "block";
  }
}

// Close Login Modal
function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

// Close modal when user clicks on dark backdrop
function handleModalOverlayClick(event) {
  if (event.target && event.target.id === "loginModal") {
    closeLoginModal();
  }
}

// Function called when the role dropdown changes on the Login page
function onLoginRoleChange() {
  const roleSelect = document.getElementById("inputLoginRole");
  const nameInput = document.getElementById("inputLoginName");
  const passInput = document.getElementById("inputLoginPassword");

  if (!roleSelect || !nameInput || !passInput) return;

  if (roleSelect.value === "admin") {
    nameInput.placeholder = "e.g. admin or Store Manager";
    if (nameInput.value === "Priya Sharma" || !nameInput.value) {
      nameInput.value = "admin";
    }
    passInput.placeholder = "Enter admin123";
    passInput.value = "admin123";
  } else {
    nameInput.placeholder = "e.g. Priya Sharma or Rahul";
    if (nameInput.value === "admin" || !nameInput.value) {
      nameInput.value = "Priya Sharma";
    }
    passInput.placeholder = "Enter user123";
    passInput.value = "user123";
  }
}

// 1-Click quick fill & login for dedicated login page
function quickFillAndLogin(role) {
  const roleSelect = document.getElementById("inputLoginRole");
  const nameInput = document.getElementById("inputLoginName");
  const passInput = document.getElementById("inputLoginPassword");

  if (role === "admin") {
    if (roleSelect) roleSelect.value = "admin";
    if (nameInput) nameInput.value = "Store Administrator";
    if (passInput) passInput.value = "admin123";
  } else {
    if (roleSelect) roleSelect.value = "user";
    if (nameInput) nameInput.value = "Priya Sharma";
    if (passInput) passInput.value = "user123";
  }

  handleDedicatedLogin();
}

// Submit handler for dedicated login page (where user enters name and password)
function handleDedicatedLogin(event) {
  if (event) event.preventDefault();

  const roleSelect = document.getElementById("inputLoginRole");
  const nameInput = document.getElementById("inputLoginName");
  const passInput = document.getElementById("inputLoginPassword");

  let role = roleSelect ? roleSelect.value : "user";
  const name = nameInput ? nameInput.value.trim() : "";
  const password = passInput ? passInput.value.trim() : "";

  if (!name) {
    alert("Please enter your name or username.");
    return;
  }

  // Smart auto-detection: If username is 'admin' with password 'admin123', automatically log in as Admin!
  if ((name.toLowerCase() === "admin" || name.toLowerCase().includes("administrator")) && password === "admin123") {
    role = "admin";
    if (roleSelect) roleSelect.value = "admin";
  }

  if (role === "admin") {
    if (password !== "admin123") {
      alert("❌ Incorrect password for Admin account!\nPassword is: admin123");
      return;
    }

    const adminUser = {
      name: name,
      email: name.toLowerCase().includes("@") ? name : `${name.toLowerCase()}@petjoy.in`,
      role: "admin",
      roleLabel: "Admin",
      avatar: "👑"
    };

    setCurrentUser(adminUser);
    alert(`🎉 Welcome Administrator ${adminUser.name}!\nLogged in with full store access.`);
    showSection("admin");
  } else {
    // Customer (User) account
    if (password !== "user123") {
      alert("❌ Incorrect password for Customer account!\nPassword is: user123");
      return;
    }

    const customerUser = {
      name: name,
      email: name.toLowerCase().includes("@") ? name : `${name.toLowerCase()}@petjoy.in`,
      role: "user",
      roleLabel: "Customer",
      avatar: "👤"
    };

    setCurrentUser(customerUser);
    alert(`🎉 Welcome, ${customerUser.name}!\nLogged in as Customer.`);
    showSection("my-subs");
  }
}

// Update Top Navigation Bar with active profile or login button
function updateAuthUI() {
  const container = document.getElementById("navAuth");
  if (!container) return;

  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = `
      <button class="btn-login-nav" onclick="showSection('login')">
        <span>🔑</span> Sign In
      </button>
    `;
  } else {
    const isAdmin = user.role === "admin";
    const pillClass = isAdmin ? "user-pill user-pill-admin" : "user-pill";

    container.innerHTML = `
      <div class="${pillClass}">
        <span>${user.avatar} ${user.name} <strong>(${user.roleLabel})</strong></span>
        <button class="btn-logout" onclick="logout()" title="Logout">Logout</button>
      </div>
    `;
  }
}

// ====================================================================
// PART 1: PRODUCT DATA (Pet Food, Pet Toys, Pet Accessories in INR ₹)
// ====================================================================
const products = [
  // --- PET FOOD ---
  {
    id: "food-1",
    name: "Royal Canin Maxi Dry Dog Kibble",
    category: "food",
    petType: "dog",
    price: 2499,
    image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&auto=format&fit=crop&q=80",
    desc: "Complete nutrition dry food for adult dogs with healthy digestion formula."
  },
  {
    id: "food-2",
    name: "Grain-Free Wild Salmon Dog Food",
    category: "food",
    petType: "dog",
    price: 1899,
    image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=500&auto=format&fit=crop&q=80",
    desc: "Real salmon protein recipe, gentle on sensitive stomachs."
  },
  {
    id: "food-3",
    name: "Hill's Science Diet Indoor Cat Food",
    category: "food",
    petType: "cat",
    price: 1499,
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80",
    desc: "Balanced chicken recipe crafted specially for indoor cats."
  },
  {
    id: "food-4",
    name: "Whiskas Tender Tuna & Salmon Wet Pouches",
    category: "food",
    petType: "cat",
    price: 899,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=80",
    desc: "Pack of 12 single-serve succulent wet food pouches in gravy."
  },

  // --- PET TOYS ---
  {
    id: "toy-1",
    name: "KONG Ultra-Durable Rubber Chew Toy",
    category: "toys",
    petType: "dog",
    price: 699,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&auto=format&fit=crop&q=80",
    desc: "Super-durable natural rubber toy. Stuff with treats to keep dogs busy."
  },
  {
    id: "toy-2",
    name: "Chuckit! High-Bounce Fetch Ball (2-Pack)",
    category: "toys",
    petType: "dog",
    price: 499,
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80",
    desc: "Tough bouncing balls that float in water for active outdoor play."
  },
  {
    id: "toy-3",
    name: "SmartyKat Electronic Feather Wand",
    category: "toys",
    petType: "cat",
    price: 799,
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500&auto=format&fit=crop&q=80",
    desc: "Motorized spinning wand that triggers your cat's natural hunting chase."
  },
  {
    id: "toy-4",
    name: "Yeowww! Organic Catnip Yellow Banana",
    category: "toys",
    petType: "cat",
    price: 399,
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=500&auto=format&fit=crop&q=80",
    desc: "100% pure organic catnip packed in durable cotton fabric."
  },

  // --- PET ACCESSORIES ---
  {
    id: "acc-1",
    name: "Ergonomic Padded Dog Harness",
    category: "accessories",
    petType: "dog",
    price: 999,
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=500&auto=format&fit=crop&q=80",
    desc: "Reflective, comfortable no-pull chest harness for safe walking."
  },
  {
    id: "acc-2",
    name: "Self-Cleaning Slicker Grooming Brush",
    category: "accessories",
    petType: "dog",
    price: 599,
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80",
    desc: "Removes shedding hair with a 1-click button to easily release fur."
  },
  {
    id: "acc-3",
    name: "Stainless Steel Double Pet Bowls with Mat",
    category: "accessories",
    petType: "cat",
    price: 749,
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80",
    desc: "Anti-spill silicone mat with two food-grade rust-free stainless bowls."
  },
  {
    id: "acc-4",
    name: "Orthopedic Memory Foam Pet Bed",
    category: "accessories",
    petType: "dog",
    price: 1699,
    image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=500&auto=format&fit=crop&q=80",
    desc: "Relieves pet joint aches with soft removable, machine-washable cover."
  }
];

// Initial Demo Subscriptions in INR ₹
const DEFAULT_DEMO_SUBSCRIPTIONS = [
  {
    id: "SUB-101",
    petName: "Max",
    petSpecies: "dog",
    foodName: "Royal Canin Maxi Dry Dog Kibble",
    toyName: "KONG Ultra-Durable Rubber Chew Toy",
    accName: "Ergonomic Padded Dog Harness",
    frequency: "monthly",
    frequencyText: "Monthly (Every 30 Days)",
    frequencyDays: 30,
    price: 3987,
    status: "active",
    nextDelivery: "Nov 25, 2026",
    address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru"
  },
  {
    id: "SUB-102",
    petName: "Luna",
    petSpecies: "cat",
    foodName: "Hill's Science Diet Indoor Cat Food",
    toyName: "SmartyKat Electronic Feather Wand",
    accName: "Stainless Steel Double Pet Bowls with Mat",
    frequency: "biweekly",
    frequencyText: "Bi-Weekly (Every 14 Days)",
    frequencyDays: 14,
    price: 2742,
    status: "active",
    nextDelivery: "Nov 18, 2026",
    address: "Flat 402, Green Glen Layout, Bellandur, Bengaluru"
  }
];

// ====================================================================
// PART 2: SIMPLE LOCALSTORAGE HELPER FUNCTIONS
// ====================================================================

function getSavedSubscriptions() {
  const savedData = localStorage.getItem("petjoy_inr_subs");
  if (savedData) {
    return JSON.parse(savedData); // Convert stored text back into a JavaScript array
  } else {
    // First time opening the website: save and return the default demo subscriptions
    localStorage.setItem("petjoy_inr_subs", JSON.stringify(DEFAULT_DEMO_SUBSCRIPTIONS));
    return DEFAULT_DEMO_SUBSCRIPTIONS;
  }
}

function saveSubscriptionsToStorage(subsArray) {
  // Save array to localStorage as a JSON string
  localStorage.setItem("petjoy_inr_subs", JSON.stringify(subsArray));
}

// ====================================================================
// PART 3: PAGE NAVIGATION FUNCTION
// ====================================================================

function showSection(sectionName) {
  const sections = ["home", "products", "subscribe", "my-subs", "admin", "login"];

  // Hide all sections
  for (let i = 0; i < sections.length; i++) {
    const secElement = document.getElementById("sec-" + sections[i]);
    const btnElement = document.getElementById("btn-" + sections[i]);

    if (secElement) secElement.style.display = "none";
    if (btnElement) btnElement.classList.remove("active");
  }

  // Show the selected section
  const currentSec = document.getElementById("sec-" + sectionName);
  const currentBtn = document.getElementById("btn-" + sectionName);

  if (currentSec) currentSec.style.display = "block";
  if (currentBtn) currentBtn.classList.add("active");

  // Call relevant helper functions depending on which page is opened
  if (sectionName === "products") {
    displayCatalog("all");
  } else if (sectionName === "subscribe") {
    populateBuilderDropdowns("dog");
    calculateLiveBill();
  } else if (sectionName === "my-subs") {
    displaySubscriptionsList();
  } else if (sectionName === "admin") {
    displayAdminPanel();
  } else if (sectionName === "login") {
    onLoginRoleChange();
  }

  // Scroll smoothly to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ====================================================================
// PART 4: PRODUCTS CATALOG DISPLAY & FILTERING
// ====================================================================

function displayCatalog(categoryFilter) {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  grid.innerHTML = ""; // Clear existing cards

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    // If filter is 'all' OR matches the product category, show it
    if (categoryFilter === "all" || p.category === categoryFilter) {
      const card = document.createElement("div");
      card.className = "product-card";

      // Badge for pet type (Dog or Cat)
      const badgeClass = p.petType === "dog" ? "badge-dog" : "badge-cat";
      const petLabel = p.petType === "dog" ? "🐶 Dog" : "🐱 Cat";

      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <div class="product-card-body">
          <span class="badge ${badgeClass}">${petLabel} • ${p.category.toUpperCase()}</span>
          <div class="product-card-title">${p.name}</div>
          <p class="product-card-desc">${p.desc}</p>
          <div class="product-card-footer">
            <strong style="color: #0284c7; font-size: 1.15rem;">₹${p.price.toLocaleString("en-IN")}</strong>
            <button class="btn btn-primary btn-sm" onclick="selectProductForSubscription('${p.id}')">
              + Choose for Box
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    }
  }
}

// Function called when a filter button is clicked
function filterCatalog(category, buttonElement) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => btn.classList.remove("active"));
  buttonElement.classList.add("active");

  displayCatalog(category);
}

// ====================================================================
// PART 5: SUBSCRIPTION BOX BUILDER & LIVE BILL CALCULATION
// ====================================================================

// Populates the <select> dropdowns based on whether "dog" or "cat" is selected
function populateBuilderDropdowns(petType) {
  const foodSelect = document.getElementById("subFoodSelect");
  const toySelect = document.getElementById("subToySelect");
  const accSelect = document.getElementById("subAccSelect");

  if (!foodSelect || !toySelect || !accSelect) return;

  foodSelect.innerHTML = "";
  toySelect.innerHTML = "";
  accSelect.innerHTML = "";

  // Loop through products array and add options into dropdowns
  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    if (p.petType === petType || p.petType === "dog") {
      const option = `<option value="${p.id}" data-price="${p.price}">${p.name} (₹${p.price})</option>`;

      if (p.category === "food") foodSelect.innerHTML += option;
      if (p.category === "toys") toySelect.innerHTML += option;
      if (p.category === "accessories") accSelect.innerHTML += option;
    }
  }
}

// Called when user switches pet between Dog and Cat
function onSpeciesSelectChange() {
  const species = document.getElementById("subPetSpecies").value;
  const petNameInput = document.getElementById("subPetName");

  if (species === "dog") {
    petNameInput.value = "Max";
  } else {
    petNameInput.value = "Luna";
  }

  populateBuilderDropdowns(species);
  calculateLiveBill();
}

// Live price calculation formula
function calculateLiveBill() {
  const foodSelect = document.getElementById("subFoodSelect");
  const toySelect = document.getElementById("subToySelect");
  const accSelect = document.getElementById("subAccSelect");
  const freqSelect = document.getElementById("subFrequencySelect");
  const petName = document.getElementById("subPetName").value || "My Pet";
  const petSpecies = document.getElementById("subPetSpecies").value;

  // Get prices of currently selected items
  const foodOption = foodSelect.options[foodSelect.selectedIndex];
  const toyOption = toySelect.options[toySelect.selectedIndex];
  const accOption = accSelect.options[accSelect.selectedIndex];

  const foodPrice = foodOption ? parseFloat(foodOption.getAttribute("data-price")) : 0;
  const toyPrice = toyOption ? parseFloat(toyOption.getAttribute("data-price")) : 0;
  const accPrice = accOption ? parseFloat(accOption.getAttribute("data-price")) : 0;

  // Calculate items subtotal
  const subtotal = foodPrice + toyPrice + accPrice;

  // Determine tiered discount based on frequency
  // Weekly: 15% discount
  // Bi-Weekly: 10% discount
  // Monthly: 5% discount
  let discountPercent = 5;
  let freqText = "every 30 days";

  if (freqSelect.value === "weekly") {
    discountPercent = 15;
    freqText = "every 7 days";
  } else if (freqSelect.value === "biweekly") {
    discountPercent = 10;
    freqText = "every 14 days";
  }

  const discountAmount = subtotal * (discountPercent / 100);
  const finalTotal = subtotal - discountAmount;

  // Update HTML elements on the screen
  document.getElementById("summaryPetInfo").textContent = `For ${petName} (${petSpecies === 'dog' ? 'Dog' : 'Cat'})`;
  document.getElementById("sumFoodPrice").textContent = `₹${foodPrice.toLocaleString("en-IN")}`;
  document.getElementById("sumToyPrice").textContent = `₹${toyPrice.toLocaleString("en-IN")}`;
  document.getElementById("sumAccPrice").textContent = `₹${accPrice.toLocaleString("en-IN")}`;
  document.getElementById("sumSubtotal").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  document.getElementById("sumDiscount").textContent = `-₹${discountAmount.toLocaleString("en-IN")} (${discountPercent}% OFF)`;
  document.getElementById("sumFinalTotal").textContent = `₹${Math.round(finalTotal).toLocaleString("en-IN")}`;
  document.getElementById("sumFreqLabel").textContent = `Billed automatically ${freqText}`;
}

// Called when user clicks "Confirm & Start Subscription"
function saveNewSubscription() {
  const user = getCurrentUser();
  if (!user) {
    openLoginModal("Please sign in with your Customer account before starting a subscription.");
    return;
  }

  const petName = document.getElementById("subPetName").value.trim();
  const petSpecies = document.getElementById("subPetSpecies").value;
  const address = document.getElementById("subAddress").value.trim();
  const freqSelect = document.getElementById("subFrequencySelect");

  if (!petName) {
    alert("Please enter your pet's name.");
    return;
  }

  // Get names of selected items
  const foodSelect = document.getElementById("subFoodSelect");
  const toySelect = document.getElementById("subToySelect");
  const accSelect = document.getElementById("subAccSelect");

  const foodName = foodSelect.options[foodSelect.selectedIndex].text.split(" (₹")[0];
  const toyName = toySelect.options[toySelect.selectedIndex].text.split(" (₹")[0];
  const accName = accSelect.options[accSelect.selectedIndex].text.split(" (₹")[0];

  // Parse total price
  const totalText = document.getElementById("sumFinalTotal").textContent.replace("₹", "").replace(/,/g, "");
  const totalPrice = parseFloat(totalText);

  // Calculate next delivery date (Today + frequency days)
  let days = 30;
  let freqLabel = "Monthly (Every 30 Days)";
  if (freqSelect.value === "weekly") { days = 7; freqLabel = "Weekly (Every 7 Days)"; }
  if (freqSelect.value === "biweekly") { days = 14; freqLabel = "Bi-Weekly (Every 14 Days)"; }

  const today = new Date();
  const nextDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  const dateFormatted = nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // Create new subscription object
  const newSub = {
    id: "SUB-" + Math.floor(100 + Math.random() * 900),
    customerName: user.name,
    customerEmail: user.email,
    petName: petName,
    petSpecies: petSpecies,
    foodName: foodName,
    toyName: toyName,
    accName: accName,
    frequency: freqSelect.value,
    frequencyText: freqLabel,
    frequencyDays: days,
    price: totalPrice,
    status: "active",
    nextDelivery: dateFormatted,
    address: address || "Flat 402, Green Glen Layout, Bellandur, Bengaluru"
  };

  // Add into subscriptions array and save
  const subs = getSavedSubscriptions();
  subs.unshift(newSub); // Adds to front of array
  saveSubscriptionsToStorage(subs);

  alert(`🎉 Subscription Activated for ${petName}! First delivery scheduled for ${dateFormatted}.`);

  // Switch to "My Subscriptions" page to show it
  showSection("my-subs");
}

// Quick fill helper from homepage cards
function quickFillBox(species) {
  showSection("subscribe");
  document.getElementById("subPetSpecies").value = species;
  onSpeciesSelectChange();
}

// Select item helper from catalog cards
function selectProductForSubscription(productId) {
  const p = products.find(item => item.id === productId);
  if (!p) return;

  showSection("subscribe");
  document.getElementById("subPetSpecies").value = p.petType;
  populateBuilderDropdowns(p.petType);

  // Set the specific select dropdown
  if (p.category === "food") document.getElementById("subFoodSelect").value = p.id;
  if (p.category === "toys") document.getElementById("subToySelect").value = p.id;
  if (p.category === "accessories") document.getElementById("subAccSelect").value = p.id;

  calculateLiveBill();
  alert(`Added "${p.name}" to your box builder!`);
}

// ====================================================================
// PART 6: MY SUBSCRIPTIONS PAGE DISPLAY & MANAGEMENT
// ====================================================================

function displaySubscriptionsList() {
  const container = document.getElementById("subscriptionsList");
  if (!container) return;

  const user = getCurrentUser();

  // If user is not logged in, prompt them to sign in
  if (!user) {
    container.innerHTML = `
      <div style="text-align: center; background: #ffffff; padding: 3rem 1.5rem; border: 2px dashed #cbd5e1; border-radius: 12px; margin-bottom: 2rem;">
        <span style="font-size: 3rem;">🔐</span>
        <h3 style="margin: 0.8rem 0 0.4rem 0; color: #0f172a;">Customer Login Required</h3>
        <p style="color: #64748b; max-width: 450px; margin: 0 auto 1.5rem auto;">
          Please sign in to your account to view, pause, or manage your recurring pet boxes.
        </p>
        <button class="btn btn-primary" onclick="openLoginModal('Please sign in to view your subscriptions.')">
          🔑 Sign In to View Subscriptions
        </button>
      </div>
    `;
    return;
  }

  const subs = getSavedSubscriptions();
  container.innerHTML = "";

  // Account banner informing who is logged in
  if (user.role === "admin") {
    container.innerHTML += `
      <div style="background-color: #fffbeb; border: 1.5px solid #fde68a; color: #92400e; padding: 0.9rem 1.2rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <strong>👑 Admin Overview Mode:</strong> You are viewing active customer subscriptions across the platform.
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showSection('admin')" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">
          Go to Admin Panel ⚙️
        </button>
      </div>
    `;
  } else {
    container.innerHTML += `
      <div style="background-color: #f0f9ff; border: 1.5px solid #bae6fd; color: #0369a1; padding: 0.9rem 1.2rem; border-radius: 8px; margin-bottom: 1.5rem;">
        <strong>👤 Customer Account:</strong> Showing automated deliveries for <strong>${user.name}</strong> (${user.email}).
      </div>
    `;
  }

  if (subs.length === 0) {
    container.innerHTML += `
      <div style="text-align: center; background: #fff; padding: 3rem; border: 1px dashed #cbd5e1; border-radius: 8px;">
        <h3>No active subscriptions found</h3>
        <p style="color: #64748b; margin: 0.5rem 0 1rem 0;">Build your first automated pet box to get recurring deliveries!</p>
        <button class="btn btn-primary" onclick="showSection('subscribe')">Create a Box Now</button>
      </div>
    `;
    return;
  }

  for (let i = 0; i < subs.length; i++) {
    const s = subs[i];
    const isPaused = s.status === "paused";
    const statusBadge = isPaused ? '<span class="badge badge-paused">⏸️ Paused</span>' : '<span class="badge badge-active">● Active</span>';

    const card = document.createElement("div");
    card.className = "sub-card";
    card.innerHTML = `
      <div class="sub-header">
        <div>
          <h3>${s.petSpecies === 'dog' ? '🐶' : '🐱'} ${s.petName}'s Custom Subscription Box</h3>
          <small style="color: #64748b;">Plan ID: #${s.id} • ${s.frequencyText}</small>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 1.3rem; font-weight: bold; color: #0284c7;">₹${Math.round(s.price).toLocaleString("en-IN")}</div>
          ${statusBadge}
        </div>
      </div>

      <div class="sub-details">
        <div class="detail-item">
          <strong>🍖 FOOD ITEM</strong>
          ${s.foodName}
        </div>
        <div class="detail-item">
          <strong>🧸 TOY ITEM</strong>
          ${s.toyName}
        </div>
        <div class="detail-item">
          <strong>🦺 ACCESSORY</strong>
          ${s.accName}
        </div>
        <div class="detail-item">
          <strong>📅 NEXT DISPATCH</strong>
          ${isPaused ? 'Paused (No charges)' : s.nextDelivery}
        </div>
      </div>

      <div class="sub-actions">
        <button class="btn btn-secondary btn-sm" onclick="togglePauseSubscription(${i})">
          ${isPaused ? '▶️ Resume Delivery' : '⏸️ Pause Subscription'}
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteSubscription(${i})">
          ✕ Cancel Box
        </button>
      </div>
    `;
    container.appendChild(card);
  }
}

// Pause or Resume subscription
function togglePauseSubscription(index) {
  const subs = getSavedSubscriptions();
  if (subs[index].status === "active") {
    subs[index].status = "paused";
    alert(`Subscription for ${subs[index].petName} has been PAUSED.`);
  } else {
    subs[index].status = "active";
    alert(`Subscription for ${subs[index].petName} has been RESUMED!`);
  }
  saveSubscriptionsToStorage(subs);
  displaySubscriptionsList();
}

// Cancel subscription
function deleteSubscription(index) {
  if (confirm("Are you sure you want to cancel this recurring box subscription?")) {
    const subs = getSavedSubscriptions();
    subs.splice(index, 1); // Remove 1 item at index
    saveSubscriptionsToStorage(subs);
    alert("Subscription cancelled.");
    displaySubscriptionsList();
  }
}

// ====================================================================
// PART 7: ADMIN PANEL & AUTOMATION SIMULATOR
// ====================================================================

function displayAdminPanel() {
  const user = getCurrentUser();
  const deniedBox = document.getElementById("adminAccessDenied");
  const contentBox = document.getElementById("adminPanelContent");
  const deniedMsg = document.getElementById("adminDeniedMessage");

  // Access Control: Only Store Administrators can access Admin widgets
  if (!user || user.role !== "admin") {
    if (contentBox) contentBox.style.display = "none";
    if (deniedBox) {
      deniedBox.style.display = "block";
      if (!user) {
        if (deniedMsg) deniedMsg.textContent = "You are currently signed out. Store Administrator credentials are required to view this dashboard.";
      } else {
        if (deniedMsg) deniedMsg.textContent = `You are currently signed in as a Customer (${user.name}). Revenue metrics, the billing simulator, and the customer registry are restricted to the Store Administrator.`;
      }
    }
    return;
  }

  // User is confirmed Admin
  if (deniedBox) deniedBox.style.display = "none";
  if (contentBox) contentBox.style.display = "block";

  const subs = getSavedSubscriptions();
  const tableBody = document.getElementById("adminTableBody");

  // Calculate Metrics
  let activeCount = 0;
  let totalRevenue = 0;

  for (let i = 0; i < subs.length; i++) {
    if (subs[i].status === "active") {
      activeCount++;
      totalRevenue += subs[i].price;
    }
  }

  document.getElementById("adminActiveSubs").textContent = activeCount;
  document.getElementById("adminTotalRevenue").textContent = `₹${Math.round(totalRevenue).toLocaleString("en-IN")}`;
  document.getElementById("adminTotalOrders").textContent = subs.length;

  // Fill Table
  if (!tableBody) return;
  tableBody.innerHTML = "";

  for (let i = 0; i < subs.length; i++) {
    const s = subs[i];
    const statusColor = s.status === "active" ? "#10b981" : "#f59e0b";

    tableBody.innerHTML += `
      <tr>
        <td><strong>#${s.id}</strong></td>
        <td>${s.petSpecies === 'dog' ? '🐶' : '🐱'} ${s.petName}</td>
        <td>${s.foodName}, ${s.toyName}</td>
        <td>${s.frequencyText}</td>
        <td><strong>₹${Math.round(s.price).toLocaleString("en-IN")}</strong></td>
        <td><span style="color: ${statusColor}; font-weight: bold;">${s.status.toUpperCase()}</span></td>
      </tr>
    `;
  }
}

// Simulate Automated Billing & Dispatch Daemon
function simulateAutomatedCycle() {
  const user = getCurrentUser();
  if (!user || user.role !== "admin") {
    alert("⛔ Access Denied: Only Store Administrators can execute the automated billing cycle.");
    return;
  }

  const subs = getSavedSubscriptions();
  let renewedCount = 0;

  // Advance delivery dates for all active subscriptions
  for (let i = 0; i < subs.length; i++) {
    if (subs[i].status === "active") {
      renewedCount++;
      const today = new Date();
      const futureDate = new Date(today.getTime() + (subs[i].frequencyDays || 30) * 24 * 60 * 60 * 1000);
      subs[i].nextDelivery = futureDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  }

  saveSubscriptionsToStorage(subs);
  displayAdminPanel();

  alert(`⚡ Automated Engine Executed!\n\n${renewedCount} active subscription(s) processed and billed successfully.\nNew fulfillment orders generated.`);
}

// Reset data to initial state
function resetDemoData() {
  if (confirm("Reset subscriptions back to original demo values?")) {
    localStorage.removeItem("petjoy_inr_subs");
    getSavedSubscriptions();
    displayAdminPanel();
    alert("Reset complete!");
  }
}

// ====================================================================
// INITIALIZATION ON PAGE LOAD
// ====================================================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize and render top navigation auth bar
  updateAuthUI();

  // Show Home section by default on launch
  showSection("home");
});
