import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Users, FileText, Phone, Mail, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-blue-50">
      {/* Elegant Header with Subtle Shadow */}
      <div className="relative bg-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 opacity-95"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center mb-8">
            <button
              onClick={handleBack}
              className="mr-6 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
            >
              <ArrowLeft size={22} className="text-white" />
            </button>
            <div className="flex items-center">
              <div className="relative">
                <Shield size={40} className="text-[#FF8C00] drop-shadow-lg" />
                <div className="absolute inset-0 bg-[#FF8C00] opacity-20 blur-xl rounded-full"></div>
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                  Política de Privacidad y Protección de Datos
                </h1>
                <div className="flex items-center text-gray-300">
                  <span className="font-heavyrust-primary text-[#FF8C00] text-xl">PARRILLEROS</span>
                  <span className="font-bebas-neue-primary ml-3 text-lg">FAST FOOD</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-green-400 mr-3" />
                <span className="text-sm font-medium">Política vigente desde Enero 2025</span>
              </div>
              <div className="flex items-center">
                <AlertCircle size={20} className="text-blue-400 mr-3" />
                <span className="text-sm font-medium">Actualizada para mayor transparencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sophisticated Layout */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        
        {/* Introduction Section */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
              <div className="relative z-10 p-12 text-white">
                <div className="flex items-start mb-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mr-6">
                    <Eye size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4 leading-tight">
                      Transparencia y Confianza en el Manejo de sus Datos Personales
                    </h2>
                    <div className="w-24 h-1 bg-[#FF8C00] rounded-full mb-4"></div>
                  </div>
                </div>
                <p className="text-xl leading-relaxed text-blue-100">
                  En <strong className="font-heavyrust-primary text-[#FF8C00]">PARRILLEROS FAST FOOD</strong>, 
                  entendemos la importancia de proteger su información personal. Esta política establece nuestro 
                  compromiso inquebrantable con la privacidad y seguridad de sus datos, utilizados exclusivamente 
                  para brindarle un servicio de excelencia en sus pedidos a domicilio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          
          {/* Section 1: Data Collection */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-l-8 border-[#FF8C00]">
              <div className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-orange-100 rounded-2xl p-4 mr-6">
                    <Users size={28} className="text-[#FF8C00]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Recopilación de Información Personal</h3>
                    <div className="w-16 h-1 bg-[#FF8C00] rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-2xl p-8 border border-gray-100">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                    Recopilamos únicamente la información esencial y necesaria para procesar su pedido de manera eficiente y segura:
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="bg-blue-100 rounded-xl p-3 mr-4">
                          <FileText size={24} className="text-blue-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Información Básica Requerida</h4>
                      </div>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                          <span>Nombre completo del cliente</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                          <span>Número de teléfono móvil</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                          <span>Dirección completa de entrega</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
                          <span>Barrio o zona de ubicación</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                      <div className="flex items-center mb-6">
                        <div className="bg-purple-100 rounded-xl p-3 mr-4">
                          <FileText size={24} className="text-purple-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">Información de Facturación</h4>
                        <span className="ml-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">Opcional</span>
                      </div>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                          <span>Número de documento de identidad</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
                          <span>Dirección de correo electrónico</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600 italic">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mr-4"></div>
                          <span>Solo requerido si solicita factura fiscal</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Purpose */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-l-8 border-blue-600">
              <div className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 rounded-2xl p-4 mr-6">
                    <FileText size={28} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Finalidad del Tratamiento de Datos</h3>
                    <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center bg-white rounded-2xl px-8 py-4 shadow-lg border border-blue-200">
                      <Shield size={32} className="text-blue-600 mr-4" />
                      <div className="text-left">
                        <h4 className="text-xl font-bold text-gray-800">Propósito Único y Específico</h4>
                        <p className="text-blue-700 font-medium">Procesamiento exclusivo de pedidos a domicilio</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-100">
                      <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <Phone size={32} className="text-blue-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Comunicación Directa</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Contacto telefónico para confirmar detalles del pedido y coordinar tiempos de entrega
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-100">
                      <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <MapPin size={32} className="text-green-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Entrega Precisa</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Localización exacta para garantizar la entrega oportuna en la dirección correcta
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-100">
                      <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <FileText size={32} className="text-purple-600" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Facturación Legal</h4>
                      <p className="text-gray-600 leading-relaxed">
                        Emisión de facturas fiscales cuando sea requerido por el cliente
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Protection and No Sharing */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-l-8 border-green-600">
              <div className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-green-100 rounded-2xl p-4 mr-6">
                    <Lock size={28} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Seguridad y Confidencialidad</h3>
                    <div className="w-16 h-1 bg-green-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                    <div className="flex items-center mb-6">
                      <CheckCircle size={24} className="text-green-600 mr-3" />
                      <h4 className="text-xl font-bold text-green-800">Compromisos de Protección</h4>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle size={14} className="text-green-700" />
                        </div>
                        <span className="text-green-800 font-medium">Implementación de medidas técnicas y organizativas de seguridad</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle size={14} className="text-green-700" />
                        </div>
                        <span className="text-green-800 font-medium">Uso exclusivo para el procesamiento de pedidos</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle size={14} className="text-green-700" />
                        </div>
                        <span className="text-green-800 font-medium">Acceso restringido solo a personal autorizado</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <CheckCircle size={14} className="text-green-700" />
                        </div>
                        <span className="text-green-800 font-medium">Respeto absoluto a sus derechos de privacidad</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-8 border border-red-100">
                    <div className="flex items-center mb-6">
                      <Shield size={24} className="text-red-600 mr-3" />
                      <h4 className="text-xl font-bold text-red-800">Prohibiciones Absolutas</h4>
                    </div>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <span className="text-red-700 font-bold text-sm">✕</span>
                        </div>
                        <span className="text-red-800 font-medium">Venta o comercialización de información personal</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <span className="text-red-700 font-bold text-sm">✕</span>
                        </div>
                        <span className="text-red-800 font-medium">Compartición con empresas terceras o afiliadas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <span className="text-red-700 font-bold text-sm">✕</span>
                        </div>
                        <span className="text-red-800 font-medium">Envío de comunicaciones publicitarias no autorizadas</span>
                      </li>
                      <li className="flex items-start">
                        <div className="bg-red-200 rounded-full w-6 h-6 flex items-center justify-center mr-4 mt-1">
                          <span className="text-red-700 font-bold text-sm">✕</span>
                        </div>
                        <span className="text-red-800 font-medium">Utilización para finalidades diferentes al pedido</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Rights */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-l-8 border-purple-600">
              <div className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-purple-100 rounded-2xl p-4 mr-6">
                    <Users size={28} className="text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Derechos del Titular de los Datos</h3>
                    <div className="w-16 h-1 bg-purple-600 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed text-center">
                    Como titular de sus datos personales, usted tiene derechos fundamentales que respetamos y garantizamos:
                  </p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-purple-100">
                      <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Eye size={24} className="text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Conocer</h4>
                      <p className="text-sm text-gray-600">Acceso a la información que tenemos sobre usted</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-purple-100">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FileText size={24} className="text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Actualizar</h4>
                      <p className="text-sm text-gray-600">Corrección de datos inexactos o incompletos</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-purple-100">
                      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">🗑️</span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Eliminar</h4>
                      <p className="text-sm text-gray-600">Supresión de sus datos cuando sea procedente</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-purple-100">
                      <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-600 text-2xl">🚫</span>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Revocar</h4>
                      <p className="text-sm text-gray-600">Retirada del consentimiento en cualquier momento</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Contact */}
          <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-l-8 border-[#FF8C00]">
              <div className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-orange-100 rounded-2xl p-4 mr-6">
                    <Mail size={28} className="text-[#FF8C00]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Contacto y Atención al Cliente</h3>
                    <div className="w-16 h-1 bg-[#FF8C00] rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed text-center">
                    Para ejercer sus derechos, realizar consultas o presentar reclamos sobre el tratamiento de sus datos personales, 
                    puede contactarnos a través de cualquiera de nuestras sedes:
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                      <div className="text-center mb-6">
                        <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <MapPin size={24} className="text-[#FF8C00]" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 font-heavyrust-primary">Parrilleros Tamasagra</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">Manzana 9A casa 1 - Tamasagra</span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">301 222 2098</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                      <div className="text-center mb-6">
                        <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <MapPin size={24} className="text-[#FF8C00]" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 font-heavyrust-primary">Parrilleros San Ignacio</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">Cra 32 # 14 - 84 - San Ignacio</span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">316 606 0005</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-orange-100">
                      <div className="text-center mb-6">
                        <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <MapPin size={24} className="text-[#FF8C00]" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 font-heavyrust-primary">Parrilleros Cuadras</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <MapPin size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">Calle 20 # 31C - 38 - Las Cuadras</span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={16} className="text-gray-500 mr-3" />
                          <span className="text-gray-700">313 341 9733</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final Commitment Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-gray-800 to-slate-900"></div>
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-12">
              <div className="text-center text-white">
                <div className="bg-[#FF8C00]/20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <Shield size={48} className="text-[#FF8C00]" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Compromiso Institucional</h3>
                <div className="w-32 h-1 bg-[#FF8C00] rounded-full mx-auto mb-8"></div>
                <p className="text-xl leading-relaxed max-w-4xl mx-auto text-gray-200">
                  En <strong className="font-heavyrust-primary text-[#FF8C00]">PARRILLEROS FAST FOOD</strong> asumimos 
                  el compromiso solemne de proteger y respetar sus datos personales. Su confianza es el fundamento de 
                  nuestra relación comercial, y nos comprometemos a mantener los más altos estándares de privacidad 
                  y seguridad en el tratamiento de su información personal.
                </p>
                <div className="mt-10 inline-flex items-center bg-[#FF8C00] text-white px-8 py-4 rounded-2xl font-bold text-lg">
                  <CheckCircle size={24} className="mr-3" />
                  Su privacidad es nuestra prioridad
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Elegant Footer */}
        <div className="mt-16 text-center">
          <button
            onClick={handleBack}
            className="group bg-gradient-to-r from-[#FF8C00] to-orange-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] border border-orange-400"
          >
            <div className="flex items-center">
              <ArrowLeft size={24} className="mr-3 transition-transform duration-300 group-hover:-translate-x-1" />
              Regresar al Formulario
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;