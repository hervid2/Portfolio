import { useEffect } from "react";

/**
 * Shared modal behavior: closes on Escape and locks page scroll while mounted.
 *
 * The Escape listener re-subscribes whenever `onClose` changes; the scroll lock is set once on
 * mount and cleared on unmount.
 *
 * @param onClose - Called when the user presses Escape.
 * @returns Nothing; the effects clean up on unmount.
 */
export function useModalBehavior(onClose: () => void): void {
  useEffect(() => {
    /**
     * Closes the modal when the pressed key is Escape.
     *
     * @param event - Keyboard event dispatched on the document.
     * @returns Nothing.
     */
    const handleEsc = (event: KeyboardEvent): void => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
}
