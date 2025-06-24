# 🎯 **Backend Implementation Plan – ServerHeaven**

This document outlines the step-by-step implementation plan for the ServerHeaven backend, based on the architecture, data modeling, and user flow specifications.

---

## 🔥 **Phase 1: Foundation and Core Structure**

Goal: Build the backend foundation, including project setup, authentication, and APIs for core entities.

### ✅ **Task 1.1: Python Project Setup**

* [x] Initialize the project using `pipenv` or `poetry`.
* [x] Select and configure a web framework (e.g., **FastAPI** for its modern approach and performance).
* [x] Integrate the **Firebase Admin SDK**.
* [x] Organize the project into modules (e.g., `core`, `features`, `models`).

### ✅ **Task 1.2: Authentication and User Flow**

* [ ] Implement an endpoint to sync the user from Firebase Auth to the `Users` collection in Firestore upon first login.
* [ ] Create a middleware or decorator to protect routes by validating the Firebase authentication token.
* [ ] Develop the Profile API (`/profile`):

  * `GET /profile/{user_id}`: Retrieve user profile.
  * `POST /profile`: Create or update the authenticated user profile.

### ✅ **Task 1.3: Core Entity APIs (CRUD)**

* [ ] API for `Servers`.
* [ ] API for `PlayerIdentity` (linked to the user profile).
* [ ] Admin API for `Games`, allowing future expansion with new games.

---

## 🚀 **Phase 2: Core Functionalities**

With the foundation ready, this phase focuses on delivering the platform's primary value.

### ✅ **Task 2.1: Review & Reputation System**

* [ ] Implement `POST /review` to submit reviews (player → server, server → player).
* [ ] Implement `GET /reviews/{target_id}` to fetch reviews.
* [ ] **Reputation Logic:** Create a Cloud Function (or asynchronous backend process) to recalculate the `reputation_score` of a `User` or `Server` whenever a new review is created.

### ✅ **Task 2.2: Social Feed and Posts**

* [ ] Implement `POST /post` for `Users` and `Servers` to create posts.
* [ ] Implement interaction APIs:

  * `POST /post/{id}/like`
  * `POST /post/{id}/comment`
* [ ] Develop the first version of `GET /feed` with a simple chronological order.

---

## ⚙️ **Phase 3: Advanced Features and Integrations**

This phase adds complexity, intelligence, and external integrations.

### ✅ **Task 3.1: Smart Search**

* [ ] Implement `GET /search/servers` and `GET /search/users`.
* [ ] Add support for multiple filters (tags, reputation, game, etc.).
* [ ] **Architecture Note:** Evaluate whether Firestore search is sufficient or if an external search service like **Algolia** or **Elasticsearch** is needed for complex queries.

### ✅ **Task 3.2: Boost System (Patreon Integration)**

* [ ] Create a webhook endpoint (`POST /boost/sync`) to receive Patreon notifications.
* [ ] Implement logic to validate and process webhooks, updating the `is_supporter` status in `User` and managing `Boost` documents.
* [ ] Update the search API to prioritize results based on `boost_priority_level`.

### ✅ **Task 3.3: Moderation and Reports**

* [ ] Implement `POST /report` API for users to report content.
* [ ] Develop admin endpoints:

  * `GET /reports`
  * `POST /reports/{id}/action`
* [ ] Implement logic to apply moderation actions (e.g., update the `status` of posts, users, etc.).

---

## 🚢 **Phase 4: Deployment & Operations**

The final phase focuses on preparing the backend for production with scalability and maintenance in mind.

### ✅ **Task 4.1: Containerization and Deployment**

* [ ] Create a `Dockerfile` for the Python application.
* [ ] Set up automated deployment to **Google Cloud Run**.
* [ ] Manage secrets and environment variables (Firebase credentials, etc.).

### ✅ **Task 4.2: Security and Rules**

* [ ] Review and implement **Firestore and Storage Security Rules** to ensure direct access (bypassing the backend) is restricted and safe.
* [ ] Apply rate limiting to critical APIs to prevent abuse.
