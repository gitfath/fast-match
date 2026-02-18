"use client";
import LegalPage, { securityContent } from '../LegalContent'; // Using security as placeholder if cookies content was removed

export default function Cookies() {
    return <LegalPage title="Politique des Cookies" content="<p>Nous utilisons des cookies pour améliorer votre expérience.</p>" />;
}
