"use client";

export default function ContactNavBtn() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("open-contact-modal"));
  };

  return (
    <button type="button" onClick={handleClick}>
      Contacto
    </button>
  );
}
