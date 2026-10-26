# Dharmateja Agencies — Distribution Management Website

## Features in this prototype
- Separate owner and shop login screens
- Owner: add/edit/delete products, update price and godown stock, review shop orders, update order status
- Shop: browse products, choose quantities and delivery location, place orders
- Seed catalogue for P&G, Nestlé, Lay's, Kurkure, Cadbury, Cavin's, Medimix, Paper Boat and Koya's Agarbathi
- Locations include Satyavedu, Nagalapuram, Pichatoor, Tada, Varadayyapalem, B.N. Kandriga and Sri City
- Orders are visible in the owner area when using the same browser/device (localStorage prototype)
- Optional WhatsApp click-to-chat message with the order details

## Demo credentials (as requested)
- Owner: ID `DHARMATEJA`, password `MAGGIE@123`
- Shop: ID `DHARMATEJA`, password `123`

## Run in VS Code
1. Install Node.js LTS.
2. Extract this ZIP and open the `dharmateja-agencies` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run `npm install`
5. Run `npm run dev`
6. Open the local URL shown by Vite.

## Important limitations before real business use
This is a front-end prototype. Products and orders are saved in the browser's localStorage, so they are not shared between different phones/computers. To make owner and shop accounts communicate across devices, add a backend (Node.js + Express) and a shared SQL database (PostgreSQL/MySQL), then implement server-side authentication and authorization.

The credentials are intentionally only demo credentials in client-side code. They are not secure for a public website. Before deploying, use hashed passwords and server-side sessions/JWT, environment variables, HTTPS, validation and role-based access control.

WhatsApp: enter the owner's WhatsApp number in Owner > Notifications. New order placement can open WhatsApp with a pre-filled message. The person using the browser must press Send. Automated WhatsApp delivery requires the WhatsApp Business Platform and a backend.

SMS: websites cannot send normal SMS directly without a provider. To send automatic SMS, integrate an SMS gateway (for example, MSG91 or Twilio) through a secure backend. The SMS number field in this prototype is a placeholder for that future integration.

Prices and quantities in the starting catalogue are examples only. Update them to match the agency's actual stock and rates. Brand names are used to identify products handled by the distributor; this project is not affiliated with those brands.
