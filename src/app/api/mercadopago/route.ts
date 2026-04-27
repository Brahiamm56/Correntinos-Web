import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, orden_id, payer_email } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items requeridos" }, { status: 400 });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: { nombre: string; precio: number; cantidad: number }, index: number) => ({
          id: String(index + 1),
          title: item.nombre,
          unit_price: item.precio,
          quantity: item.cantidad,
          currency_id: "ARS",
        })),
        payer: payer_email ? { email: payer_email } : undefined,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/exito?orden=${orden_id}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/checkout`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/tienda/exito?orden=${orden_id}&status=pending`,
        },
        auto_return: "approved",
        external_reference: orden_id,
      },
    });

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
    });
  } catch (err) {
    console.error("MercadoPago error:", err);
    return NextResponse.json({ error: "Error al crear preferencia de pago" }, { status: 500 });
  }
}
