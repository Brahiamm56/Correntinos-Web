import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/quienes-somos",
  "/noticias",
  "/donaciones",
  "/contacto",
  "/trabaja-con-nosotros",
  "/tienda",
  "/auth/login",
  "/auth/register",
];

const viewports = [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test.describe("experiencia pública", () => {
  for (const route of publicRoutes) {
    test(`${route} tiene estructura y ancho móvil correctos`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      await expect(page.locator("h1")).toHaveCount(1);
      expect((await page.title()).trim().length).toBeGreaterThan(0);
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        const dimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }));
        expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
      }
    });
  }

  test("el logo real carga en la cabecera", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const logo = page.locator('header img[src*="correntinos-logo.png"]');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  });

  test("el carrito guardado se restaura sin romper la hidratación", async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && message.text().includes("Hydration failed")) {
        hydrationErrors.push(message.text());
      }
    });
    await page.addInitScript(() => {
      localStorage.setItem("correntinos-cart", JSON.stringify([
        { id: "prueba", nombre: "Producto de prueba", precio: 1, cantidad: 2, imagen_url: null, stock: 4 },
      ]));
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator('header a[aria-label="Ver carrito"] span')).toHaveText("2");
    expect(hydrationErrors).toEqual([]);
  });

  test("el inicio conserva una secuencia narrativa clara", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#hero h1")).toBeVisible();
    await expect(page.locator("#hero img").first()).toBeVisible();
    const ids = ["mision", "areas-de-impacto", "impacto-numeros", "ultimas-noticias", "donar"];
    const positions = await page.evaluate((sectionIds) =>
      sectionIds.map((id) => document.getElementById(id)?.offsetTop ?? -1), ids);
    expect(positions.every((position) => position >= 0)).toBeTruthy();
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  test("el menú móvil contiene el foco y devuelve el control", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const toggle = page.getByRole("button", { name: "Abrir menú" });
    await expect(toggle).toHaveAttribute("data-navigation-ready", "true");
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Navegación principal" });
    await expect(dialog).toBeVisible();
    expect(await dialog.locator("[data-menu-first]").evaluate((element) => document.activeElement === element)).toBeTruthy();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(await toggle.evaluate((element) => document.activeElement === element)).toBeTruthy();
  });

  test("el contenido esencial permanece visible con movimiento reducido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#hero h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Resultados que vuelven al territorio." })).toBeVisible();
  });

  test("donaciones explica el paso real antes de continuar", async ({ page }) => {
    await page.goto("/donaciones", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Este sitio todavía no procesa pagos en línea.")).toBeVisible();
    const contributionLink = page.getByRole("link", { name: "Coordinar mi aporte" });
    await expect(contributionLink).toHaveAttribute("href", /wa\.me/);
  });

  test("las páginas principales no tienen problemas graves de accesibilidad", async ({ page }) => {
    for (const route of ["/", "/donaciones", "/contacto"]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const results = await new AxeBuilder({ page }).analyze();
      const serious = results.violations.filter((violation) =>
        violation.impact === "serious" || violation.impact === "critical");
      expect(serious, `${route}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
    }
  });
});
