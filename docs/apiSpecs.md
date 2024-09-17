## User Management

> User management might not be followed since we are using other service⬇️.

- POST `/register`: To allow users and shop owners to register with the system. The request should include user details (name, email, password, and role - user or owner).
- POST `/login`: For authentication purposes. It will validate user credentials and return a token for further requests.
- GET `/profile`: Fetch user or shop owner profile details.
  [Think will use clerk ig...!!]

## Shop Management(For shop owner)

- POST `/shops` : Allows a shop owner to create a shop and provide details like shop name, address, description, and contact info.
- GET `/shops/:shopId` : Fetch all shops associated with a particular owner.
- PUT `/shops/:shopId` : Allows shop owners to update the shop details (name, address, etc.).
- DELETE `/shops/:shopId` : Allows shop owners to delete their shop.

## Menu Management(for shop owner)

- POST `/shops/:shopId/menu` : Allows a shop owner to create a menu for a particular shop. This will include menu items, prices, and descriptions.
- GET `/shops/:shopId/menu` : Retrieve the menu for a specific shop.
- PUT `/shops/:shopId/menu/` :menuItemId: Allows shop owners to update details of a specific menu item.
- DELETE `/shops/:shopId/menu/:menuItemId` : Allows shop owners to delete a specific item from the menu.

## Viewing Shops & Menus(For user)

- GET `/shops/view`: Retrieves a list of all shops available in the system. This might include filters (location, ratings, etc.).
- GET `/shops/:shopId/menu/view` : Retrieve the menu of a specific shop.

## Order Management(For user)

- POST `/orders`: Allows a user to place an order. It will include the user’s ID, shop ID, menu item IDs, quantities, and delivery/pickup preferences.
- GET `/orders/past/:userId`: Retrieves a list of past orders for a specific user.
- GET `/orders/:orderId`: View the details of a specific order.
- DELETE `/order/:orderId`: deletes the particular order.
  > Need to be Implemented if requiered.⬇️
- GET `/orders/queue/:shopId`: This endpoint streams the current queue of orders for a shop, allowing both the owner and users to see the real-time queue.

> Payment Mgmt need to be implemented⬇️

## Payment Management

- POST `/payments`: Allows a user to pay for their order. This should integrate with a payment gateway to handle actual payments.
- GET `/payments/:userId`: Fetch payment history for a specific user.

> Reviews & rating Need to be implemented⬇️

## Reviews & Ratings

- POST `/shops/:shopId/review`: Allows users to leave reviews and ratings for shops after an order is completed.
- GET `/shops/:shopId/review` : Retrieve reviews and ratings for a specific shop.
