"use client";

import { useState } from "react";
import { ArrowRight, Envelope, Leaf, Phone, ShieldCheck } from "reicon-react";

const amounts = ["1.000", "5.000", "10.000", "25.000"];

const destinations = [
  {
    title: "Educación ambiental",
    text: "Talleres, materiales y experiencias para acercar la agenda climática a más comunidades.",
  },
  {
    title: "Acción en territorio",
    text: "Proyectos vinculados con biodiversidad, humedales y fortalecimiento de redes locales.",
  },
  {
    title: "Incidencia y articulación",
    text: "Investigación, alianzas y participación en espacios donde se deciden políticas ambientales.",
  },
];

export default function DonacionesClient({ email, phone }: { email: string; phone: string }) {
  const [selected, setSelected] = useState("5.000");
  const [custom, setCustom] = useState("");
  const finalAmount = selected === "Otro" ? custom.trim() : selected;
  const message = finalAmount
    ? `Hola, quiero coordinar un aporte de $${finalAmount} para la fundación.`
    : "Hola, quiero coordinar un aporte para la fundación.";
  const phoneHref = phone.replace(/[^+\d]/g, "");
  const whatsappHref = `https://wa.me/${phoneHref.replace("+", "")}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-[var(--papel)] pt-[4.75rem]">
      <section className="section-container !pb-16 !pt-12 sm:!pb-20 sm:!pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:items-end">
          <div className="max-w-3xl">
            <p className="section-label">Aportes individuales</p>
            <h1>Sostener la acción climática también es participar.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--gris-calido)]">
              Elegí una referencia o escribí el monto que quieras aportar. Al continuar, abrís una
              conversación con el equipo para conocer los medios disponibles y coordinar la contribución.
            </p>
          </div>
          <p className="border-t border-[var(--border-strong)] pt-5 text-sm leading-relaxed text-[var(--gris-calido)]">
            Este sitio todavía no procesa pagos en línea. Ningún monto se debita desde esta pantalla.
          </p>
        </div>

        <fieldset className="mt-12 border-y border-[var(--border-strong)] py-2">
          <legend className="sr-only">Elegí un monto de referencia</legend>
          <div role="radiogroup" aria-label="Monto de referencia" className="grid sm:grid-cols-4">
            {amounts.map((amount, index) => {
              const active = selected === amount;
              return (
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  key={amount}
                  onClick={() => {
                    setSelected(amount);
                    setCustom("");
                  }}
                  className={`min-h-20 border-b px-4 py-5 text-left transition-colors sm:border-b-0 sm:text-center ${
                    index > 0 ? "sm:border-l sm:border-[var(--border)]" : ""
                  } ${active ? "text-[var(--verde-profundo)]" : "text-[var(--gris-calido)] hover:text-[var(--verde-profundo)]"}`}
                >
                  <span className="block text-xs font-extrabold uppercase tracking-[0.12em]">
                    {active ? "Seleccionado" : "Aporte"}
                  </span>
                  <span className="mt-1 block text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                    ${amount}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block max-w-xl text-sm font-bold text-[var(--verde-profundo)]">
            Otro monto
            <span className="relative mt-2 block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gris-calido)]">$</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9.]*"
                autoComplete="off"
                placeholder="Ingresá un monto"
                value={custom}
                onChange={(event) => {
                  setCustom(event.target.value.replace(/[^0-9.]/g, ""));
                  setSelected("Otro");
                }}
                className="field pl-8"
              />
            </span>
          </label>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="action-primary"
          >
            Coordinar mi aporte <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="dark-section">
        <div className="section-container !py-16 sm:!py-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="section-label !text-[var(--dorado-suave)]">Destino del apoyo</p>
              <h2 className="!text-white">Recursos para sostener trabajo de largo plazo.</h2>
              <p className="mt-5 text-white/70">
                El destino concreto se comunica al coordinar cada aporte. No asignamos equivalencias
                automáticas que puedan generar expectativas difíciles de comprobar.
              </p>
            </div>
            <div className="divide-y divide-white/20 border-y border-white/20">
              {destinations.map((destination) => (
                <div key={destination.title} className="grid gap-2 py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <h3 className="!text-lg !text-white">{destination.title}</h3>
                  <p className="text-sm leading-relaxed text-white/68">{destination.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white">
        <div className="section-container grid gap-10 !py-14 md:grid-cols-3">
          <div>
            <ShieldCheck size={25} className="text-[var(--verde-hoja)]" />
            <h2 className="mt-5 !text-2xl">Antes de aportar</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--gris-calido)]">
              Podés consultar el medio de pago, el destino previsto y cualquier duda directamente con el equipo.
            </p>
          </div>
          <div>
            <Leaf size={25} className="text-[var(--verde-hoja)]" />
            <h2 className="mt-5 !text-2xl">Otras formas de ayudar</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--gris-calido)]">
              También podés ofrecer tiempo, conocimiento, difusión o una alianza institucional.
            </p>
          </div>
          <div className="border-t border-[var(--border)] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="text-sm font-bold text-[var(--verde-profundo)]">Contacto directo</p>
            <div className="mt-5 space-y-4 text-sm text-[var(--gris-calido)]">
              <a href={`mailto:${email}`} className="action-link">
                <Envelope size={18} /> {email}
              </a>
              <a href={`tel:${phoneHref}`} className="action-link">
                <Phone size={18} /> {phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
