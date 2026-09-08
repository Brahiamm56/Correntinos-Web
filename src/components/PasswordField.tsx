"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type">) {
  const [visible, setVisible] = useState(false);
  return <div className="password-field">
    <input {...props} type={visible ? "text" : "password"} className="field" />
    <button type="button" className="icon-button" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"} aria-controls={props.id}>
      {visible ? <EyeOff size={19} aria-hidden /> : <Eye size={19} aria-hidden />}
    </button>
  </div>;
}
