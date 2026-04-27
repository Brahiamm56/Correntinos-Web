import { NextRequest, NextResponse } from "next/server";
import {
  AuthorizationError,
  createServiceClient,
  getAuthenticatedUser,
} from "@/lib/supabase/server";

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

async function validateProductsAgainstDatabase(
  requestedProducts: IncomingOrderProduct[]
) {
  const serviceClient = await createServiceClient();
  const productIds = requestedProducts.map((item) => item.id);
  const { data, error } = await serviceClient
    .from("productos")
    .select("id, nombre, precio, stock, activo")
    .in("id", productIds);

  if (error) {
    return {
      error: "No se pudo validar el stock de los productos",
      data: null,
    };
  }

  const dbProducts = new Map((data ?? []).map((product) => [product.id, product]));
  const validatedProducts: ValidatedOrderProduct[] = [];

  for (const requestedProduct of requestedProducts) {
    const dbProduct = dbProducts.get(requestedProduct.id);

    if (!dbProduct) {
      return {
        error: "Uno de los productos ya no existe",
        data: null,
      };
    }

    if (!dbProduct.activo) {
      return {
        error: `El producto \"${dbProduct.nombre}\" ya no está disponible`,
        data: null,
      };
    }

    if (dbProduct.stock < requestedProduct.cantidad) {
      return {
        error: `No hay stock suficiente para \"${dbProduct.nombre}\"`,
        data: null,
      };
    }

    validatedProducts.push({
      id: dbProduct.id,
      nombre: dbProduct.nombre,
      cantidad: requestedProduct.cantidad,
      precio: Number(dbProduct.precio),
    });
  }

  return { error: null, data: validatedProducts };
}

async function createOrderWithValidatedProducts({
  userId,
  cliente_nombre,
  cliente_email,
  cliente_telefono,
  cliente_direccion,
  cliente_ciudad,
  productos,
  numero_orden,
}: {
  userId: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  productos: ValidatedOrderProduct[];
  numero_orden: string;
}) {
  const serviceClient = await createServiceClient();

  const { data, error } = await serviceClient.rpc(
    "create_order_with_stock_validation",
    {
      p_usuario_id: userId,
      p_cliente_nombre: cliente_nombre,
      p_cliente_email: cliente_email,
      p_cliente_telefono: cliente_telefono,
      p_cliente_direccion: cliente_direccion,
      p_cliente_ciudad: cliente_ciudad,
      p_productos: productos.map(({ id, cantidad }) => ({ id, cantidad })),
      p_numero_orden: numero_orden,
    }
  );

  if (error?.code === "PGRST202") {
    return { error: null, data: null, needsFallback: true as const };
  }

  if (error) {
    return {
      error: error.message || "No se pudo crear la orden",
      data: null,
      needsFallback: false as const,
    };
  }

  const createdOrder = Array.isArray(data) ? data[0] : data;

  return {
    error: null,
    data: createdOrder
      ? {
          id: createdOrder.id,
          numero_orden: createdOrder.numero_orden,
          total: Number(createdOrder.total),
        }
      : null,
    needsFallback: false as const,
  };
}

async function createOrderFallback({
  userId,
  cliente_nombre,
  cliente_email,
  cliente_telefono,
  cliente_direccion,
  cliente_ciudad,
  productos,
  numero_orden,
}: {
  userId: string;
  cliente_nombre: string;
  cliente_email: string;
  cliente_telefono: string;
  cliente_direccion: string;
  cliente_ciudad: string;
  productos: ValidatedOrderProduct[];
  numero_orden: string;
}) {
  const serviceClient = await createServiceClient();
  const total = productos.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const { data: orden, error } = await serviceClient
    .from("ordenes")
    .insert({
      usuario_id: userId,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      cliente_direccion,
      cliente_ciudad,
      productos,
      total,
      numero_orden,
      estado: "pendiente",
    })
    .select("id, numero_orden, total")
    .single();

  if (error) {
    return { error: "Error al crear la orden", data: null };
  }

  for (const item of productos) {
    const { error: stockError } = await serviceClient.rpc("decrement_stock", {
      product_id: item.id,
      qty: item.cantidad,
    });

    if (stockError) {
      await serviceClient.from("ordenes").delete().eq("id", orden.id);
      return {
        error: `No se pudo actualizar el stock de \"${item.nombre}\"`,
        data: null,
      };
    }
  }

  return {
    error: null,
    data: {
      id: orden.id,
      numero_orden: orden.numero_orden,
      total: Number(orden.total),
    },
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

    const validatedProducts = await validateProductsAgainstDatabase(
      requestedProducts.data
    );
    if (validatedProducts.error || !validatedProducts.data) {
      return NextResponse.json({ error: validatedProducts.error }, { status: 400 });
    }

    const calculatedTotal = validatedProducts.data.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );

    if (Math.abs(calculatedTotal - total) > 0.01) {
      return NextResponse.json(
        {
          error:
            "El total del pedido cambió. Actualizá el carrito y volvé a intentarlo.",
        },
        { status: 409 }
      );
    }

    const user = await getAuthenticatedUser();

    // Generate order number
    const numero_orden = `ORD-${Date.now().toString().slice(-10)}`;

    const rpcOrderResult = await createOrderWithValidatedProducts({
      userId: user.id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      cliente_direccion,
      cliente_ciudad,
      productos: validatedProducts.data,
      numero_orden,
    });

    let createdOrder = rpcOrderResult.data;

    if (rpcOrderResult.error) {
      console.error("Error creating order with RPC:", rpcOrderResult.error);
      return NextResponse.json(
        { error: rpcOrderResult.error },
        { status: 500 }
      );
    }

    if (rpcOrderResult.needsFallback) {
      const fallbackOrderResult = await createOrderFallback({
        userId: user.id,
        cliente_nombre,
        cliente_email,
        cliente_telefono,
        cliente_direccion,
        cliente_ciudad,
        productos: validatedProducts.data,
        numero_orden,
      });

      if (fallbackOrderResult.error || !fallbackOrderResult.data) {
        return NextResponse.json(
          { error: fallbackOrderResult.error ?? "Error al crear la orden" },
          { status: 500 }
        );
      }

      createdOrder = fallbackOrderResult.data;
    }

    // TODO: Send confirmation email (stub for now)
    // await sendOrderConfirmationEmail(orden);

    return NextResponse.json({
      id: createdOrder?.id,
      numero_orden: createdOrder?.numero_orden,
      total: createdOrder?.total ?? calculatedTotal,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
