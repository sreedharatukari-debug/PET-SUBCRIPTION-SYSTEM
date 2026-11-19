# 🐾 PetJoy - Pet Food, Toys And Pet Accessories Automated Subscription System

> Built with **HTML5, CSS3, and JavaScript (Pure & Beginner-Friendly)**  
> *Zero complex libraries, zero external backend, zero build tools. Clean, robust, and easy to read, understand, and explain every line of code.*

---

## 📁 Project Structure

```text
pet-subscription-system/
├── index.html     <-- Main Application (Home, Catalog, Box Builder, Subscriptions, Admin & Login Tab)
├── login.html     <-- Standalone Dedicated Login Page (Enter Name & Password to sign in as User or Admin)
├── style.css      <-- Universal Stylesheet: Colors, Cards, Responsive Grid, Modals & Login Card
├── script.js      <-- Interactivity: Role-Based Auth, INR (₹) Engine, Simulator & LocalStorage
└── README.md      <-- Project Architecture, Account Guide & Viva Voce Q&A Cheat Sheet
```

---

## 👥 Dual Account Authentication (User vs Admin)

You can log in either through the **`Login 🔐` tab in `index.html`** or by opening **`login.html`** directly! Enter your **Name** and **Password**, select your **Role**, and launch your session:

| Account Type | Role in Dropdown | Name / Username | Password | Permissions & Features |
| :--- | :--- | :--- | :--- | :--- |
| **👤 Customer (User)** | `Customer` | Any name *(e.g. Priya Sharma, Rahul)* | `user123` | • Browse products & build custom pet boxes<br>• Calculate live discounts in INR (`₹`)<br>• Manage "My Subscriptions" (Pause, Resume, Cancel)<br>• *Protected from accessing the Store Admin dashboard* |
| **👑 Store Admin** | `Store Admin` | `admin` *(or any admin name)* | `admin123` | • Monitor total Monthly Recurring Revenue (MRR) in `₹`<br>• Access full system subscription registry<br>• Execute the **Automated Billing Simulator**<br>• Reset demo data |

> 💡 **Quick 1-Click Fill:** On both the login page and modal, click **`⚡ Customer Login`** or **`⚡ Admin Login`** to auto-fill the Name and Password and sign in instantly without typing!

---

## 🎯 What Does This Website Do?

This website solves a real-world problem for pet owners:
* **The Problem:** Pet parents frequently run out of pet food, chew toys, and grooming gear, requiring repeated manual shopping.
* **The Solution:** **PetJoy Automated Subscription System** allows a customer to:
  1. Select their pet (Dog or Cat).
  2. Choose a package: **🍖 Pet Food**, **🧸 Pet Toys**, and **🦺 Pet Accessories**.
  3. Pick a delivery frequency: **Weekly (15% OFF)**, **Bi-Weekly (10% OFF)**, or **Monthly (5% OFF)**.
  4. See a **live price calculation in Indian Rupees (₹)** with automated discounts.
  5. Manage subscriptions in **My Subscriptions** (Pause, Resume, or Cancel anytime).
  6. Track orders through a visual **4-stage delivery tracker** (`Order Billed` ➔ `Box Packed` ➔ `Out for Delivery` ➔ `Delivered`).
  7. Use the **Admin Panel** to view revenue and run the **Automated Billing Simulator**!

---

## 🚀 How to Run the Website

1. Open your File Explorer.
2. Go to the project directory:
   ```text
   C:\Users\91629\.gemini\antigravity\scratch\pet-subscription-system
   ```
3. To start from the main store: Double-click **`index.html`**.
4. To start from the dedicated login page: Double-click **`login.html`**.
5. Runs in any browser (**Google Chrome**, **Microsoft Edge**, **Firefox**, **Brave**) with no internet and no server required.

---

## 🧠 How the Code Works

### 1. HTML (`index.html` & `login.html`) — *Structure & Semantics*
* Semantic HTML5 elements:
  * `<header>` & `<nav>` with dynamic account pill (`#navAuth`).
  * Modular page sections (`sec-home`, `sec-products`, `sec-subscribe`, `sec-my-subs`, `sec-admin`, `sec-login`).
  * Dedicated login card with Role dropdown, Name input, Password input, and submit button.
  * Role-based access warning card (`#adminAccessDenied`) inside the Admin panel.
  * Direct `onclick="showSection('...')"` handlers for instant single-page tab switching.

### 2. CSS (`style.css`) — *Design & Responsive Layout*
* **Login Card Styling:** `.login-page-card`, animated brand header, and `.quick-login-grid`.
* **Colors:**
  * Primary Blue (`#0284c7`) for headers, active tabs, and customer buttons.
  * Amber/Gold (`#f59e0b`, `#fef3c7`) for Admin badges and quick-login cards.
  * Neutral background (`#f8fafc`, `#ffffff`) for high contrast and readability.
* **Layouts:**
  * **Flexbox** (`display: flex`) for navbar items, user pills, and action rows.
  * **CSS Grid** (`display: grid`) for product cards and quick-login buttons.
  * Media queries (`@media (max-width: 768px)`) for mobile responsive display.

### 3. JavaScript (`script.js`) — *Interactivity & Business Logic*
* **Authentication & Session Management:**
  * `handleDedicatedLogin(event)`: reads the entered Name, Password, and selected Role.
  * Checks password (`user123` for Customer, `admin123` for Admin).
  * Stores session in `localStorage.setItem('petjoy_current_user', JSON.stringify(user))`.
  * `updateAuthUI()`: displays the logged-in user's name (e.g. `👤 Priya Sharma (Customer)` or `👑 Store Administrator (Admin)`) with a Logout button.
* **Role-Based Access Control (RBAC):**
  * When a customer tries to view the Admin Panel, `displayAdminPanel()` restricts access and prompts them to switch to the Admin account.
* **Live Price Math:** Computes items subtotal, applies tiered frequency discounts (Weekly: 15%, Bi-Weekly: 10%, Monthly: 5%), and updates DOM in Indian Rupees (`₹`).
* **Automated Cycle Simulator:** Advances delivery dates across active subscriptions using JavaScript `Date` math.

---

## 💡 Presentation & Viva Voce Q&A Guide

### Q1: What technologies are used in this website?
> **Answer:** "This project is built purely using HTML5 for page semantics, CSS3 for responsive styling and card layouts, and vanilla JavaScript for dynamic bill calculations, authentication, and `localStorage` session persistence."

### Q2: How does the login page verify users without a database?
> **Answer:** "In `script.js` and `login.html`, the `handleDedicatedLogin()` function reads the entered Name, Password, and Role from the form. It validates the password (`user123` for Customer, `admin123` for Admin). Once verified, it creates a user session object containing the user's name, role, and avatar, and saves it in `localStorage` under `petjoy_current_user`."

### Q3: What is the difference between logging in as User vs Admin?
> **Answer:** 
> - **When logged in as User (Customer):** The user can customize pet boxes, choose food/toys/accessories, calculate discounted recurring prices in INR (`₹`), and pause/resume their subscriptions. They cannot view store business revenue or run billing cycle simulations.
> - **When logged in as Admin:** The administrator has full store visibility: total monthly recurring revenue (MRR) in `₹`, active subscriber metrics, the complete subscriptions registry, and access to the **Automated Billing Simulator**."

### Q4: How does data stay saved when switching pages or refreshing?
> **Answer:** "It uses the browser's native `localStorage` API. The user session is stored under `petjoy_current_user`, and all subscription orders are stored under `petjoy_inr_subs` as a JSON string."

---

**PetJoy • Automated Subscription System for Pet Care**
