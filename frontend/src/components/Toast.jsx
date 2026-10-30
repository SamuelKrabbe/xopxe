import { useEffect } from "react";
import "../styles/Toast.css";

const SUCCESS_DURATION_MS = 4000;

// Aviso no canto da tela. O de sucesso some sozinho, o de erro fica até
// o usuário fechar, para dar tempo de ler.
export function Toast({ message, kind = "success", onClose }) {
  useEffect(() => {
    if (kind !== "success") return;

    const timer = setTimeout(onClose, SUCCESS_DURATION_MS);
    return () => clearTimeout(timer);
  }, [kind, message, onClose]);

  return (
    <div
      className={`toast toast--${kind}`}
      role={kind === "error" ? "alert" : "status"}
    >
      <p className="toast__message">{message}</p>

      <button
        type="button"
        className="toast__close"
        aria-label="Fechar aviso"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
