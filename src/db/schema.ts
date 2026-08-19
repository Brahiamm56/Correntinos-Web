import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";

export type ProductoVariante = {
  id: string;
  talle?: string;
  color?: string;
  sku?: string;
  stock: number;
};

// ─── Better Auth tables ───────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role").notNull().default("usuario"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  issuer: text("issuer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Domain tables ────────────────────────────────────────────────────────────

export const noticias = pgTable("noticias", {
  id: uuid("id").primaryKey().defaultRandom(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  contenido: text("contenido").notNull(),
  imagen_url: varchar("imagen_url", { length: 500 }),
  fecha_creacion: timestamp("fecha_creacion", { withTimezone: true }).defaultNow(),
  fecha_publicacion: timestamp("fecha_publicacion", { withTimezone: true }),
  publicada: boolean("publicada").default(false),
  autor_id: text("autor_id").references(() => user.id),
  actualizado_en: timestamp("actualizado_en", { withTimezone: true }).defaultNow(),
});

export const categorias = pgTable("categorias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 100 }).notNull().unique(),
  descripcion: text("descripcion"),
});

export const productos = pgTable("productos", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: varchar("nombre", { length: 255 }).notNull(),
  descripcion: text("descripcion"),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  variantes: jsonb("variantes").$type<ProductoVariante[]>(),
  imagen_url: varchar("imagen_url", { length: 500 }),
  categoria_id: uuid("categoria_id").references(() => categorias.id, {
    onDelete: "set null",
  }),
  activo: boolean("activo").default(true),
  creado_en: timestamp("creado_en", { withTimezone: true }).defaultNow(),
  actualizado_en: timestamp("actualizado_en", { withTimezone: true }).defaultNow(),
});

export const ordenes = pgTable("ordenes", {
  id: uuid("id").primaryKey().defaultRandom(),
  usuario_id: text("usuario_id").references(() => user.id, {
    onDelete: "set null",
  }),
  cliente_nombre: varchar("cliente_nombre", { length: 255 }).notNull(),
  cliente_email: varchar("cliente_email", { length: 255 }).notNull(),
  cliente_telefono: varchar("cliente_telefono", { length: 20 }).notNull(),
  cliente_direccion: varchar("cliente_direccion", { length: 500 }).notNull(),
  cliente_ciudad: varchar("cliente_ciudad", { length: 100 }).notNull(),
  productos: jsonb("productos").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  estado: varchar("estado", { length: 50 }).default("pendiente"),
  numero_orden: varchar("numero_orden", { length: 20 }).unique(),
  creado_en: timestamp("creado_en", { withTimezone: true }).defaultNow(),
  actualizado_en: timestamp("actualizado_en", { withTimezone: true }).defaultNow(),
});

export const configuracion = pgTable(
  "configuracion",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    singleton_key: boolean("singleton_key").notNull().default(true),
    email_fundacion: varchar("email_fundacion", { length: 255 }),
    telefono_fundacion: varchar("telefono_fundacion", { length: 20 }),
    texto_home: text("texto_home"),
    actualizado_en: timestamp("actualizado_en", { withTimezone: true }).defaultNow(),
  },
  (t) => [unique("idx_configuracion_singleton").on(t.singleton_key)]
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type Noticia = typeof noticias.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
export type Producto = typeof productos.$inferSelect;
export type Orden = typeof ordenes.$inferSelect;
export type Configuracion = typeof configuracion.$inferSelect;
