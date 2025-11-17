# Implementation Notes

### Problem Definition – Initial Phase

**Objective:**
Enable users to efficiently track, manage, and analyze their carbon credit portfolio, including real-time insights on total holdings, value, and price metrics, while maintaining a responsive and intuitive user experience.

**Pain Points:**

* Users cannot easily see aggregate portfolio metrics such as total tonnes, total value, or weighted average price per tonne.
* Filtering by status (available, retired, pending) is not supported, making it difficult to focus on relevant positions.
* Slow backend responses can block page load, degrading the user experience.

**Goals for Solution:**

1. Provide a **Portfolio Summary** feature that aggregates key metrics.
2. Allow users to **filter positions by status** for both summary and detailed views.
3. Handle **slow API responses gracefully** to maintain a smooth UX.

**Product Considerations:**

* **Define the minimal viable calculation logic** first (total, value, weighted price) to validate functionality.
* **Service layer abstraction** ensures that business logic is reusable, testable, and adheres to SOLID principles by ensuring the Single Responsibility Principle (SRP) as the service handles business logic separately from the API route.
* **API design**: Using query parameters for filtering avoids redundant endpoints while keeping the API consistent and intuitive .

* **Frontend UX**: Implement skeleton loaders and incremental updates to handle asynchronous API responses, improving perceived performance.
* **Scalability & Performance**: Backend can leverage worker threads and caching (e.g., Redis) to offload heavy computations and provide faster retrieval for large portfolios.
* **Security & Forgiveness**: Filtering gracefully handles unknown statuses without throwing errors, prioritizing user-facing reliability.

**Key Metrics / Success Criteria:**

* Accurate and timely summary calculations.
* Status filter works consistently across summary and detailed positions table.
* UI remains responsive even with slow API responses.
* Solution architecture supports future scalability and new features with minimal refactoring.


### Implementation Phase

## Backend (BE)

**1. Portfolio Summary Calculations**

* The `computeSummary` function was implemented to calculate **total tonnes**, **total value**, and **weighted average price per tonne**.
* Positions with zero tonnes are correctly handled to avoid division by zero.
* **Status filtering** is implemented at the service layer, making it reusable and following **SOLID principles**.


* A **query parameter (`?status=...`)** is used for filtering rather than a new endpoint:

  * Same resource (`portfolio/summary`) is being accessed.
  * Avoids redundancy and keeps the API surface clean.

**2. Handling Large Computations**

* For large datasets, **worker threads** can be used to perform summary calculations in parallel, then combine the results. This ensures that **computationally heavy operations do not block the main event loop**, keeping the server responsive for other users.
* **Redis caching** can be used to store frequently requested summary results for faster retrieval, reducing repeated computation for the same filters.

**3. Status Filter Error Handling**

* The backend **does not throw an error** if a user requests a status that does not exist.
* This decision is made for **security and user experience reasons**, ensuring that the API is forgiving for a user-facing system and preventing unnecessary error exposure, instead it returns a value of zero for the fields.

**4. Service Layer Design**

* Filtering is implemented in the **service layer** rather than directly in the route handler:

  * Ensures **reusability** across multiple endpoints.
  * Keeps **business logic separate** from HTTP handling.
  * Follows **SOLID principles** and makes testing easier.

**5. Testing – Status Filter**

* **Purpose:** Verify that summary calculations respect the `status` filter and handle unknown statuses gracefully.
* **Tests Added:**

  * **Status filtering** – confirms only positions matching the requested status are included in the summary.
  * **Unknown status handling** – ensures that an unsupported status returns a zeroed summary instead of throwing an error.
* **Why Needed:**

  * Validates correctness of filtering logic for user-facing summaries.
  * Ensures API is forgiving and robust, providing predictable behavior for invalid input.

**6. Trade-offs / Things not done**

* Did not implement **real-time aggregation** or **streaming updates** using graphQL subscriptions for summary calculations; acceptable for the current dataset size.
* Redis caching and worker threads were mentioned as **improvements for scalability**, but not implemented in this iteration due to time constraints.


## Frontend (FE)

**1. Portfolio Summary Display**

* Implemented a **summary card layout** using **Shadcn UI components**.
* Displays **total tonnes**, **total value**, and **weighted average price per tonne**.

**2. Status Filtering**

* Implemented **status dropdown** using `Select` component from Shadcn UI.
* Dropdown filters both:

  * **Summary** (via backend query param)
  * **Positions table** (filtered locally for efficiency)

**3. Handling Slow API Response**

* The `/api/portfolio/summary` endpoint has a **2-second intentional delay**.
* **Skeleton loaders** are used while waiting for the response:

  * Prevents **blocking page rendering**.
  * Provides **improved user experience** despite slow backend.

**4. UX & Performance Decisions**

* Local filtering of positions avoids extra API calls, reducing network latency.
* Summary fetch and table rendering are **decoupled**, allowing independent loading states.
* Error handling via toast notifications ensures **user is informed** if the backend fails.

**5. Trade-offs / Things not done**

* Did not implement **pagination** for extremely large positions data; not needed for current dataset size.
* Did not implement **synchronized filtering** between summary and positions table, considering it was not on the list of todo but it would be a nice to have to use a centralized filtering for both.

---

## General Observations / Design Decisions

* **Maintainability**:

  * Backend filtering logic in service layer is **reusable**.
  * Frontend separation between summary cards and positions table ensures **modular components**.
* **Performance**:

  * Skeleton loaders improve perceived performance on slow APIs.
  * Worker threads and caching are suggested for large-scale datasets.
* **API Design**:

  * Using **query params** for status filter avoids redundant endpoints and keeps the API **RESTful**.
* **Security / User-Facing Considerations**:

  * Forgiving backend for unknown status prevents unnecessary errors and improves **robustness** for end-users.