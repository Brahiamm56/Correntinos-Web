"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Edit,
  Eye,
  EyeOff,
  Layers,
  PackageCheck,
  Palette,
  Plus,
  Ruler,
  Search,
  ShoppingBag,
  Tag,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { Package } from "reicon-react";
import {
  createCategoria,
  createProducto,
  deleteCategoria,
  deleteProducto,
  getCategorias,
  getProductos,
  toggleProductoActivo,
  updateCategoria,
  updateProducto,
} from "@/app/admin/productos/actions";
import Drawer from "@/components/admin/Drawer";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import type { Categoria, ProductoVariante } from "@/types/database";

interface ProductoAdmin {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  variantes?: ProductoVariante[] | null;
  imagen_url: string | null;
  categoria_id: string | null;
  activo: boolean;
  creado_en: string;
  actualizado_en: string;
  categoria: Categoria | null;
}

type DrawerState = {
  open: boolean;
  mode: "create" | "edit";
  item: ProductoAdmin | null;
};

type VarianteForm = {
  id: string;
  talle: string;
  color: string;
  sku: string;
  stock: string;
};

type ProductForm = {
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  imagen_url: string;
  categoria_id: string;
  activo: boolean;
  stockMode: "simple" | "variantes";
  variantes: VarianteForm[];
};

type DeleteTarget =
  | { type: "product"; id: string; label: string }
  | { type: "category"; id: string; label: string };

const makeVariant = (variant?: Partial<VarianteForm>): VarianteForm => ({
  id: variant?.id || (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `var-${Date.now()}`),
  talle: variant?.talle || "",
  color: variant?.color || "",
  sku: variant?.sku || "",
  stock: variant?.stock || "0",
});

const emptyForm: ProductForm = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagen_url: "",
  categoria_id: "",
  activo: true,
  stockMode: "simple",
  variantes: [makeVariant()],
};

const emptyCategoryForm = { id: "", nombre: "", descripcion: "" };

function cloneEmptyForm(): ProductForm {
  return { ...emptyForm, variantes: [makeVariant()] };
}

function normalizeVariants(variants: VarianteForm[]): ProductoVariante[] {
  return variants
    .map((variant) => ({
      id: variant.id,
      talle: variant.talle.trim(),
      color: variant.color.trim(),
      sku: variant.sku.trim(),
      stock: Math.max(0, Number.parseInt(variant.stock, 10) || 0),
    }))
    .filter((variant) => variant.talle || variant.color || variant.sku || variant.stock > 0);
}

function variantsToForm(variants: ProductoVariante[] | null | undefined) {
  if (!variants?.length) return [makeVariant()];
  return variants.map((variant) =>
    makeVariant({
      id: variant.id,
      talle: variant.talle || "",
      color: variant.color || "",
      sku: variant.sku || "",
      stock: String(variant.stock ?? 0),
    })
  );
}

function categorySuggestsVariants(category?: Categoria | null) {
  return Boolean(category?.nombre.match(/ropa|remera|camiseta|buzo|calzado|zapa|zapatilla|indumentaria/i));
}

function getCreatedCategoryId(result: unknown) {
  if (!result || typeof result !== "object" || !("data" in result)) return "";
  const data = (result as { data?: unknown }).data;
  if (!data || typeof data !== "object" || !("id" in data)) return "";
  const id = (data as { id?: unknown }).id;
  return typeof id === "string" ? id : "";
}

export default function AdminProductosPage() {
  const [productos, setProductos] = useState<ProductoAdmin[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, mode: "create", item: null });
  const [form, setForm] = useState<ProductForm>(cloneEmptyForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [saving, setSaving] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function refreshData() {
    const [{ data: prods }, { data: cats }] = await Promise.all([getProductos(), getCategorias()]);
    setProductos((prods || []) as ProductoAdmin[]);
    setCategorias((cats || []) as Categoria[]);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;

    async function loadData() {
      const [{ data: prods }, { data: cats }] = await Promise.all([getProductos(), getCategorias()]);
      if (!active) return;
      setProductos((prods || []) as ProductoAdmin[]);
      setCategorias((cats || []) as Categoria[]);
      setLoading(false);
    }

    void loadData();
    return () => {
      active = false;
    };
  }, []);

  const selectedCategory = categorias.find((category) => category.id === form.categoria_id) || null;
  const shouldSuggestVariants = categorySuggestsVariants(selectedCategory);
  const normalizedVariants = useMemo(() => normalizeVariants(form.variantes), [form.variantes]);
  const variantsStock = normalizedVariants.reduce((sum, variant) => sum + variant.stock, 0);

  const metrics = useMemo(() => {
    const active = productos.filter((producto) => producto.activo).length;
    const withoutStock = productos.filter((producto) => producto.stock <= 0).length;
    const withVariants = productos.filter((producto) => Boolean(producto.variantes?.length)).length;
    return { active, withoutStock, withVariants };
  }, [productos]);

  const filtered = productos.filter((product) => {
    const q = search.toLowerCase();
    return (
      product.nombre.toLowerCase().includes(q) ||
      product.categoria?.nombre?.toLowerCase().includes(q) ||
      product.variantes?.some((variant) => [variant.talle, variant.color, variant.sku].some((value) => value?.toLowerCase().includes(q)))
    );
  });

  function openCreate() {
    setForm(cloneEmptyForm());
    setSaveError("");
    setDrawer({ open: true, mode: "create", item: null });
  }

  function openEdit(producto: ProductoAdmin) {
    const variants = variantsToForm(producto.variantes);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: String(producto.precio),
      stock: String(producto.stock),
      imagen_url: producto.imagen_url || "",
      categoria_id: producto.categoria_id || "",
      activo: producto.activo,
      stockMode: variants.length > 0 && producto.variantes?.length ? "variantes" : "simple",
      variantes: variants,
    });
    setSaveError("");
    setDrawer({ open: true, mode: "edit", item: producto });
  }

  function closeDrawer() {
    setDrawer((current) => ({ ...current, open: false }));
  }

  function updateCategorySelection(categoryId: string) {
    const category = categorias.find((item) => item.id === categoryId);
    setForm((current) => ({
      ...current,
      categoria_id: categoryId,
      stockMode: categorySuggestsVariants(category) ? "variantes" : current.stockMode,
      variantes: current.variantes.length ? current.variantes : [makeVariant()],
    }));
  }

  function updateVariant(id: string, key: keyof VarianteForm, value: string) {
    setForm((current) => ({
      ...current,
      variantes: current.variantes.map((variant) => (variant.id === id ? { ...variant, [key]: value } : variant)),
    }));
  }

  function addVariant() {
    setForm((current) => ({ ...current, variantes: [...current.variantes, makeVariant()] }));
  }

  function removeVariant(id: string) {
    setForm((current) => ({
      ...current,
      variantes: current.variantes.length <= 1 ? [makeVariant()] : current.variantes.filter((variant) => variant.id !== id),
    }));
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!form.nombre.trim() || !form.precio) {
      setSaveError("Nombre y precio son obligatorios");
      return;
    }

    const useVariants = form.stockMode === "variantes";
    const variants = useVariants ? normalizedVariants : [];
    if (useVariants && variants.length === 0) {
      setSaveError("Agregá al menos una variante con talle, color, SKU o stock");
      return;
    }

    setSaving(true);
    setSaveError("");

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: Number.parseFloat(form.precio),
      stock: useVariants ? variantsStock : Number.parseInt(form.stock, 10) || 0,
      variantes: variants,
      imagen_url: form.imagen_url || null,
      categoria_id: form.categoria_id || null,
      activo: form.activo,
    };

    const result =
      drawer.mode === "create"
        ? await createProducto(payload)
        : drawer.item
          ? await updateProducto(drawer.item.id, payload)
          : { error: "No se encontró el producto" };

    if (result.error) {
      setSaveError(result.error);
      setSaving(false);
      return;
    }

    await refreshData();
    closeDrawer();
    setSaving(false);
  }

  async function handleCategorySave(event: FormEvent) {
    event.preventDefault();
    const nombre = categoryForm.nombre.trim();
    if (!nombre) {
      setCategoryError("Ingresá un nombre de categoría");
      return;
    }

    setSavingCategory(true);
    setCategoryError("");

    const payload = { nombre, descripcion: categoryForm.descripcion.trim() || null };
    const result = categoryForm.id ? await updateCategoria(categoryForm.id, payload) : await createCategoria(payload);

    if (result.error) {
      setCategoryError(result.error);
      setSavingCategory(false);
      return;
    }

    const createdCategoryId = !categoryForm.id ? getCreatedCategoryId(result) : "";
    await refreshData();
    if (createdCategoryId) {
      setForm((current) => ({ ...current, categoria_id: createdCategoryId }));
    }
    setCategoryForm(emptyCategoryForm);
    setSavingCategory(false);
  }

  async function handleToggle(id: string, activo: boolean) {
    const result = await toggleProductoActivo(id, activo);
    if (result.error) {
      setSaveError(result.error);
      return;
    }
    setProductos((prev) => prev.map((product) => (product.id === id ? { ...product, activo: !activo } : product)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = deleteTarget.type === "product"
      ? await deleteProducto(deleteTarget.id)
      : await deleteCategoria(deleteTarget.id);
    if (result.error) {
      if (deleteTarget.type === "product") setSaveError(result.error);
      else setCategoryError(result.error);
      setDeleting(false);
      setDeleteTarget(null);
      return;
    }
    if (deleteTarget.type === "product") {
      setProductos((prev) => prev.filter((product) => product.id !== deleteTarget.id));
    } else {
      await refreshData();
    }
    setDeleting(false);
    setDeleteTarget(null);
  }

  const inputClass = "w-full border border-gray-300 px-4 py-3 text-sm transition-colors focus:border-[var(--verde-hoja)] focus:outline-none";

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gray-300 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-gray-500">Tienda</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-950">Productos</h1>
            <p className="mt-0.5 text-sm text-gray-400">Inventario, categorías y variantes de tienda</p>
          </div>
          <button onClick={openCreate} className="inline-flex min-h-11 items-center gap-2 bg-[var(--verde-profundo)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--verde-selva)]">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </button>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4">
          <div className="border-b border-gray-200 py-5 sm:px-5"><ShoppingBag className="mb-3 h-5 w-5 text-[var(--verde-hoja)]" /><p className="text-2xl font-bold text-gray-900">{productos.length}</p><p className="text-sm text-gray-500">Productos cargados</p></div>
          <div className="border-b border-gray-200 py-5 sm:border-l sm:px-5"><PackageCheck className="mb-3 h-5 w-5 text-[var(--verde-hoja)]" /><p className="text-2xl font-bold text-gray-900">{metrics.active}</p><p className="text-sm text-gray-500">Visibles en tienda</p></div>
          <div className="border-b border-gray-200 py-5 sm:px-5 xl:border-l"><Layers className="mb-3 h-5 w-5 text-[var(--verde-hoja)]" /><p className="text-2xl font-bold text-gray-900">{metrics.withVariants}</p><p className="text-sm text-gray-500">Con talles o colores</p></div>
          <div className="border-b border-gray-200 py-5 sm:border-l sm:px-5"><AlertTriangle className="mb-3 h-5 w-5 text-red-600" /><p className="text-2xl font-bold text-gray-900">{metrics.withoutStock}</p><p className="text-sm text-gray-500">Sin stock</p></div>
        </div>

        <section className="border-y border-gray-300 bg-white py-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-base font-bold text-gray-900">Categorías de productos</h2><p className="text-sm text-gray-400">Creá categorías y usalas al cargar productos.</p></div>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500"><Tags className="h-4 w-4" />{categorias.length} categorías</span>
          </div>

          <form onSubmit={handleCategorySave} className="grid gap-3 lg:grid-cols-[1fr_1.3fr_auto]">
            <input type="text" value={categoryForm.nombre} onChange={(event) => setCategoryForm((current) => ({ ...current, nombre: event.target.value }))} placeholder="Nombre de categoría" className={inputClass} />
            <input type="text" value={categoryForm.descripcion} onChange={(event) => setCategoryForm((current) => ({ ...current, descripcion: event.target.value }))} placeholder="Descripción opcional" className={inputClass} />
            <div className="flex gap-2">
              <button type="submit" disabled={savingCategory} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--verde-profundo)] px-4 text-sm font-medium text-white transition-colors hover:bg-[var(--verde-selva)] disabled:opacity-50 lg:flex-none">
                <Tag className="h-4 w-4" />{savingCategory ? "Guardando..." : categoryForm.id ? "Guardar" : "Crear"}
              </button>
              {categoryForm.id && <button type="button" onClick={() => setCategoryForm(emptyCategoryForm)} className="grid min-h-11 w-11 place-items-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50" aria-label="Cancelar edición"><X className="h-4 w-4" /></button>}
            </div>
          </form>

          {categoryError && <p role="alert" className="mt-3 border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{categoryError}</p>}

          <div className="mt-5 divide-y divide-gray-200 border-t border-gray-200">
            {categorias.map((category) => (
              <div key={category.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div><span className="font-medium text-gray-800">{category.nombre}</span>{category.descripcion && <p className="mt-0.5 text-xs text-gray-500">{category.descripcion}</p>}</div>
                <div className="flex items-center gap-2">
                <button type="button" onClick={() => setCategoryForm({ id: category.id, nombre: category.nombre, descripcion: category.descripcion || "" })} className="text-gray-400 transition-colors hover:text-blue-600" aria-label={`Editar ${category.nombre}`}><Edit className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => setDeleteTarget({ type: "category", id: category.id, label: category.nombre })} className="text-gray-400 transition-colors hover:text-red-600" aria-label={`Eliminar ${category.nombre}`}><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre, categoría, talle, color o SKU..." value={search} onChange={(event) => setSearch(event.target.value)} className="w-full border-b border-gray-300 bg-transparent py-3 pl-10 pr-4 text-sm focus:border-[var(--verde-hoja)] focus:outline-none" />
        </div>
        {saveError && !drawer.open && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>}

        <div className="overflow-hidden border-t border-gray-300 bg-white">
          {loading ? (
            <div className="p-12 text-center"><div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-[var(--verde-hoja)] border-t-transparent" /><p className="text-sm text-gray-400">Cargando...</p></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center"><ShoppingBag className="mx-auto mb-3 h-10 w-10 text-gray-200" /><p className="text-gray-400">{search ? "Sin resultados." : "No hay productos. Creá el primero."}</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100"><th className="p-4 text-left font-medium text-gray-500">Producto</th><th className="hidden p-4 text-left font-medium text-gray-500 md:table-cell">Categoría</th><th className="hidden p-4 text-right font-medium text-gray-500 sm:table-cell">Precio</th><th className="hidden p-4 text-right font-medium text-gray-500 sm:table-cell">Stock</th><th className="hidden p-4 text-left font-medium text-gray-500 lg:table-cell">Variantes</th><th className="hidden p-4 text-center font-medium text-gray-500 sm:table-cell">Estado</th><th className="p-4 text-right font-medium text-gray-500">Acciones</th></tr></thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/60">
                    <td className="p-4"><div className="flex items-center gap-3"><div className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-gray-100">{product.imagen_url ? <Image src={product.imagen_url} alt={product.nombre} fill className="object-cover" unoptimized /> : <div className="flex h-full w-full items-center justify-center text-[var(--verde-hoja)]"><Package size={21} /></div>}</div><div><p className="line-clamp-1 font-medium">{product.nombre}</p>{product.descripcion && <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{product.descripcion}</p>}<p className="mt-1 text-xs text-gray-500 sm:hidden">${Number(product.precio).toLocaleString("es-AR")} · Stock {product.stock} · {product.activo ? "Activo" : "Inactivo"}</p></div></div></td>
                    <td className="hidden p-4 text-gray-400 md:table-cell">{product.categoria?.nombre || "Sin categoría"}</td>
                    <td className="hidden p-4 text-right font-medium sm:table-cell">${Number(product.precio).toLocaleString("es-AR")}</td>
                    <td className="hidden p-4 text-right sm:table-cell"><span className={`inline-flex items-center gap-1 font-medium ${product.stock <= 5 ? "text-red-500" : "text-gray-700"}`}>{product.stock <= 5 && <AlertTriangle className="h-3 w-3" />}{product.stock}</span></td>
                    <td className="hidden p-4 text-gray-400 lg:table-cell">{product.variantes?.length ? `${product.variantes.length} variante${product.variantes.length === 1 ? "" : "s"}` : "Stock simple"}</td>
                    <td className="hidden p-4 text-center sm:table-cell"><button onClick={() => void handleToggle(product.id, product.activo)} className={`inline-flex items-center gap-1.5 border-b px-1 py-1 text-xs font-semibold transition-colors ${product.activo ? "border-green-600 text-green-700" : "border-gray-400 text-gray-500"}`}>{product.activo ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{product.activo ? "Activo" : "Inactivo"}</button></td>
                    <td className="p-4"><div className="flex items-center justify-end gap-1"><button onClick={() => openEdit(product)} title="Editar" aria-label={`Editar ${product.nombre}`} className="p-2 text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-700"><Edit className="h-4 w-4" /></button><button onClick={() => setDeleteTarget({ type: "product", id: product.id, label: product.nombre })} title="Eliminar" aria-label={`Eliminar ${product.nombre}`} className="p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Drawer open={drawer.open} onClose={closeDrawer} title={drawer.mode === "create" ? "Nuevo producto" : "Editar producto"} side="right" width="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div><label className="mb-2 block text-sm font-medium text-gray-700">Imagen del producto</label><ImageUpload value={form.imagen_url} onChange={(url) => setForm((current) => ({ ...current, imagen_url: url }))} aspectRatio="1/1" /></div>

          <div><label htmlFor="p-nombre" className="mb-1.5 block text-sm font-medium text-gray-700">Nombre <span className="text-red-500">*</span></label><input id="p-nombre" type="text" required value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} className={inputClass} placeholder="Nombre del producto" /></div>

          <div><label htmlFor="p-desc" className="mb-1.5 block text-sm font-medium text-gray-700">Descripción</label><textarea id="p-desc" value={form.descripcion} onChange={(event) => setForm((current) => ({ ...current, descripcion: event.target.value }))} rows={3} className={inputClass} placeholder="Descripción breve del producto..." /></div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div><label htmlFor="p-precio" className="mb-1.5 block text-sm font-medium text-gray-700">Precio ($) <span className="text-red-500">*</span></label><input id="p-precio" type="number" required min="0" step="0.01" value={form.precio} onChange={(event) => setForm((current) => ({ ...current, precio: event.target.value }))} className={inputClass} placeholder="0.00" /></div>
            <div><label htmlFor="p-cat" className="mb-1.5 block text-sm font-medium text-gray-700">Categoría</label><select id="p-cat" value={form.categoria_id} onChange={(event) => updateCategorySelection(event.target.value)} className={inputClass}><option value="">Sin categoría</option>{categorias.map((category) => <option key={category.id} value={category.id}>{category.nombre}</option>)}</select></div>
          </div>

          <section className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div><h3 className="text-sm font-bold text-gray-900">Stock y variantes</h3><p className="text-xs text-gray-500">Para ropa o calzado podés cargar stock por talle, color y SKU.</p></div>
              {shouldSuggestVariants && <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Ruler className="h-3.5 w-3.5" />Categoría con variantes sugeridas</span>}
            </div>

            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => setForm((current) => ({ ...current, stockMode: "simple" }))} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${form.stockMode === "simple" ? "border-[var(--verde-hoja)] bg-white text-[var(--verde-profundo)]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}><PackageCheck className="h-4 w-4" />Stock simple</button>
              <button type="button" onClick={() => setForm((current) => ({ ...current, stockMode: "variantes", variantes: current.variantes.length ? current.variantes : [makeVariant()] }))} className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${form.stockMode === "variantes" ? "border-[var(--verde-hoja)] bg-white text-[var(--verde-profundo)]" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"}`}><Layers className="h-4 w-4" />Talles y colores</button>
            </div>

            {form.stockMode === "simple" ? (
              <div><label htmlFor="p-stock" className="mb-1.5 block text-sm font-medium text-gray-700">Stock total</label><input id="p-stock" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} className={inputClass} /></div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_1fr_1fr_5rem_2.5rem] gap-2 text-xs font-semibold uppercase text-gray-400"><span>Talle</span><span>Color</span><span>SKU</span><span>Stock</span><span /></div>
                {form.variantes.map((variant) => (
                  <div key={variant.id} className="grid grid-cols-[1fr_1fr_1fr_5rem_2.5rem] gap-2">
                    <div className="relative"><Ruler className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" /><input value={variant.talle} onChange={(event) => updateVariant(variant.id, "talle", event.target.value)} placeholder="M / 39" className={`${inputClass} pl-9`} /></div>
                    <div className="relative"><Palette className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-300" /><input value={variant.color} onChange={(event) => updateVariant(variant.id, "color", event.target.value)} placeholder="Verde" className={`${inputClass} pl-9`} /></div>
                    <input value={variant.sku} onChange={(event) => updateVariant(variant.id, "sku", event.target.value)} placeholder="SKU" className={inputClass} />
                    <input type="number" min="0" value={variant.stock} onChange={(event) => updateVariant(variant.id, "stock", event.target.value)} className={inputClass} />
                    <button type="button" onClick={() => removeVariant(variant.id)} className="grid min-h-11 place-items-center rounded-lg border border-gray-200 bg-white text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600" aria-label="Eliminar variante"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"><button type="button" onClick={addVariant} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--verde-profundo)]"><Plus className="h-4 w-4" />Agregar variante</button><p className="text-sm text-gray-500">Stock total: <strong className="text-gray-900">{variantsStock}</strong></p></div>
              </div>
            )}
          </section>

          <label className="flex cursor-pointer select-none items-center gap-3"><button type="button" role="switch" aria-checked={form.activo} onClick={() => setForm((current) => ({ ...current, activo: !current.activo }))} className={`relative h-5 w-10 flex-shrink-0 rounded-full transition-colors ${form.activo ? "bg-[var(--verde-hoja)]" : "bg-gray-200"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-5" : "translate-x-0.5"}`} /></button><span className="text-sm font-medium text-gray-700">{form.activo ? "Visible en la tienda" : "Oculto en la tienda"}</span></label>

          {saveError && <p role="alert" className="border-l-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700">{saveError}</p>}

          <div className="flex gap-3 pb-4 pt-2">
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-[var(--verde-profundo)] py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--verde-selva)] disabled:opacity-50">{saving ? "Guardando..." : drawer.mode === "create" ? "Crear producto" : "Guardar cambios"}</button>
            <button type="button" onClick={closeDrawer} className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">Cancelar</button>
          </div>
        </form>
      </Drawer>
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget?.type === "category" ? "Eliminar categoría" : "Eliminar producto"}
        description={deleteTarget?.type === "category" ? `Vas a eliminar “${deleteTarget.label}”. Los productos asociados quedarán sin categoría.` : `Vas a eliminar “${deleteTarget?.label ?? "este producto"}”. Esta acción no se puede deshacer.`}
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </>
  );
}
