import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { ordenes, productos as productosTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

type IncomingOrderProduct = {
  id: string;
  cantidad: number;
};

type ValidatedOrderProduct = IncomingOrderProduct & {
  nombre: string;
  precio: number;
};

function normalizeTextField(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRequestedProducts(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    return { error: "El carrito está vacío", data: null };
  }

  const quantities = new Map<string, number>();

  for (const item of value) {
    if (!item || typeof item !== "object") {
      return { error: "Los productos enviados son inválidos", data: null };
    }

    const { id, cantidad } = item as Partial<IncomingOrderProduct>;
    const normalizedId = typeof id === "string" ? id.trim() : "";
    const normalizedQuantity = Number(cantidad);

    if (!normalizedId || !Number.isInteger(normalizedQuantity) || normalizedQuantity <= 0) {
      return { error: "Los productos enviados son inválidos", data: null };
    }

    quantities.set(normalizedId, (quantities.get(normalizedId) ?? 0) + normalizedQuantity);
  }

  return {
    error: null,
    data: Array.from(quantities.entries()).map(([id, cantidad]) => ({ id, cantidad })),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cliente_nombre = normalizeTextField(body.cliente_nombre);
    const cliente_email = normalizeTextField(body.cliente_email);
    const cliente_telefono = normalizeTextField(body.cliente_telefono);
    const cliente_direccion = normalizeTextField(body.cliente_direccion);
    const cliente_ciudad = normalizeTextField(body.cliente_ciudad);
    const total = Number(body.total);

    // Validate required fields
    if (!cliente_nombre || !cliente_email || !cliente_telefono || !cliente_direccion || !cliente_ciudad) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    const requestedProducts = normalizeRequestedProducts(body.productos);
    if (requestedProducts.error || !requestedProducts.data) {
      return NextResponse.json({ error: requestedProducts.error }, { status: 400 });
    }

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Total inválido" }, { status: 400 });
    }

    // Authenticate user via Better Auth
    const session = await auth.api.getSession({ headers: request.headers });
    const userId = session?.user?.id ?? null;

    // Validate stock and price with Neon DB
    const productIds = requestedProducts.data.map((item) => item.id);
    const dbProducts = await db
      .select({
        id: productosTable.id,
        nombre: productosTable.nombre,
        precio: productosTable.precio,
        stock: productosTable.stock,
        activo: productosTable.activo,
      })
      .from(productosTable)
      .where(inArray(productosTable.id, productIds));

    const dbProductsMap = new Map(dbProducts.map((p) => [p.id, p]));
    const validatedProducts: ValidatedOrderProduct[] = [];

    for (const requested of requestedProducts.data) {
      const dbProd = dbProductsMap.get(requested.id);
      if (!dbProd) {
        return NextResponse.json({ error: "Uno de los productos ya no existe" }, { status: 400 });
      }
      if (!dbProd.activo) {
        return NextResponse.json({ error: `El producto "${dbProd.nombre}" ya no está disponible` }, { status: 400 });
      }
      if ((dbProd.stock ?? 0) < requested.cantidad) {
        return NextResponse.json({ error: `No hay stock suficiente para "${dbProd.nombre}"` }, { status: 400 });
      }

      validatedProducts.push({
        id: dbProd.id,
        nombre: dbProd.nombre,
        cantidad: requested.cantidad,
        precio: Number(dbProd.precio),
      });
    }

    const calculatedTotal = validatedProducts.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );

    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        { error: "El total del pedido cambió. Actualizá el carrito y volvé a intentarlo." },
        { status: 409 }
      );
    }

    const numero_orden = `ORD-${Date.now().toString().slice(-10)}`;

    // Create order
    const [createdOrder] = await db
      .insert(ordenes)
      .values({
        usuario_id: userId,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        cliente_direccion,
        cliente_ciudad,
        productos: validatedProducts,
        total: calculatedTotal.toString(),
        numero_orden,
        estado: "pendiente",
      })
      .returning({
        id: ordenes.id,
        numero_orden: ordenes.numero_orden,
        total: ordenes.total,
      });

    // Update stock
    for (const item of validatedProducts) {
      const currentStock = dbProductsMap.get(item.id)?.stock ?? 0;
      await db
        .update(productosTable)
        .set({ stock: Math.max(0, currentStock - item.cantidad) })
        .where(eq(productosTable.id, item.id));
    }

    return NextResponse.json(
      {
        id: createdOrder.id,
        numero_orden: createdOrder.numero_orden,
        total: Number(createdOrder.total),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al procesar orden:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
