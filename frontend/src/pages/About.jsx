import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flower2, Heart, Truck, Clock, Award, MapPin, Phone, Mail, Globe } from 'lucide-react';


export default function About() {
  const valores = [
    {
      icon: Heart,
      title: 'Pasión por las Flores',
      desc: 'Cada arreglo lo diseñamos con el mismo cariño que si fuera para nuestra familia. No hacemos arreglos en serie: cada uno es único.'
    },
    {
      icon: Truck,
      title: 'Entrega Garantizada',
      desc: 'Prometemos entrega el mismo día si haces tu pedido antes de las 2:00 p.m. No hacemos promesas que no podamos cumplir.'
    },
    {
      icon: Clock,
      title: 'Frescura del Día',
      desc: 'Seleccionamos flores frescas cada mañana. Si una rosa no cumple nuestro estándar, no la usamos. Preferimos menos flores a flores promedio.'
    },
    {
      icon: Award,
      title: '15 Años de Experiencia',
      desc: 'Nuestras floristas acumulan más de 15 años de experiencia en bodas, eventos corporativos y arreglos personalizados.'
    }
  ];

  const equipo = [
    {
      nombre: 'María Elena Sánchez',
      rol: 'Florista Principal',
      desc: '15 años creando arreglos que cuentan historias. Especialista en bodas y eventos corporativos.',
      imagen: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    },
    {
      nombre: 'Carlos Mendoza',
      rol: 'Diseñador Floral',
      desc: 'Apasionado por las tendencias modernas. Creador de nuestros arreglos de flores secas y preservadas.',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    },
    {
      nombre: 'Ana Lucía Vega',
      rol: 'Atención al Cliente',
      desc: 'Te ayuda a elegir la flor correcta según tu presupuesto y la ocasión. Siempre con una sonrisa.',
      imagen: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Flower2 className="w-16 h-16 text-rose-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-rose-900 mb-6">
              Quiénes Somos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Más que una floristería, somos creadores de momentos. Desde 2011 llevamos alegría, amor y belleza a cada rincón a través de nuestras flores.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-rose-100">
                <img 
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800" 
                  alt="Nuestra floristería"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Todo comenzó en 2011, cuando María Elena decidió convertir su pasión por las flores en un negocio. 
                  Empezó desde su garaje, armando ramos para amigos y familia. Lo que comenzó como un hobby pronto 
                  se convirtió en una floristería de confianza en la comunidad.
                </p>
                <p>
                  Hoy somos un equipo de floristas apasionadas que creemos que cada flor cuenta una historia. 
                  No vendemos flores: vendemos mensajes, sorpresas, disculpas y te quieros. Por eso cada arreglo 
                  que sale de nuestro taller pasa por manos que aman lo que hacen.
                </p>
                <p>
                  Sabemos que cuando comprás flores, no comprás flores —comprás un mensaje. Por eso nos tomamos 
                  en serio cada pedido, cada entrega y cada sonrisa que queremos generar.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Por Qué Elegirnos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((valor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="bg-rose-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <valor.icon className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{valor.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{valor.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Cómo Trabajamos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Selección', desc: 'Cada mañana revisamos el lote de flores. Si una rosa no cumple nuestro estándar, no la usamos.' },
              { num: '02', title: 'Diseño', desc: 'Cada arreglo lo arma una florista a mano. No tenemos arreglos prefabricados ni en serie.' },
              { num: '03', title: 'Empaque', desc: 'Empacamos con materiales que mantienen el agua y protegen los pétalos durante el traslado.' },
              { num: '04', title: 'Entrega', desc: 'Entregamos puntuales y discretos. Sabemos coordinar sorpresas en oficinas, hospitales y eventos.' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <span className="text-5xl font-bold text-rose-200 mb-4 block">{step.num}</span>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Nuestro Equipo</h2>
          <p className="text-center text-gray-500 mb-12">Personas reales detrás de cada flor</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {equipo.map((persona, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm text-center"
              >
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={persona.imagen} 
                    alt={persona.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 text-lg">{persona.nombre}</h3>
                  <p className="text-rose-600 font-medium text-sm mb-3">{persona.rol}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{persona.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto / Ubicación */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Visítanos</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-rose-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Dirección</p>
                    <p className="text-gray-500">Del Indoor Club, 125m sur, Curridabat, San José</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-rose-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Teléfono / WhatsApp</p>
                    <p className="text-gray-500">+506 7033-0337</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-rose-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Email</p>
                    <p className="text-gray-500">hola@floristeria.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-rose-600 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Horario</p>
                    <p className="text-gray-500">Lunes a Sábado: 8:00 a.m. - 6:00 p.m.</p>
                    <p className="text-gray-500">Domingo: 9:00 a.m. - 2:00 p.m.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <a href="#" className="bg-rose-100 text-rose-700 p-3 rounded-full hover:bg-rose-200 transition">
                
                </a>
                <a href="#" className="bg-rose-100 text-rose-700 p-3 rounded-full hover:bg-rose-200 transition">
                  
                </a>
              </div>
            </div>
            <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800" 
                alt="Nuestra tienda"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-pink-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para sorprender?</h2>
          <p className="text-rose-100 text-lg mb-8">
            Explora nuestro catálogo o contáctanos para un arreglo personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo" className="inline-flex items-center justify-center bg-white text-rose-600 px-8 py-3 rounded-full font-semibold hover:bg-rose-50 transition">
              Ver Catálogo
            </Link>
            <a 
              href="https://wa.me/50670330337" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}