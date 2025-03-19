import { pgTable, serial, text, varchar, integer, timestamp, boolean, pgEnum, json, decimal } from 'drizzle-orm/pg-core';

// Enum für Produktkategorien
export const categoryEnum = pgEnum('category', [
  'Website', 
  'E-Commerce', 
  'Marketing', 
  'Design', 
  'Service'
]);

// Enum für Bestellstatus
export const orderStatusEnum = pgEnum('order_status', [
  'pending', 
  'processing', 
  'completed', 
  'cancelled'
]);

// Produkte Tabelle
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  category: categoryEnum('category').notNull(),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  available: boolean('available').default(true),
  metadata: json('metadata')
});

// Kunden Tabelle
export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  metadata: json('metadata')
});

// Bestellungen Tabelle
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').references(() => customers.id),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('pending'),
  paymentIntent: varchar('payment_intent', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata')
});

// Bestellpositionen Tabelle
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  metadata: json('metadata')
});

// Exportiere Typen für TypeScript
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert; 