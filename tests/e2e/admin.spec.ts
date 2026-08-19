import { expect, test } from "@playwright/test";

test("las rutas privadas redirigen al acceso sin una sesión", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fadmin|\/auth\/login\?redirect=\/admin/);
});

test("el acceso administrativo conserva el destino solicitado", async ({ page }) => {
  await page.goto("/admin/productos");
  await expect(page).toHaveURL(/\/auth\/login\?redirect=%2Fadmin%2Fproductos|\/auth\/login\?redirect=\/admin\/productos/);
  await expect(page.getByRole("heading", { name: "Iniciar Sesión" })).toBeVisible();
});
