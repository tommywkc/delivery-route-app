# Delivery Route App

A route planning app that finds the optimal path between a pickup and drop-off location, visualised on an interactive map.

🔗 **Live Demo:** [https://delivery-route-app-badha3c7h5d5d4g0.switzerlandnorth-01.azurewebsites.net](https://delivery-route-app-badha3c7h5d5d4g0.switzerlandnorth-01.azurewebsites.net)

---

## Features

- Input a pickup and drop-off address
- Handles `in progress`, `success`, `failure` and `500` statuses with appropriate UI feedback
- Displays the route on a Mapbox map with numbered waypoint markers (1, 2, 3...)
- Address autocomplete via Mapbox Geocoding API
- Actual driving route drawn using Mapbox Directions API
- Mobile responsive layout
- Full error handling for API failures and edge cases
- Unit tests covering core API logic

---

## Tech Stack

- React
- Mapbox

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- A [Mapbox access token](https://account.mapbox.com/) (create a free account)

### Setup

```bash
git clone https://github.com/tommywkc/delivery-route-app.git
cd delivery-route-app
npm install
```

Create a `.env.local` file in the project root:  
```bash
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here  
REACT_APP_ROUTE_API_MODE=real
```

### Run (Development)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test

```bash
npm test
```

### Build (Production)

```bash
npm run build
npm start
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Screenshots

**Desktop**  

<img width="1470" height="752" alt="image" src="https://github.com/user-attachments/assets/995ecf85-c5e8-48dd-b35d-87cd02b2e989" />  


  
**Mobile**  

<img width="500" alt="Mobile view" src="https://github.com/user-attachments/assets/2020a671-661b-43c7-80c1-012245e2b732" />



