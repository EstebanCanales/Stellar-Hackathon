import React from "react";
import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaUsers,
  FaHandHoldingHeart,
  FaEye,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaGlobe,
} from "react-icons/fa";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-verida-dark-teal via-verida-dark-purple to-verida-purple">
      {/* Navigation */}
      <nav className="p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-verida-green to-verida-light-green rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform">
              <span className="text-verida-dark-teal font-bold text-lg">V</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Verida</h1>
              <p className="text-verida-light-green text-xs">
                Donaciones Transparentes
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-white border border-verida-green rounded-lg hover:bg-verida-green hover:text-verida-dark-teal transition-all duration-300"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/login"
              className="px-6 py-2 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Comenzar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Donaciones{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Transparentes
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Conectamos ONGs con comunidades marginadas usando tecnología
            blockchain de Stellar para garantizar transparencia total en cada
            donación
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/login"
              className="px-8 py-4 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <FaArrowRight className="mr-2" />
              Comenzar Ahora
            </Link>
            <button className="px-8 py-4 border-2 border-verida-green text-white rounded-xl font-bold text-lg hover:bg-verida-green hover:text-verida-dark-teal transition-all duration-300">
              Ver Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                50+
              </div>
              <div className="text-gray-400">Comunidades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                $125K
              </div>
              <div className="text-gray-400">Donado</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                98%
              </div>
              <div className="text-gray-400">Transparencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-verida-light-green">
                15+
              </div>
              <div className="text-gray-400">ONGs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            ¿Por qué elegir{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Verida?
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-green to-verida-light-green rounded-xl flex items-center justify-center mb-6">
                <FaShieldAlt className="text-2xl text-verida-dark-teal" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                100% Transparente
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Cada donación es verificada en blockchain de Stellar. Los
                donantes pueden rastrear exactamente cómo se usa su dinero.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-xl flex items-center justify-center mb-6">
                <FaUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Validación Comunitaria
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Las comunidades validan las entregas directamente, asegurando
                que las donaciones lleguen a quien las necesita.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-verida-green to-verida-light-green rounded-xl flex items-center justify-center mb-6">
                <FaHandHoldingHeart className="text-2xl text-verida-dark-teal" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                Impacto Real
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Conectamos directamente a donantes con comunidades marginadas,
                maximizando el impacto de cada donación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Cómo{" "}
            <span className="bg-gradient-to-r from-verida-green to-verida-light-green bg-clip-text text-transparent">
              Funciona
            </span>
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-verida-dark-teal">
                  1
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                ONG Crea Donación
              </h3>
              <p className="text-gray-400">
                Las ONGs publican necesidades específicas de comunidades
                verificadas
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Donación Segura
              </h3>
              <p className="text-gray-400">
                Los fondos se depositan en un contrato inteligente en Stellar
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-green to-verida-light-green rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-verida-dark-teal">
                  3
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Entrega Verificada
              </h3>
              <p className="text-gray-400">
                La comunidad confirma la recepción de bienes o servicios
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-verida-purple to-verida-dark-purple rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Liberación Automática
              </h3>
              <p className="text-gray-400">
                Los fondos se liberan automáticamente tras la validación
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-verida-green/20 to-verida-light-green/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para hacer donaciones transparentes?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Únete a la revolución de la transparencia en donaciones. Conecta con
            comunidades que realmente necesitan tu ayuda.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaArrowRight className="mr-3" />
            Comenzar Ahora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-verida-green to-verida-light-green rounded-lg flex items-center justify-center">
                <span className="text-verida-dark-teal font-bold">V</span>
              </div>
              <span className="text-white font-semibold">Verida</span>
            </div>

            <div className="flex space-x-6 text-gray-400">
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Privacidad
              </a>
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Términos
              </a>
              <a
                href="#"
                className="hover:text-verida-light-green transition-colors"
              >
                Contacto
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Verida. Construido con ❤️ para comunidades
              transparentes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
