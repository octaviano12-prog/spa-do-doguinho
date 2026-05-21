import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modalBackdrop"
          onMouseDown={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="modalHead">
              <div>
                <h2>{title}</h2>
                <p>Preencha as informações abaixo para continuar.</p>
              </div>

              <button type="button" className="btn ghost iconBtn" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
