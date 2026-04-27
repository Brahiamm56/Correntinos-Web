-- ============================================================================
-- SCHEMA: Fundación Correntinos Contra el Cambio Climático
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================================

-- Tabla de usuarios (extiende auth.users)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255),
  foto_perfil VARCHAR(500),
  rol VARCHAR(50) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de noticias
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(255) NOT NULL,
  contenido TEXT NOT NULL,
  imagen_url VARCHAR(500),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_publicacion TIMESTAMP WITH TIME ZONE,
  publicada BOOLEAN DEFAULT FALSE,
  autor_id UUID REFERENCES usuarios(id),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de categorías de productos
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  imagen_url VARCHAR(500),
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  activo BOOLEAN DEFAULT TRUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS ordenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  cliente_nombre VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(20) NOT NULL,
  cliente_direccion VARCHAR(500) NOT NULL,
  cliente_ciudad VARCHAR(100) NOT NULL,
  productos JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesado')),
  numero_orden VARCHAR(20) UNIQUE,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuración del sitio
CREATE TABLE IF NOT EXISTS configuracion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton_key BOOLEAN NOT NULL DEFAULT TRUE,
  email_fundacion VARCHAR(255),
  telefono_fundacion VARCHAR(20),
  texto_home TEXT,
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE configuracion
  ADD COLUMN IF NOT EXISTS singleton_key BOOLEAN NOT NULL DEFAULT TRUE;

-- ─── Índices ───
CREATE INDEX IF NOT EXISTS idx_noticias_publicada ON noticias(publicada);
CREATE INDEX IF NOT EXISTS idx_noticias_fecha ON noticias(fecha_publicacion DESC);
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- ─── Row Level Security ───
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- ─── Función: obtener rol sin recursión (SECURITY DEFINER omite RLS) ───
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT rol FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ─── Políticas: Usuarios ───
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON usuarios;
DROP POLICY IF EXISTS "Admin puede ver todos los usuarios" ON usuarios;

CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON usuarios FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su perfil"
  ON usuarios FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin puede ver todos los usuarios"
  ON usuarios FOR SELECT USING (get_my_role() = 'admin');

-- ─── Políticas: Noticias ───
DROP POLICY IF EXISTS "Noticias publicadas son públicas" ON noticias;
DROP POLICY IF EXISTS "Admin puede gestionar noticias" ON noticias;

CREATE POLICY "Noticias publicadas son públicas"
  ON noticias FOR SELECT USING (publicada = TRUE);

CREATE POLICY "Admin puede gestionar noticias"
  ON noticias FOR ALL USING (get_my_role() = 'admin');

-- ─── Políticas: Productos ───
DROP POLICY IF EXISTS "Productos activos son públicos" ON productos;
DROP POLICY IF EXISTS "Admin puede gestionar productos" ON productos;

CREATE POLICY "Productos activos son públicos"
  ON productos FOR SELECT USING (activo = TRUE);

CREATE POLICY "Admin puede gestionar productos"
  ON productos FOR ALL USING (get_my_role() = 'admin');

-- ─── Políticas: Categorías ───
DROP POLICY IF EXISTS "Categorías son públicas" ON categorias;
DROP POLICY IF EXISTS "Admin puede gestionar categorías" ON categorias;

CREATE POLICY "Categorías son públicas"
  ON categorias FOR SELECT USING (TRUE);

CREATE POLICY "Admin puede gestionar categorías"
  ON categorias FOR ALL USING (get_my_role() = 'admin');

-- ─── Políticas: Órdenes ───
DROP POLICY IF EXISTS "Usuarios ven sus propias órdenes" ON ordenes;
DROP POLICY IF EXISTS "Admin puede ver todas las órdenes" ON ordenes;
DROP POLICY IF EXISTS "Usuarios autenticados pueden crear órdenes" ON ordenes;
DROP POLICY IF EXISTS "Admin puede actualizar órdenes" ON ordenes;

CREATE POLICY "Usuarios ven sus propias órdenes"
  ON ordenes FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Admin puede ver todas las órdenes"
  ON ordenes FOR SELECT USING (get_my_role() = 'admin');

CREATE POLICY "Usuarios autenticados pueden crear órdenes"
  ON ordenes FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Admin puede actualizar órdenes"
  ON ordenes FOR UPDATE USING (get_my_role() = 'admin');

-- ─── Políticas: Configuración ───
DROP POLICY IF EXISTS "Configuración es pública para lectura" ON configuracion;
DROP POLICY IF EXISTS "Admin puede gestionar configuración" ON configuracion;

CREATE POLICY "Configuración es pública para lectura"
  ON configuracion FOR SELECT USING (TRUE);

CREATE POLICY "Admin puede gestionar configuración"
  ON configuracion FOR ALL USING (get_my_role() = 'admin');

-- ─── Función: crear perfil de usuario automáticamente ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.usuarios (id, email, nombre, foto_perfil)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Función: actualizar timestamp automáticamente ───
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_usuarios_timestamp ON usuarios;
DROP TRIGGER IF EXISTS update_noticias_timestamp ON noticias;
DROP TRIGGER IF EXISTS update_productos_timestamp ON productos;
DROP TRIGGER IF EXISTS update_ordenes_timestamp ON ordenes;
DROP TRIGGER IF EXISTS update_configuracion_timestamp ON configuracion;
CREATE TRIGGER update_usuarios_timestamp BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_noticias_timestamp BEFORE UPDATE ON noticias FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_productos_timestamp BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_ordenes_timestamp BEFORE UPDATE ON ordenes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_configuracion_timestamp BEFORE UPDATE ON configuracion FOR EACH ROW EXECUTE FUNCTION update_updated_at();

WITH ranked_configuracion AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY singleton_key
      ORDER BY actualizado_en DESC, id DESC
    ) AS row_number
  FROM configuracion
)
DELETE FROM configuracion
USING ranked_configuracion
WHERE configuracion.id = ranked_configuracion.id
  AND ranked_configuracion.row_number > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_configuracion_singleton
  ON configuracion (singleton_key);

-- ─── Datos iniciales ───

-- ─── Función: decrementar stock ───
CREATE OR REPLACE FUNCTION decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  IF qty <= 0 THEN
    RAISE EXCEPTION 'La cantidad debe ser mayor a cero';
  END IF;

  UPDATE productos
  SET stock = stock - qty
  WHERE id = product_id
    AND activo = TRUE
    AND stock >= qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Stock insuficiente o producto no disponible';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_order_with_stock_validation(
  p_usuario_id UUID,
  p_cliente_nombre TEXT,
  p_cliente_email TEXT,
  p_cliente_telefono TEXT,
  p_cliente_direccion TEXT,
  p_cliente_ciudad TEXT,
  p_productos JSONB,
  p_numero_orden TEXT
)
RETURNS TABLE(id UUID, numero_orden VARCHAR, total DECIMAL) AS $$
DECLARE
  requested_item JSONB;
  requested_qty INTEGER;
  db_product productos%ROWTYPE;
  normalized_products JSONB := '[]'::JSONB;
  calculated_total DECIMAL := 0;
BEGIN
  IF jsonb_typeof(p_productos) <> 'array' OR jsonb_array_length(p_productos) = 0 THEN
    RAISE EXCEPTION 'El carrito está vacío';
  END IF;

  FOR requested_item IN SELECT * FROM jsonb_array_elements(p_productos)
  LOOP
    requested_qty := COALESCE((requested_item ->> 'cantidad')::INTEGER, 0);

    IF requested_qty <= 0 THEN
      RAISE EXCEPTION 'La cantidad de cada producto debe ser mayor a cero';
    END IF;

    SELECT *
    INTO db_product
    FROM productos
    WHERE id = (requested_item ->> 'id')::UUID
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Uno de los productos ya no existe';
    END IF;

    IF db_product.activo IS NOT TRUE THEN
      RAISE EXCEPTION 'Uno de los productos ya no está disponible';
    END IF;

    IF db_product.stock < requested_qty THEN
      RAISE EXCEPTION 'No hay stock suficiente para uno de los productos';
    END IF;

    UPDATE productos
    SET stock = stock - requested_qty
    WHERE id = db_product.id;

    calculated_total := calculated_total + (db_product.precio * requested_qty);
    normalized_products := normalized_products || jsonb_build_array(
      jsonb_build_object(
        'id', db_product.id,
        'nombre', db_product.nombre,
        'cantidad', requested_qty,
        'precio', db_product.precio
      )
    );
  END LOOP;

  INSERT INTO ordenes (
    usuario_id,
    cliente_nombre,
    cliente_email,
    cliente_telefono,
    cliente_direccion,
    cliente_ciudad,
    productos,
    total,
    numero_orden,
    estado
  )
  VALUES (
    p_usuario_id,
    p_cliente_nombre,
    p_cliente_email,
    p_cliente_telefono,
    p_cliente_direccion,
    p_cliente_ciudad,
    normalized_products,
    calculated_total,
    p_numero_orden,
    'pendiente'
  )
  RETURNING ordenes.id, ordenes.numero_orden, ordenes.total
  INTO id, numero_orden, total;

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Storage: bucket para imágenes ───
-- Ejecutar en Supabase Dashboard > SQL Editor
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  10485760,  -- 10MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Política: cualquier usuario autenticado puede subir
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'media');

-- Política: todos pueden leer (bucket público)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'media');

-- Política: el owner puede eliminar
DROP POLICY IF EXISTS "Owner can delete" ON storage.objects;
CREATE POLICY "Owner can delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'media' AND auth.uid() = owner);

INSERT INTO configuracion (singleton_key, email_fundacion, telefono_fundacion, texto_home)
VALUES (
  TRUE,
  'correntinosclim@gmail.com',
  '+54 379 405 9015',
  'Somos una fundación socioambiental comprometida con la acción climática en la provincia de Corrientes, Argentina.'
)
ON CONFLICT (singleton_key) DO NOTHING;

-- Categorías iniciales
INSERT INTO categorias (nombre, descripcion) VALUES
  ('Remeras', 'Remeras de la fundación'),
  ('Accesorios', 'Accesorios y merchandise'),
  ('Plantines', 'Plantines y semillas nativas')
ON CONFLICT (nombre) DO NOTHING;
