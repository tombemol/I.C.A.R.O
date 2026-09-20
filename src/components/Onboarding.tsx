import { motion } from 'framer-motion';
import { ProfileForm } from './ProfileForm';

export function Onboarding() {
  return (
    <main className="onboarding-shell">
      <header className="onboarding-brand">
        <p className="brand">I.C.A.R.O.</p>
        <span>v0.1.0</span>
      </header>

      <motion.section
        className="onboarding-intro"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="eyebrow">Primeiro voo</p>
        <h1>Antes das missões, uma ficha que faça sentido.</h1>
        <p>
          O I.C.A.R.O. usa estes dados localmente para ajustar progressão e contexto.
          Nada de conta obrigatória e nada de nuvem por esporte.
        </p>
      </motion.section>

      <section className="onboarding-form-section" aria-labelledby="profile-title">
        <div className="section-heading section-heading--stack">
          <p className="eyebrow">Sua ficha</p>
          <h2 id="profile-title">Defina o ponto de partida</h2>
        </div>
        <ProfileForm />
      </section>

      <p className="privacy-note">
        Na versão nativa, a ficha fica em SQLite no dispositivo. No preview web, o navegador usa armazenamento local.
      </p>
    </main>
  );
}
