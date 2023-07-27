/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/addresses', 'AddressesController.index')
  Route.post('/addresses', 'AddressesController.store')
  Route.get('/addresses/:id', 'AddressesController.show')
  Route.patch('/addresses/:id', 'AddressesController.update')
  Route.delete('/addresses/:id', 'AddressesController.destroy')

  Route.get('/deliveries/:id', 'DeliveriesController.show')
}).prefix('delivery')
