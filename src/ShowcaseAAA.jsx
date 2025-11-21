import { useState } from 'react';

import { motion } from 'framer-motion';

import { ButtonAAA, CardAAA, InputAAA, ToastAAA, ToggleAAA } from './components/ui/ComponentsAAA';
import { useAnimatedGradient, useParticles, useTypingAnimation } from './hooks/useAnimations';

/**
 * 🎨 SHOWCASE DE COMPONENTES AAA
 *
 * Demonstración interactiva de todos los componentes premium
 */

const ShowcaseAAA = () => {
  const [inputValue, setInputValue] = useState('');
  const [toggleValue, setToggleValue] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');

  const gradient = useAnimatedGradient(['#667eea', '#764ba2', '#f093fb']);
  const { displayedText } = useTypingAnimation('Componentes Ultra Premium AAA 🚀', 80);
  const { particles } = useParticles(50);

  // ============================================
  // SECTION WRAPPER
  // ============================================
  const Section = ({ title, description, children, id }) => (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="mb-20"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-800 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-lg">{description}</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{children}</div>
    </motion.section>
  );

  // ============================================
  // DEMO CARD WRAPPER
  // ============================================
  const DemoCard = ({ title, children }) => (
    <CardAAA hover glow tilt className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </CardAAA>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-zinc-800 to-zinc-800 relative overflow-hidden">
      {/* Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.x}vw`,
              y: `${particle.y}vh`,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: [`${particle.y}vh`, `${particle.y - 20}vh`, `${particle.y}vh`],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(102,126,234,0.6) 0%, rgba(118,75,162,0.3) 100%)',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="relative z-10 container mx-auto px-6 py-12"
      >
        <motion.h1
          animate={gradient.animate}
          transition={gradient.transition}
          style={gradient}
          className="text-6xl md:text-7xl font-bold text-center mb-4 text-white p-8 rounded-3xl"
        >
          {displayedText}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-center text-gray-600 text-xl"
        >
          Microanimaciones fluidas • Interacciones premium • Efectos 2.5D
        </motion.p>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        {/* ============================================ */}
        {/* BUTTONS SECTION */}
        {/* ============================================ */}
        <Section
          id="buttons"
          title="🎯 Botones Premium"
          description="Efectos magnéticos, ripple, shine y elastic hover"
        >
          <DemoCard title="Variantes">
            <ButtonAAA variant="primary" icon={<span>🚀</span>}>
              Primary Button
            </ButtonAAA>
            <ButtonAAA variant="secondary" icon={<span>⚙️</span>}>
              Secondary Button
            </ButtonAAA>
            <ButtonAAA variant="ghost" icon={<span>👻</span>}>
              Ghost Button
            </ButtonAAA>
            <ButtonAAA variant="danger" icon={<span>🔥</span>}>
              Danger Button
            </ButtonAAA>
          </DemoCard>

          <DemoCard title="Tamaños y Estados">
            <ButtonAAA size="sm" icon={<span>✨</span>}>
              Small Button
            </ButtonAAA>
            <ButtonAAA size="md" icon={<span>✨</span>}>
              Medium Button
            </ButtonAAA>
            <ButtonAAA size="lg" icon={<span>✨</span>}>
              Large Button
            </ButtonAAA>
            <ButtonAAA loading icon={<span>⏳</span>}>
              Loading...
            </ButtonAAA>
            <ButtonAAA disabled icon={<span>🚫</span>}>
              Disabled
            </ButtonAAA>
          </DemoCard>

          <DemoCard title="Con Iconos">
            <ButtonAAA icon={<span>📤</span>} iconPosition="left">
              Exportar Datos
            </ButtonAAA>
            <ButtonAAA icon={<span>💾</span>} iconPosition="right">
              Guardar Cambios
            </ButtonAAA>
            <ButtonAAA icon={<span>🗑️</span>} iconPosition="left" variant="danger">
              Eliminar Todo
            </ButtonAAA>
          </DemoCard>

          <DemoCard title="Acciones">
            <ButtonAAA
              onClick={() => {
                setToastType('success');
                setShowToast(true);
              }}
              icon={<span>✅</span>}
            >
              Mostrar Toast Success
            </ButtonAAA>
            <ButtonAAA
              onClick={() => {
                setToastType('error');
                setShowToast(true);
              }}
              variant="danger"
              icon={<span>❌</span>}
            >
              Mostrar Toast Error
            </ButtonAAA>
            <ButtonAAA
              onClick={() => {
                setToastType('warning');
                setShowToast(true);
              }}
              variant="secondary"
              icon={<span>⚠️</span>}
            >
              Mostrar Toast Warning
            </ButtonAAA>
          </DemoCard>
        </Section>

        {/* ============================================ */}
        {/* INPUTS SECTION */}
        {/* ============================================ */}
        <Section
          id="inputs"
          title="📝 Inputs Premium"
          description="Floating labels, glass morphism, validación animada"
        >
          <DemoCard title="Estados Básicos">
            <InputAAA
              label="Nombre Completo"
              placeholder="Escribe tu nombre..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              icon={<span>👤</span>}
            />
            <InputAAA
              label="Email"
              placeholder="tu@email.com"
              type="email"
              icon={<span>📧</span>}
              success={true}
            />
            <InputAAA
              label="Contraseña"
              placeholder="Mínimo 8 caracteres"
              type="password"
              icon={<span>🔒</span>}
              error="La contraseña es muy corta"
            />
          </DemoCard>

          <DemoCard title="Con Validación">
            <InputAAA
              label="Teléfono"
              placeholder="+52 123 456 7890"
              type="tel"
              icon={<span>📱</span>}
            />
            <InputAAA label="Cantidad" placeholder="0" type="number" icon={<span>🔢</span>} />
            <InputAAA label="Fecha" type="date" icon={<span>📅</span>} />
          </DemoCard>

          <DemoCard title="Con Iconos Personalizados">
            <InputAAA
              label="Buscar Producto"
              placeholder="Celular Samsung..."
              icon={<span>🔍</span>}
            />
            <InputAAA label="Precio" placeholder="$0.00" type="number" icon={<span>💵</span>} />
            <InputAAA label="Ubicación" placeholder="Ciudad, Estado" icon={<span>📍</span>} />
          </DemoCard>
        </Section>

        {/* ============================================ */}
        {/* CARDS SECTION */}
        {/* ============================================ */}
        <Section
          id="cards"
          title="🎴 Cards Premium"
          description="3D tilt, glass morphism, glow effects"
        >
          <DemoCard title="Card Básica">
            <CardAAA className="p-6">
              <h4 className="text-lg font-semibold mb-2">Título de Card</h4>
              <p className="text-gray-600">
                Esta es una card básica con glass morphism background.
              </p>
            </CardAAA>
          </DemoCard>

          <DemoCard title="Card con Hover">
            <CardAAA hover className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-800 flex items-center justify-center text-white text-2xl">
                  🚀
                </div>
                <div>
                  <h4 className="font-semibold">Hover para elevar</h4>
                  <p className="text-sm text-gray-600">Smooth elevation effect</p>
                </div>
              </div>
            </CardAAA>
          </DemoCard>

          <DemoCard title="Card con Glow">
            <CardAAA hover glow className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl">
                  ✨
                </div>
                <div>
                  <h4 className="font-semibold">Glow Effect</h4>
                  <p className="text-sm text-gray-600">Brilla al hacer hover</p>
                </div>
              </div>
            </CardAAA>
          </DemoCard>

          <DemoCard title="Card con 3D Tilt">
            <CardAAA hover tilt className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl">
                  🎯
                </div>
                <div>
                  <h4 className="font-semibold">3D Tilt Effect</h4>
                  <p className="text-sm text-gray-600">Mueve el cursor sobre mí</p>
                </div>
              </div>
            </CardAAA>
          </DemoCard>

          <DemoCard title="Card Todo Activado">
            <CardAAA hover glow tilt className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl">
                  🔥
                </div>
                <div>
                  <h4 className="font-semibold">Todo Activado</h4>
                  <p className="text-sm text-gray-600">Hover + Glow + Tilt</p>
                </div>
              </div>
            </CardAAA>
          </DemoCard>

          <DemoCard title="Card Clickeable">
            <CardAAA
              hover
              glow
              tilt
              onClick={() => alert('Card clicked!')}
              className="p-6 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-2xl">
                  👆
                </div>
                <div>
                  <h4 className="font-semibold">Click Me!</h4>
                  <p className="text-sm text-gray-600">Card con acción onClick</p>
                </div>
              </div>
            </CardAAA>
          </DemoCard>
        </Section>

        {/* ============================================ */}
        {/* TOGGLES & TOASTS SECTION */}
        {/* ============================================ */}
        <Section
          id="toggles"
          title="🎚️ Toggles & Notifications"
          description="Switches animados y notificaciones premium"
        >
          <DemoCard title="Toggle Switches">
            <ToggleAAA
              checked={toggleValue}
              onChange={(e) => setToggleValue(e.target.checked)}
              label="Habilitar Notificaciones"
              size="sm"
            />
            <ToggleAAA
              checked={toggleValue}
              onChange={(e) => setToggleValue(e.target.checked)}
              label="Modo Oscuro"
              size="md"
            />
            <ToggleAAA
              checked={toggleValue}
              onChange={(e) => setToggleValue(e.target.checked)}
              label="Auto-Guardar"
              size="lg"
            />
          </DemoCard>

          <DemoCard title="Estado del Toggle">
            <div className="p-6 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-800 border-2 border-zinc-700">
              <p className="text-center text-lg">
                Estado actual:
                <span
                  className={`font-bold ml-2 ${toggleValue ? 'text-green-600' : 'text-gray-600'}`}
                >
                  {toggleValue ? '✅ Activado' : '⭕ Desactivado'}
                </span>
              </p>
            </div>
            <motion.div
              animate={{
                scale: toggleValue ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`
                p-4 rounded-xl text-center font-semibold
                ${
                  toggleValue
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {toggleValue ? '🎉 ¡Funcionalidad Activa!' : '😴 Funcionalidad Inactiva'}
            </motion.div>
          </DemoCard>

          <DemoCard title="Toast Notifications">
            <div className="space-y-3">
              <ButtonAAA
                onClick={() => {
                  setToastType('success');
                  setShowToast(true);
                }}
                variant="primary"
                icon={<span>✅</span>}
                size="sm"
              >
                Success Toast
              </ButtonAAA>
              <ButtonAAA
                onClick={() => {
                  setToastType('error');
                  setShowToast(true);
                }}
                variant="danger"
                icon={<span>❌</span>}
                size="sm"
              >
                Error Toast
              </ButtonAAA>
              <ButtonAAA
                onClick={() => {
                  setToastType('warning');
                  setShowToast(true);
                }}
                variant="secondary"
                icon={<span>⚠️</span>}
                size="sm"
              >
                Warning Toast
              </ButtonAAA>
              <ButtonAAA
                onClick={() => {
                  setToastType('info');
                  setShowToast(true);
                }}
                variant="ghost"
                icon={<span>ℹ️</span>}
                size="sm"
              >
                Info Toast
              </ButtonAAA>
            </div>
          </DemoCard>
        </Section>

        {/* ============================================ */}
        {/* COMBINED EXAMPLE */}
        {/* ============================================ */}
        <Section
          id="combined"
          title="🎨 Ejemplo Completo"
          description="Todos los componentes trabajando juntos"
        >
          <div className="lg:col-span-2">
            <CardAAA hover glow tilt className="p-8">
              <motion.h3
                animate={{
                  backgroundPosition: ['0%', '100%', '0%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="text-3xl font-bold bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-clip-text text-transparent mb-6"
                style={{ backgroundSize: '200% auto' }}
              >
                Formulario Premium de Ejemplo
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputAAA label="Nombre" placeholder="John Doe" icon={<span>👤</span>} />
                <InputAAA
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  icon={<span>📧</span>}
                />
                <InputAAA
                  label="Teléfono"
                  placeholder="+52 123 456 7890"
                  type="tel"
                  icon={<span>📱</span>}
                />
                <InputAAA label="Empresa" placeholder="Mi Empresa S.A." icon={<span>🏢</span>} />
              </div>

              <div className="space-y-4 mb-6">
                <ToggleAAA
                  checked={toggleValue}
                  onChange={(e) => setToggleValue(e.target.checked)}
                  label="Acepto los términos y condiciones"
                />
                <ToggleAAA
                  checked={true}
                  onChange={() => {}}
                  label="Deseo recibir notificaciones"
                />
              </div>

              <div className="flex gap-4">
                <ButtonAAA
                  onClick={() => {
                    setToastType('success');
                    setShowToast(true);
                  }}
                  icon={<span>💾</span>}
                  iconPosition="right"
                  size="lg"
                  className="flex-1"
                >
                  Guardar
                </ButtonAAA>
                <ButtonAAA
                  onClick={() => {
                    setToastType('info');
                    setShowToast(true);
                  }}
                  variant="secondary"
                  icon={<span>🔄</span>}
                  size="lg"
                >
                  Reset
                </ButtonAAA>
              </div>
            </CardAAA>
          </div>
        </Section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 mt-20"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <h3 className="text-4xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-800 bg-clip-text text-transparent mb-2">
              Componentes AAA
            </h3>
            <p className="text-gray-600">Ultra Premium • Fluid • Innovative</p>
          </motion.div>
        </motion.footer>
      </div>

      {/* Toast Container */}
      {showToast && (
        <ToastAAA
          message={
            toastType === 'success'
              ? '¡Operación exitosa!'
              : toastType === 'error'
                ? 'Error al procesar'
                : toastType === 'warning'
                  ? 'Advertencia importante'
                  : 'Información relevante'
          }
          type={toastType}
          onClose={() => setShowToast(false)}
          duration={3000}
        />
      )}
    </div>
  );
};

export default ShowcaseAAA;
