export interface Usuario {
  id: string;
  email: string;
  nombre: string | null;
  foto_perfil: string | null;
  rol: "usuario" | "admin";
  creado_en: string;
  actualizado_en: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  contenido: string;
  imagen_url: string | null;
  fecha_creacion: string;
  fecha_publicacion: string | null;
  publicada: boolean;
  autor_id: string | null;
  actualizado_en: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  imagen_url: string | null;
  categoria_id: string | null;
  categoria?: Categoria;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface OrdenProducto {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Orden {
  id: string;
  usuario_id: string | null;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  productos: OrdenProducto[];
  total: number;
  estado: "pendiente" | "procesado";
  numero_orden: string;
  creado_en: string;
  actualizado_en: string;
}

export interface Configuracion {
  id: string;
  email_fundacion: string | null;
  telefono_fundacion: string | null;
  texto_home: string | null;
  actualizado_en: string;
}
