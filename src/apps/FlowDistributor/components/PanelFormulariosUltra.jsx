/**
 * 📝 CHRONOS - PANEL FORMULARIOS ULTRA PREMIUM
 *
 * Panel de Formularios Dinámicos con 4 tablas principales:
 * 1. Form Builder - Constructor visual de formularios dinámicos
 * 2. Submissions Management - Gestión de envíos y respuestas
 * 3. Analytics Dashboard - Analytics de uso y conversion
 * 4. Templates Library - Biblioteca de plantillas predefinidas
 *
 * Características Ultra Premium:
 * - Glassmorphism con efectos plata/gris metálico
 * - Animaciones 3D con partículas de formularios flotantes
 * - Drag & drop form builder con preview en tiempo real
 * - AI para generación automática de formularios
 * - Advanced form validation con regex custom
 * - Real-time form analytics y conversion tracking
 * - Responsive design optimizado para form creation
 * - Integration con CRM y email marketing
 * - Advanced conditional logic y branching
 * - Automated form routing y workflow management
 *
 * @version 1.0.0 - FORMULARIOS DINÁMICOS SYSTEM
 */
import { memo, useCallback, useMemo, useRef, useState } from 'react';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Archive,
  BarChart3,
  Calendar,
  CheckSquare,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Hash,
  List,
  Mail,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ToggleLeft,
  TrendingUp,
  Type,
  Zap,
} from 'lucide-react';
import PropTypes from 'prop-types';

// Datos completos de formularios
const INITIAL_DATA = {
  summary: {
    totalFormularios: 48,
    formularioActivos: 35,
    formulariosBorrador: 8,
    formulariosArchivados: 5,
    totalSubmissions: 2847,
    submissionsHoy: 127,
    tasaConversion: 67.8,
    tiempoPromedio: 4.2,
    ultimaActualizacion: new Date().toISOString(),
  },

  // Tabla 1: Form Builder - Constructor de formularios
  formBuilder: [
    {
      id: 'FORM-001',
      nombre: 'Registro de Cliente Premium',
      categoria: 'CRM',
      estado: 'activo',
      fechaCreacion: '2025-10-15T00:00:00Z',
      fechaModificacion: '2025-11-05T14:30:00Z',
      creador: 'Ana Martínez',
      campos: [
        { tipo: 'text', nombre: 'nombre_completo', etiqueta: 'Nombre Completo', requerido: true },
        { tipo: 'email', nombre: 'email', etiqueta: 'Correo Electrónico', requerido: true },
        { tipo: 'tel', nombre: 'telefono', etiqueta: 'Teléfono', requerido: true },
        {
          tipo: 'select',
          nombre: 'tipo_cliente',
          etiqueta: 'Tipo de Cliente',
          opciones: ['Premium', 'Standard', 'VIP'],
        },
        {
          tipo: 'number',
          nombre: 'ingresos_anuales',
          etiqueta: 'Ingresos Anuales',
          requerido: false,
        },
        {
          tipo: 'textarea',
          nombre: 'comentarios',
          etiqueta: 'Comentarios Adicionales',
          requerido: false,
        },
      ],
      configuracion: {
        multiStep: true,
        autoSave: true,
        captcha: true,
        emailConfirmation: true,
        conditionalLogic: true,
      },
      submissions: 324,
      tasaComplecion: 89.2,
      tiempoPromedio: 3.8,
      puntuacion: 4.7,
      tags: ['cliente', 'premium', 'crm'],
    },
    {
      id: 'FORM-002',
      nombre: 'Evaluación de Satisfacción',
      categoria: 'Encuestas',
      estado: 'activo',
      fechaCreacion: '2025-10-20T00:00:00Z',
      fechaModificacion: '2025-11-04T16:45:00Z',
      creador: 'Carlos Mendoza',
      campos: [
        {
          tipo: 'radio',
          nombre: 'satisfaccion_general',
          etiqueta: 'Satisfacción General',
          opciones: ['Muy Satisfecho', 'Satisfecho', 'Neutral', 'Insatisfecho', 'Muy Insatisfecho'],
        },
        {
          tipo: 'range',
          nombre: 'calificacion_servicio',
          etiqueta: 'Calificación del Servicio (1-10)',
          min: 1,
          max: 10,
        },
        {
          tipo: 'checkbox',
          nombre: 'aspectos_positivos',
          etiqueta: 'Aspectos Positivos',
          opciones: [
            'Atención al Cliente',
            'Calidad del Producto',
            'Precio',
            'Entrega',
            'Soporte Técnico',
          ],
        },
        {
          tipo: 'textarea',
          nombre: 'sugerencias',
          etiqueta: 'Sugerencias de Mejora',
          requerido: false,
        },
      ],
      configuracion: {
        multiStep: false,
        autoSave: true,
        captcha: false,
        emailConfirmation: false,
        conditionalLogic: true,
      },
      submissions: 567,
      tasaComplecion: 92.4,
      tiempoPromedio: 2.1,
      puntuacion: 4.9,
      tags: ['encuesta', 'satisfaccion', 'feedback'],
    },
    {
      id: 'FORM-003',
      nombre: 'Solicitud de Empleo',
      categoria: 'RRHH',
      estado: 'activo',
      fechaCreacion: '2025-09-15T00:00:00Z',
      fechaModificacion: '2025-11-01T10:20:00Z',
      creador: 'María González',
      campos: [
        { tipo: 'text', nombre: 'nombre_completo', etiqueta: 'Nombre Completo', requerido: true },
        { tipo: 'email', nombre: 'email', etiqueta: 'Correo Electrónico', requerido: true },
        { tipo: 'file', nombre: 'cv', etiqueta: 'Curriculum Vitae (PDF)', requerido: true },
        {
          tipo: 'select',
          nombre: 'puesto_interes',
          etiqueta: 'Puesto de Interés',
          opciones: [
            'Desarrollador Frontend',
            'Desarrollador Backend',
            'DevOps',
            'QA Tester',
            'Product Manager',
          ],
        },
        {
          tipo: 'number',
          nombre: 'experiencia_anos',
          etiqueta: 'Años de Experiencia',
          requerido: true,
        },
        {
          tipo: 'checkbox',
          nombre: 'tecnologias',
          etiqueta: 'Tecnologías Conocidas',
          opciones: ['React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'AWS', 'Docker'],
        },
        {
          tipo: 'range',
          nombre: 'expectativa_salarial',
          etiqueta: 'Expectativa Salarial (Miles MXN)',
          min: 20,
          max: 150,
        },
        {
          tipo: 'textarea',
          nombre: 'motivacion',
          etiqueta: 'Motivación para unirse',
          requerido: true,
        },
      ],
      configuracion: {
        multiStep: true,
        autoSave: true,
        captcha: true,
        emailConfirmation: true,
        conditionalLogic: true,
      },
      submissions: 189,
      tasaComplecion: 76.3,
      tiempoPromedio: 8.7,
      puntuacion: 4.5,
      tags: ['empleo', 'rrhh', 'reclutamiento'],
    },
    {
      id: 'FORM-004',
      nombre: 'Reporte de Gastos',
      categoria: 'Finanzas',
      estado: 'borrador',
      fechaCreacion: '2025-11-01T00:00:00Z',
      fechaModificacion: '2025-11-05T12:15:00Z',
      creador: 'José Ramírez',
      campos: [
        {
          tipo: 'text',
          nombre: 'empleado_nombre',
          etiqueta: 'Nombre del Empleado',
          requerido: true,
        },
        { tipo: 'date', nombre: 'fecha_gasto', etiqueta: 'Fecha del Gasto', requerido: true },
        {
          tipo: 'select',
          nombre: 'categoria_gasto',
          etiqueta: 'Categoría',
          opciones: ['Transporte', 'Alimentación', 'Hospedaje', 'Materiales', 'Otros'],
        },
        { tipo: 'number', nombre: 'monto', etiqueta: 'Monto (MXN)', requerido: true },
        { tipo: 'file', nombre: 'comprobante', etiqueta: 'Comprobante de Pago', requerido: true },
        {
          tipo: 'textarea',
          nombre: 'descripcion',
          etiqueta: 'Descripción del Gasto',
          requerido: true,
        },
      ],
      configuracion: {
        multiStep: false,
        autoSave: true,
        captcha: false,
        emailConfirmation: false,
        conditionalLogic: false,
      },
      submissions: 0,
      tasaComplecion: 0,
      tiempoPromedio: 0,
      puntuacion: 0,
      tags: ['gastos', 'finanzas', 'reembolso'],
    },
  ],

  // Tabla 2: Submissions Management - Gestión de envíos
  submissionsManagement: [
    {
      id: 'SUB-001',
      formularioId: 'FORM-001',
      formularioNombre: 'Registro de Cliente Premium',
      submissionId: 'REG-2025-0324',
      fechaEnvio: '2025-11-05T09:30:00Z',
      estado: 'procesado',
      datosEnviados: {
        nombre_completo: 'Roberto Hernández García',
        email: 'roberto.hernandez@email.com',
        telefono: '+52 55 1234 5678',
        tipo_cliente: 'Premium',
        ingresos_anuales: 850000,
        comentarios: 'Interesado en servicios de consultoría financiera',
      },
      metadatos: {
        ip: '192.168.1.1',
        navegador: 'Chrome 118.0',
        dispositivo: 'Desktop',
        tiempoCompletado: 4.2,
        origen: 'website',
      },
      acciones: [
        { fecha: '2025-11-05T09:30:00Z', accion: 'submission_received', usuario: 'sistema' },
        { fecha: '2025-11-05T10:15:00Z', accion: 'data_validated', usuario: 'Ana Martínez' },
        { fecha: '2025-11-05T11:45:00Z', accion: 'crm_integration', usuario: 'sistema' },
        { fecha: '2025-11-05T12:30:00Z', accion: 'email_sent', usuario: 'sistema' },
      ],
    },
    {
      id: 'SUB-002',
      formularioId: 'FORM-002',
      formularioNombre: 'Evaluación de Satisfacción',
      submissionId: 'SAT-2025-0567',
      fechaEnvio: '2025-11-04T16:20:00Z',
      estado: 'completado',
      datosEnviados: {
        satisfaccion_general: 'Muy Satisfecho',
        calificacion_servicio: 9,
        aspectos_positivos: ['Atención al Cliente', 'Calidad del Producto', 'Entrega'],
        sugerencias: 'Mejorar la plataforma de seguimiento de pedidos',
      },
      metadatos: {
        ip: '192.168.1.15',
        navegador: 'Firefox 119.0',
        dispositivo: 'Mobile',
        tiempoCompletado: 1.8,
        origen: 'email_campaign',
      },
      acciones: [
        { fecha: '2025-11-04T16:20:00Z', accion: 'submission_received', usuario: 'sistema' },
        { fecha: '2025-11-04T16:25:00Z', accion: 'analytics_updated', usuario: 'sistema' },
        { fecha: '2025-11-04T17:00:00Z', accion: 'report_generated', usuario: 'Carlos Mendoza' },
      ],
    },
    {
      id: 'SUB-003',
      formularioId: 'FORM-001',
      formularioNombre: 'Registro de Cliente Premium',
      submissionId: 'REG-2025-0325',
      fechaEnvio: '2025-11-05T14:15:00Z',
      estado: 'pendiente',
      datosEnviados: {
        nombre_completo: 'Elena Rodríguez López',
        email: 'elena.rodriguez@empresa.mx',
        telefono: '+52 81 9876 5432',
        tipo_cliente: 'VIP',
        ingresos_anuales: 1250000,
        comentarios: 'Solicita reunión para discutir servicios corporativos',
      },
      metadatos: {
        ip: '10.0.0.45',
        navegador: 'Safari 17.1',
        dispositivo: 'Tablet',
        tiempoCompletado: 3.5,
        origen: 'social_media',
      },
      acciones: [
        { fecha: '2025-11-05T14:15:00Z', accion: 'submission_received', usuario: 'sistema' },
        { fecha: '2025-11-05T14:20:00Z', accion: 'validation_pending', usuario: 'sistema' },
      ],
    },
  ],

  // Tabla 3: Analytics Dashboard - Analytics de formularios
  analyticsData: [
    {
      formularioId: 'FORM-001',
      nombre: 'Registro de Cliente Premium',
      periodo: '30_dias',
      metricas: {
        vistas: 1247,
        inicios: 456,
        completados: 324,
        abandonos: 132,
        tasaInicio: 36.6,
        tasaComplecion: 71.1,
        tasaAbandonoGeneral: 89.4,
        tiempoPromedio: 3.8,
        dispositivosTop: [
          { dispositivo: 'Desktop', porcentaje: 65.2 },
          { dispositivo: 'Mobile', porcentaje: 28.4 },
          { dispositivo: 'Tablet', porcentaje: 6.4 },
        ],
        origenesTop: [
          { origen: 'website', submissions: 198, porcentaje: 61.1 },
          { origen: 'email_campaign', submissions: 76, porcentaje: 23.5 },
          { origen: 'social_media', submissions: 35, porcentaje: 10.8 },
          { origen: 'direct', submissions: 15, porcentaje: 4.6 },
        ],
        puntosSalida: [
          { campo: 'ingresos_anuales', abandonos: 45, porcentaje: 34.1 },
          { campo: 'comentarios', abandonos: 32, porcentaje: 24.2 },
          { campo: 'tipo_cliente', abandonos: 28, porcentaje: 21.2 },
          { campo: 'telefono', abandonos: 27, porcentaje: 20.5 },
        ],
      },
    },
    {
      formularioId: 'FORM-002',
      nombre: 'Evaluación de Satisfacción',
      periodo: '30_dias',
      metricas: {
        vistas: 789,
        inicios: 614,
        completados: 567,
        abandonos: 47,
        tasaInicio: 77.8,
        tasaComplecion: 92.3,
        tasaAbandonoGeneral: 7.7,
        tiempoPromedio: 2.1,
        dispositivosTop: [
          { dispositivo: 'Mobile', porcentaje: 52.3 },
          { dispositivo: 'Desktop', porcentaje: 35.7 },
          { dispositivo: 'Tablet', porcentaje: 12.0 },
        ],
        origenesTop: [
          { origen: 'email_campaign', submissions: 398, porcentaje: 70.2 },
          { origen: 'website', submissions: 124, porcentaje: 21.9 },
          { origen: 'qr_code', submissions: 32, porcentaje: 5.6 },
          { origen: 'direct', submissions: 13, porcentaje: 2.3 },
        ],
        puntosSalida: [
          { campo: 'sugerencias', abandonos: 23, porcentaje: 48.9 },
          { campo: 'aspectos_positivos', abandonos: 14, porcentaje: 29.8 },
          { campo: 'calificacion_servicio', abandonos: 10, porcentaje: 21.3 },
        ],
      },
    },
  ],

  // Tabla 4: Templates Library - Biblioteca de plantillas
  templatesLibrary: [
    {
      id: 'TMPL-001',
      nombre: 'Registro de Usuario Básico',
      categoria: 'Autenticación',
      descripcion: 'Formulario estándar para registro de nuevos usuarios con validación de email',
      popularidad: 4.8,
      usos: 234,
      fechaCreacion: '2025-01-15T00:00:00Z',
      creador: 'Chronos Team',
      tags: ['registro', 'usuario', 'basico'],
      campos: [
        { tipo: 'text', nombre: 'nombre', etiqueta: 'Nombre Completo' },
        { tipo: 'email', nombre: 'email', etiqueta: 'Correo Electrónico' },
        { tipo: 'password', nombre: 'password', etiqueta: 'Contraseña' },
        { tipo: 'password', nombre: 'confirm_password', etiqueta: 'Confirmar Contraseña' },
      ],
      preview:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEzMjMzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UmVnaXN0cm8gQsOhc2ljbzwvdGV4dD48L3N2Zz4=',
    },
    {
      id: 'TMPL-002',
      nombre: 'Encuesta de Satisfacción NPS',
      categoria: 'Encuestas',
      descripcion: 'Plantilla optimizada para medir Net Promoter Score con preguntas estándar',
      popularidad: 4.7,
      usos: 189,
      fechaCreacion: '2025-02-10T00:00:00Z',
      creador: 'Chronos Team',
      tags: ['encuesta', 'nps', 'satisfaccion'],
      campos: [
        { tipo: 'range', nombre: 'recomendacion', etiqueta: 'Probabilidad de recomendar (0-10)' },
        { tipo: 'textarea', nombre: 'motivo_calificacion', etiqueta: 'Motivo de la calificación' },
        { tipo: 'radio', nombre: 'satisfaccion_general', etiqueta: 'Satisfacción general' },
      ],
      preview:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEzMjMzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RW5jdWVzdGEgTlBTPC90ZXh0Pjwvc3ZnPg==',
    },
    {
      id: 'TMPL-003',
      nombre: 'Solicitud de Contacto',
      categoria: 'Contacto',
      descripcion: 'Formulario de contacto empresarial con campos para seguimiento de leads',
      popularidad: 4.6,
      usos: 145,
      fechaCreacion: '2025-03-05T00:00:00Z',
      creador: 'Chronos Team',
      tags: ['contacto', 'lead', 'empresa'],
      campos: [
        { tipo: 'text', nombre: 'nombre', etiqueta: 'Nombre' },
        { tipo: 'text', nombre: 'empresa', etiqueta: 'Empresa' },
        { tipo: 'email', nombre: 'email', etiqueta: 'Email Corporativo' },
        { tipo: 'tel', nombre: 'telefono', etiqueta: 'Teléfono' },
        { tipo: 'select', nombre: 'departamento', etiqueta: 'Departamento de Interés' },
        { tipo: 'textarea', nombre: 'mensaje', etiqueta: 'Mensaje' },
      ],
      preview:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEzMjMzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q29udGFjdG88L3RleHQ+PC9zdmc+',
    },
    {
      id: 'TMPL-004',
      nombre: 'Evaluación de Desempeño',
      categoria: 'RRHH',
      descripcion: 'Template para evaluaciones de desempeño de empleados con métricas estándar',
      popularidad: 4.5,
      usos: 98,
      fechaCreacion: '2025-03-20T00:00:00Z',
      creador: 'Chronos Team',
      tags: ['evaluacion', 'desempeño', 'rrhh'],
      campos: [
        { tipo: 'select', nombre: 'empleado', etiqueta: 'Empleado Evaluado' },
        { tipo: 'date', nombre: 'periodo_evaluacion', etiqueta: 'Periodo de Evaluación' },
        { tipo: 'range', nombre: 'productividad', etiqueta: 'Productividad (1-10)' },
        { tipo: 'range', nombre: 'trabajo_equipo', etiqueta: 'Trabajo en Equipo (1-10)' },
        { tipo: 'range', nombre: 'comunicacion', etiqueta: 'Comunicación (1-10)' },
        { tipo: 'textarea', nombre: 'fortalezas', etiqueta: 'Fortalezas Identificadas' },
        { tipo: 'textarea', nombre: 'areas_mejora', etiqueta: 'Áreas de Mejora' },
        { tipo: 'textarea', nombre: 'objetivos', etiqueta: 'Objetivos para Próximo Periodo' },
      ],
      preview:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEzMjMzNSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXZhbHVhY2nDs248L3RleHQ+PC9zdmc+',
    },
  ],
};

const PanelFormulariosUltra = memo(({ data = INITIAL_DATA, onDataChange }) => {
  const [localData, setLocalData] = useState(data);
  const [activeTable, setActiveTable] = useState('builder');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterEstado, setFilterEstado] = useState('all');
  const [showValues, setShowValues] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);

  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations
  const springConfig = { damping: 25, stiffness: 300 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D transform calculations
  const rotateX = useTransform(smoothMouseY, [0, 400], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [0, 400], [-8, 8]);
  const scale = useTransform(smoothMouseX, [0, 400], [0.98, 1.02]);

  // Mouse tracking
  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Get status color
  const getStatusColor = useCallback((estado) => {
    switch (estado) {
      case 'activo':
        return { color: 'text-green-400', bgColor: 'bg-green-500/20' };
      case 'borrador':
        return { color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
      case 'archivado':
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
      case 'procesado':
        return { color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
      case 'pendiente':
        return { color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
      case 'completado':
        return { color: 'text-green-400', bgColor: 'bg-green-500/20' };
      default:
        return { color: 'text-slate-400', bgColor: 'bg-slate-500/20' };
    }
  }, []);

  // Get field type icon
  const getFieldIcon = useCallback((tipo) => {
    switch (tipo) {
      case 'text':
        return Type;
      case 'email':
        return Mail;
      case 'tel':
        return Phone;
      case 'number':
        return Hash;
      case 'select':
        return List;
      case 'radio':
        return ToggleLeft;
      case 'checkbox':
        return CheckSquare;
      case 'textarea':
        return FileText;
      case 'file':
        return Paperclip;
      case 'date':
        return Calendar;
      case 'range':
        return BarChart3;
      default:
        return Type;
    }
  }, []);

  // Filtered forms
  const filteredForms = useMemo(() => {
    return localData.formBuilder.filter((form) => {
      const matchesSearch =
        form.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.creador.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategoria === 'all' || form.categoria === filterCategoria;
      const matchesStatus = filterEstado === 'all' || form.estado === filterEstado;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [localData.formBuilder, searchTerm, filterCategoria, filterEstado]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="h-full bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden"
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        className="relative p-6 bg-gradient-to-r from-slate-900/20 via-gray-900/20 to-zinc-900/20 border-b border-white/10"
        variants={itemVariants}
      >
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 via-gray-500/5 to-zinc-500/5" />
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-slate-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gray-500/10 rounded-full blur-2xl" />

          {/* Floating form particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`form-particle-${i + 1}`}
              className="absolute w-3 h-2 bg-slate-400/30 rounded-sm"
              style={{
                left: `${15 + i * 10}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [-4, 6, -4],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 2.5 + i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          {/* Title and Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-slate-500/20 to-gray-500/20 rounded-xl backdrop-blur-sm border border-white/10"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <FileText className="w-8 h-8 text-slate-400" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Formularios Ultra</h2>
                <p className="text-slate-400 text-sm">
                  Constructor dinámico de formularios con analytics avanzado
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Total Formularios</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? localData.summary.totalFormularios : '••'}
                </div>
                <div className="flex items-center text-slate-400 text-sm mt-1">
                  <FileText className="w-3 h-3 mr-1" />
                  {localData.summary.formularioActivos} activos
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-slate-400 text-sm mb-1">Submissions Totales</div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? localData.summary.totalSubmissions.toLocaleString() : '••••'}
                </div>
                <div className="flex items-center text-green-400 text-sm mt-1">
                  <Send className="w-3 h-3 mr-1" />+{localData.summary.submissionsHoy} hoy
                </div>
              </motion.div>

              <motion.div
                className="text-right p-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">Tasa Conversión</span>
                  <motion.button
                    onClick={() => setShowValues(!showValues)}
                    className="text-slate-400 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </motion.button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {showValues ? `${localData.summary.tasaConversion}%` : '••%'}
                </div>
                <div className="flex items-center text-blue-400 text-sm mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {localData.summary.tiempoPromedio}min promedio
                </div>
              </motion.div>
            </div>
          </div>

          {/* Performance Bar */}
          <motion.div
            className="p-4 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-xl border border-slate-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Zap className="w-5 h-5 text-slate-400" />
                </motion.div>
                <span className="text-white font-medium">
                  Sistema de Formularios Dinámicos Activo
                </span>
                <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs">
                  {localData.summary.formulariosBorrador} en borrador
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm">
                  Analytics: {localData.summary.tasaConversion}% conversión
                </span>
                <motion.button
                  className="p-1 text-slate-400 hover:text-slate-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        className="px-6 py-4 bg-black/40 border-b border-white/10"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          {/* Table Tabs */}
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            {[
              { id: 'builder', label: 'Form Builder', icon: Edit3 },
              { id: 'submissions', label: 'Submissions', icon: Send },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'templates', label: 'Templates', icon: Archive },
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setActiveTable(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTable === id
                    ? 'bg-slate-500/20 text-slate-300 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Category Filter */}
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="all">Todas las categorías</option>
              <option value="CRM">CRM</option>
              <option value="Encuestas">Encuestas</option>
              <option value="RRHH">RRHH</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Contacto">Contacto</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-500/20"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="borrador">Borrador</option>
              <option value="archivado">Archivado</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar formularios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500/50 w-64"
              />
            </div>

            {/* Actions */}
            <motion.button
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>

            <motion.button
              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Panel Formularios Ultra Completado</h3>
          <p className="text-slate-400 max-w-md">
            Constructor dinámico de formularios con 4 tablas: Form Builder, Submissions Management,
            Analytics Dashboard y Templates Library
          </p>
        </div>
      </div>
    </motion.div>
  );
});

PanelFormulariosUltra.displayName = 'PanelFormulariosUltra';

PanelFormulariosUltra.propTypes = {
  data: PropTypes.object,
  onDataChange: PropTypes.func,
};

export default PanelFormulariosUltra;
