# QuackNet Framework: 8-Hour MVP Sprint Plan (Bounty Edition)

**New Goal:** Create a compelling, interactive prototype of a **multi-agent framework** called **QuackNet**. Our first two agents will be a **Moderator Agent** and a **Verifier Agent** working together to keep communities safe.

---

### **Hour 1: Setup & Framework UI (10:30 AM - 11:30 AM)**

**Objective:** Get the project running and build the main application shell for a multi-agent framework.

* **[15 min] Project Initialization:**
    * Use `Vite` to bootstrap a new React project: `npm create vite@latest quacknet-app -- --template react-ts`.
    * Install and configure Tailwind CSS.

* **[30 min] App Layout & Component Shells:**
    * Create a main `App.jsx`.
    * Design a two-column layout:
        * **Left Column:** Will contain the DAO configuration panel for the *entire framework*.
        * **Right Column:** Will display the simulated, real-time community chat feed, now with visual cues for multi-agent actions.
    * Create placeholder component files: `ConfigurationPanel.jsx`, `ChatFeed.jsx`, `ChatMessage.jsx`.
    * Add a header: "**QuackNet Framework**" and a "Connected to DuckChain Testnet" status indicator.

* **[15 min] Mock Data Structure:**
    * Create a `mockData.js` file with sample chat messages. Include messages designed to be flagged (e.g., spam, toxicity).

---

### **Hour 2: DAO Configuration Panel (11:30 AM - 12:30 PM)**

**Objective:** Build the UI for a DAO to manage its agent fleet and moderation rules.

* **[45 min] Build the Rules UI:**
    * In `ConfigurationPanel.jsx`, add a section for "Active Agents" with toggles for:
        * `[x] Moderator Agent`
        * `[x] Verifier Agent` (This demonstrates the framework's modularity).
    * Add a section for "Moderation Rules" (same as before: checkboxes for `Block Malicious Links`, `Flag Toxic Language`, etc.).

* **[15 min] State Management:**
    * Use React's `useState` hook in `App.jsx` to manage the rules and the active agents.

---

### **Hour 3-4: Simulated Multi-Agent Collaboration (12:30 PM - 2:30 PM)**

**Objective:** Create a believable chat feed that shows **two agents collaborating** to moderate content. This is the core of the bounty PoC.

* **[45 min] Build the Basic Chat Feed:**
    * In `ChatFeed.jsx`, map over and render the mock chat messages.
    * Implement a `setInterval` function to add new "live" messages to simulate a real-time conversation.

* **[75 min] "Wizard of Oz" Multi-Agent Logic:**
    * In `App.jsx`, create a `useEffect` hook that watches for new messages.
    * **Step 1: Moderator Agent Action.** Write a function that checks the message against the rules. When a message is a match, update its state to `status: 'flagged_by_moderator'`.
    * **Step 2: UI for Step 1.** Conditionally render a small, yellow-bordered UI in `ChatMessage.jsx` that says: "⚠️ Flagged by Moderator Agent".
    * **Step 3: Verifier Agent Action.** Use a `setTimeout` for 2-3 seconds to simulate the Verifier Agent's analysis. After the delay, update the message's state to `status: 'verified_by_verifier'`.
    * **Step 4: UI for Step 3.** The UI in `ChatMessage.jsx` should now change to a more prominent, red-bordered box that says: "**✅ Verified:** Malicious Link Removed by QuackNet Framework". This clearly demonstrates two agents working in sequence.

---

### **Hour 5: On-Chain Action Simulation (2:30 PM - 3:30 PM)**

**Objective:** Simulate the final, verified action being logged on-chain.

* **[45 min] Build the Appeal UI:**
    * On the final "Verified" message UI, add an "Appeal Decision" button.
    * Clicking it opens a modal: "Appeal this decision on-chain? This will require a stake of 50 $DUCK." with "Confirm" and "Cancel" buttons.

* **[15 min] Fake the Transaction:**
    * On "Confirm," close the modal, update the message's state to `appealStatus: 'pending'`, and change the UI to show "Appeal Pending: Awaiting DAO Vote". This completes the simulated workflow.

---

### **Hour 6-7: Polish, Pitch, & Demo Prep (3:30 PM - 5:30 PM)**

**Objective:** Make it look amazing and prepare to sell the vision of a framework.

* **[60 min] Final UI/UX Polish:**
    * Review all UI components, add hover effects, ensure consistency.
    * Crucially, make the visual distinction between the "Moderator" flag and the "Verifier" confirmation very clear and impactful.

* **[60 min] Create Pitch Deck & Script:**
    * Your pitch is now much stronger. Create a simple 5-slide presentation:
        1.  **Title Slide:** QuackNet - A Multi-Agent Framework for Web3 Communities.
        2.  **The Problem:** Moderation is broken and single-agent solutions aren't enough.
        3.  **Our Solution:** A collaborative, on-chain framework. **Showcase your app screenshot here, highlighting the multi-agent workflow.**
        4.  **How it Works:** Your new workflow diagram showing both agents.
        5.  **Why We Win (Bounty & Grand Prize):** Explain how you've built a true framework, not just a product, directly addressing the bounty.

---

### **Hour 8: Record Demo & Submit (5:30 PM - 6:30 PM)**

**Objective:** Create a flawless video demo and submit the project.

* **[30 min] Record the Demo:**
    * Your demo is now a story of agent collaboration. Show the rules being set. Show a message appear. Show the **first agent flag it (yellow box)**. Pause. Then show the **second agent verify it (red box)**. Then show the appeal. This narrative is extremely powerful.
* **[30 min] Final Submission:**
    * Push your code to GitHub. Make sure your `README.md` clearly states that this is a **multi-agent framework** built to address Bounty #1266.
    * Fill out the submission form and upload your new pitch deck and demo video.

You've now upgraded your project from a good idea to a potential bounty winner. This is a much stronger position. Go for it!