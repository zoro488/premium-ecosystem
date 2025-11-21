#!/usr/bin/env python3
"""
🤖 CrewAI Agent - Auto-Implementación de Componentes Faltantes
Sistema de automatización para completar FlowDistributor según Plan Maestro

Agents:
1. AnalystAgent - Analiza gaps y prioriza tareas
2. ArchitectAgent - Diseña arquitectura de componentes
3. DeveloperAgent - Genera código TypeScript/React
4. TesterAgent - Crea tests unitarios
5. ReviewerAgent - Valida calidad y consistencia
"""

import os
import json
import re
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime

try:
    from crewai import Agent, Task, Crew, Process
    from crewai_tools import FileReadTool, DirectorySearchTool
    from langchain_openai import ChatOpenAI
except ImportError:
    print("⚠️  Instalando dependencias...")
    os.system("pip install crewai crewai-tools langchain-openai")
    from crewai import Agent, Task, Crew, Process
    from crewai_tools import FileReadTool, DirectorySearchTool
    from langchain_openai import ChatOpenAI


# ============================================================================
# CONFIGURACIÓN
# ============================================================================

BASE_PATH = Path(__file__).parent.parent.parent
CHRONOS_PATH = BASE_PATH / "src" / "apps" / "FlowDistributor" / "chronos-system"
COMPONENTS_PATH = CHRONOS_PATH / "components"
PAGES_PATH = CHRONOS_PATH / "pages"
PLAN_MAESTRO = CHRONOS_PATH / "gg" / "PLAN_MAESTRO_COMPLETO_Version2.md"

# LLM Configuration - GitHub Models (gratis con Copilot Pro)
github_token = os.getenv("GITHUB_TOKEN")
if github_token:
    # Usar GitHub Models endpoint
    LLM = ChatOpenAI(
        model="gpt-4o",
        temperature=0.3,
        api_key=github_token,
        base_url="https://models.inference.ai.azure.com"
    )
    print("✅ Usando GitHub Models (GPT-4o)")
else:
    # Fallback a OpenAI
    LLM = ChatOpenAI(
        model="gpt-4",
        temperature=0.3,
        api_key=os.getenv("OPENAI_API_KEY")
    )
    print("✅ Usando OpenAI GPT-4")

# ============================================================================
# DEFINICIÓN DE GAPS CRÍTICOS (del análisis)
# ============================================================================

GAPS_CRITICOS = {
    "bancos_tabs": {
        "prioridad": "CRÍTICA",
        "impacto": "35%",
        "descripcion": "6 bancos necesitan 4 tabs cada uno (24 tabs totales)",
        "componentes": [
            {
                "nombre": "BancoTabs.tsx",
                "path": "components/bancos/BancoTabs.tsx",
                "tipo": "container",
                "lineas_estimadas": 400,
                "descripcion": "Container principal con navegación de tabs y layout"
            },
            {
                "nombre": "TabIngresosBanco.tsx",
                "path": "components/bancos/TabIngresosBanco.tsx",
                "tipo": "tab",
                "lineas_estimadas": 500,
                "descripcion": "Tabla de ingresos (9 cols) + 2 charts (Line + Bar)"
            },
            {
                "nombre": "TabGastosBanco.tsx",
                "path": "components/bancos/TabGastosBanco.tsx",
                "tipo": "tab",
                "lineas_estimadas": 600,
                "descripcion": "Tabla de gastos (11 cols) + alertas + 2 charts"
            },
            {
                "nombre": "TabTransferenciasBanco.tsx",
                "path": "components/bancos/TabTransferenciasBanco.tsx",
                "tipo": "tab",
                "lineas_estimadas": 700,
                "descripcion": "Tabla transferencias (10 cols) + Sankey + Network Graph"
            },
            {
                "nombre": "TabCortesBanco.tsx",
                "path": "components/bancos/TabCortesBanco.tsx",
                "tipo": "tab",
                "lineas_estimadas": 800,
                "descripcion": "Tabla cortes (10 cols) + 5 charts + análisis"
            }
        ],
        "integracion": [
            "pages/bancos/BovedaMontePage.jsx",
            "pages/bancos/BovedaUSAPage.jsx",
            "pages/bancos/UtilidadesPage.jsx",
            "pages/bancos/FletesPage.jsx",
            "pages/bancos/AztecaPage.jsx",
            "pages/bancos/LeftiePage.jsx"
        ]
    },

    "dashboard_ia": {
        "prioridad": "ALTA",
        "impacto": "20%",
        "descripcion": "Dashboard IA necesita 10+ widgets y 4 tipos de charts",
        "componentes": [
            {
                "nombre": "DashboardIAComplete.tsx",
                "path": "components/dashboard/DashboardIAComplete.tsx",
                "tipo": "page",
                "lineas_estimadas": 800,
                "descripcion": "Dashboard principal con grid responsive y widgets"
            },
            {
                "nombre": "PredictiveWidgets.tsx",
                "path": "components/dashboard/PredictiveWidgets.tsx",
                "tipo": "widget-group",
                "lineas_estimadas": 600,
                "descripcion": "Widgets de predicción: ventas, inventario, flujo de caja"
            },
            {
                "nombre": "RealtimeMetricsPanel.tsx",
                "path": "components/dashboard/RealtimeMetricsPanel.tsx",
                "tipo": "panel",
                "lineas_estimadas": 400,
                "descripcion": "Métricas en tiempo real con WebSocket/Firebase"
            }
        ]
    },

    "sistema_ml": {
        "prioridad": "MEDIA",
        "impacto": "15%",
        "descripcion": "Sistema de Machine Learning con TensorFlow.js",
        "componentes": [
            {
                "nombre": "MLPredictionService.ts",
                "path": "services/ml/MLPredictionService.ts",
                "tipo": "service",
                "lineas_estimadas": 600,
                "descripcion": "Servicio de predicciones con TensorFlow.js"
            },
            {
                "nombre": "AnomalyDetector.ts",
                "path": "services/ml/AnomalyDetector.ts",
                "tipo": "service",
                "lineas_estimadas": 400,
                "descripcion": "Detección de anomalías en transacciones"
            }
        ]
    },

    "reportes_avanzados": {
        "prioridad": "MEDIA",
        "impacto": "10%",
        "descripcion": "Sistema de reportes con 8 tipos + export Excel/PDF",
        "componentes": [
            {
                "nombre": "ReportBuilderV2.tsx",
                "path": "components/reports/ReportBuilderV2.tsx",
                "tipo": "builder",
                "lineas_estimadas": 800,
                "descripcion": "Constructor visual de reportes con drag & drop"
            },
            {
                "nombre": "ExportService.ts",
                "path": "services/reports/ExportService.ts",
                "tipo": "service",
                "lineas_estimadas": 500,
                "descripcion": "Export a Excel (xlsx), PDF, CSV con plantillas"
            }
        ]
    }
}


# ============================================================================
# AGENTS DEFINITIONS
# ============================================================================

class ChronosCrewAI:
    def __init__(self):
        self.file_tool = FileReadTool()
        self.search_tool = DirectorySearchTool(directory=str(CHRONOS_PATH))

        # 1. Analyst Agent
        self.analyst = Agent(
            role="Analista de Código Senior",
            goal="Analizar el estado actual del sistema y priorizar tareas de implementación",
            backstory="""Eres un analista experto en arquitectura de software con 10+ años
            de experiencia. Analizas el Plan Maestro y el código existente para identificar
            gaps críticos y crear un plan de implementación optimizado.""",
            verbose=True,
            allow_delegation=True,
            llm=LLM,
            tools=[self.file_tool, self.search_tool]
        )

        # 2. Architect Agent
        self.architect = Agent(
            role="Arquitecto de Software",
            goal="Diseñar la arquitectura de componentes siguiendo best practices de React + TypeScript",
            backstory="""Eres un arquitecto de software especializado en React, TypeScript,
            y sistemas enterprise. Diseñas componentes reutilizables, escalables y con
            excelente rendimiento siguiendo patrones de diseño modernos.""",
            verbose=True,
            allow_delegation=False,
            llm=LLM
        )

        # 3. Developer Agent
        self.developer = Agent(
            role="Desarrollador Full-Stack Senior",
            goal="Implementar componentes TypeScript/React siguiendo el diseño arquitectónico",
            backstory="""Eres un desarrollador senior experto en React 18, TypeScript,
            TailwindCSS, Framer Motion y Firebase. Escribes código limpio, type-safe,
            performante y bien documentado.""",
            verbose=True,
            allow_delegation=False,
            llm=LLM
        )

        # 4. Tester Agent
        self.tester = Agent(
            role="QA Engineer & Test Automation Specialist",
            goal="Crear tests unitarios y de integración para todos los componentes",
            backstory="""Eres un especialista en testing con experiencia en Vitest,
            React Testing Library y Playwright. Creas tests exhaustivos que cubren
            casos edge, validaciones y flujos críticos.""",
            verbose=True,
            allow_delegation=False,
            llm=LLM
        )

        # 5. Reviewer Agent
        self.reviewer = Agent(
            role="Code Reviewer & Quality Assurance Lead",
            goal="Revisar código, tests y documentación asegurando calidad enterprise",
            backstory="""Eres un tech lead con estándares muy altos. Revisas código
            buscando bugs, code smells, problemas de performance, accesibilidad y
            seguridad. Aseguras consistencia con el style guide del proyecto.""",
            verbose=True,
            allow_delegation=False,
            llm=LLM
        )


    def create_tasks_for_gap(self, gap_name: str, gap_data: Dict[str, Any]) -> List[Task]:
        """Crea tareas para un gap específico"""
        tasks = []

        # Task 1: Análisis
        analysis_task = Task(
            description=f"""
            Analiza el gap '{gap_name}':
            - Prioridad: {gap_data['prioridad']}
            - Impacto: {gap_data['impacto']}
            - Descripción: {gap_data['descripcion']}

            Lee el Plan Maestro en: {PLAN_MAESTRO}
            Revisa componentes existentes en: {COMPONENTS_PATH}

            Genera:
            1. Lista detallada de lo que falta
            2. Dependencias entre componentes
            3. Orden óptimo de implementación
            4. Estimaciones de tiempo (horas)

            Formato: JSON con estructura clara
            """,
            agent=self.analyst,
            expected_output="JSON con análisis completo y plan de acción"
        )
        tasks.append(analysis_task)

        # Task 2: Diseño arquitectónico
        for componente in gap_data['componentes']:
            design_task = Task(
                description=f"""
                Diseña la arquitectura para: {componente['nombre']}
                - Path: {componente['path']}
                - Tipo: {componente['tipo']}
                - Descripción: {componente['descripcion']}
                - Líneas estimadas: {componente['lineas_estimadas']}

                Define:
                1. Interfaces TypeScript (props, state)
                2. Estructura de componentes (parent/children)
                3. Hooks necesarios (useState, useEffect, custom hooks)
                4. Integraciones (Firebase, React Query, Zustand)
                5. Estilos (TailwindCSS classes)
                6. Animaciones (Framer Motion variants)

                Formato: Documento arquitectónico con código TypeScript
                """,
                agent=self.architect,
                expected_output="Diseño arquitectónico completo con interfaces TypeScript",
                context=[analysis_task]
            )
            tasks.append(design_task)

            # Task 3: Implementación
            implementation_task = Task(
                description=f"""
                Implementa el componente: {componente['nombre']}
                Basándote en el diseño arquitectónico previo.

                Requisitos:
                1. TypeScript estricto (sin any)
                2. React 18 + hooks modernos
                3. TailwindCSS para estilos
                4. Framer Motion para animaciones
                5. Validación con Zod (si aplica)
                6. React Query para data fetching
                7. Comentarios JSDoc
                8. Manejo de errores robusto
                9. Accesibilidad (ARIA labels)
                10. Responsive design (mobile-first)

                Genera código completo listo para producción.
                """,
                agent=self.developer,
                expected_output=f"Código completo de {componente['nombre']} en TypeScript",
                context=[design_task]
            )
            tasks.append(implementation_task)

            # Task 4: Testing
            test_task = Task(
                description=f"""
                Crea tests para: {componente['nombre']}

                Tests requeridos:
                1. Unit tests (Vitest + React Testing Library)
                   - Renderizado básico
                   - Props validation
                   - Estado interno
                   - Eventos de usuario
                   - Casos edge

                2. Integration tests (si aplica)
                   - Integración con Firebase
                   - Flujos completos

                3. Accessibility tests
                   - Roles ARIA
                   - Keyboard navigation

                Cobertura mínima: 80%
                """,
                agent=self.tester,
                expected_output=f"Suite de tests completa para {componente['nombre']}",
                context=[implementation_task]
            )
            tasks.append(test_task)

        # Task 5: Revisión final
        review_task = Task(
            description=f"""
            Revisa todas las implementaciones del gap '{gap_name}':

            Checklist:
            1. ✅ Código sigue best practices
            2. ✅ TypeScript sin errores
            3. ✅ Tests pasan y cubren >80%
            4. ✅ Documentación clara (JSDoc)
            5. ✅ Accesibilidad completa
            6. ✅ Performance optimizada
            7. ✅ Consistencia con design system
            8. ✅ Sin code smells

            Genera reporte con:
            - Issues encontrados (críticos/menores)
            - Sugerencias de mejora
            - Aprobación final (sí/no)
            """,
            agent=self.reviewer,
            expected_output="Reporte de revisión con aprobación o lista de cambios",
            context=tasks
        )
        tasks.append(review_task)

        return tasks


    def run_automation(self, gaps_to_implement: List[str] = None):
        """Ejecuta el proceso de automatización"""

        if gaps_to_implement is None:
            gaps_to_implement = list(GAPS_CRITICOS.keys())

        print("\n" + "="*80)
        print("🚀 INICIANDO AUTOMATIZACIÓN CREWAI - FLOWDISTRIBUTOR")
        print("="*80)
        print(f"📅 Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📂 Base Path: {BASE_PATH}")
        print(f"🎯 Gaps a implementar: {len(gaps_to_implement)}")
        print("="*80 + "\n")

        all_tasks = []

        for gap_name in gaps_to_implement:
            if gap_name not in GAPS_CRITICOS:
                print(f"⚠️  Gap '{gap_name}' no encontrado, saltando...")
                continue

            gap_data = GAPS_CRITICOS[gap_name]
            print(f"\n📦 Procesando gap: {gap_name}")
            print(f"   Prioridad: {gap_data['prioridad']}")
            print(f"   Impacto: {gap_data['impacto']}")
            print(f"   Componentes: {len(gap_data['componentes'])}")

            tasks = self.create_tasks_for_gap(gap_name, gap_data)
            all_tasks.extend(tasks)

        print(f"\n✅ Total de tareas creadas: {len(all_tasks)}")
        print("\n" + "="*80)
        print("🤖 EJECUTANDO CREW...")
        print("="*80 + "\n")

        # Crear y ejecutar Crew
        crew = Crew(
            agents=[
                self.analyst,
                self.architect,
                self.developer,
                self.tester,
                self.reviewer
            ],
            tasks=all_tasks,
            process=Process.sequential,
            verbose=2
        )

        # Ejecutar
        result = crew.kickoff()

        print("\n" + "="*80)
        print("✅ AUTOMATIZACIÓN COMPLETADA")
        print("="*80)
        print("\n📊 Resultado:")
        print(result)

        # Guardar resultado
        output_path = BASE_PATH / "CREW_AI_EXECUTION_REPORT.md"
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# 🤖 Reporte de Ejecución CrewAI\n\n")
            f.write(f"**Fecha:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"**Gaps procesados:** {', '.join(gaps_to_implement)}\n\n")
            f.write(f"**Total de tareas:** {len(all_tasks)}\n\n")
            f.write("## Resultado\n\n")
            f.write(f"```\n{result}\n```\n")

        print(f"\n📄 Reporte guardado en: {output_path}")

        return result


# ============================================================================
# FUNCIONES HELPER
# ============================================================================

def generate_component_code(component_spec: Dict[str, Any]) -> str:
    """Genera código boilerplate para un componente"""

    nombre = component_spec['nombre']
    tipo = component_spec['tipo']
    descripcion = component_spec['descripcion']

    template = f"""import React from 'react';
import {{ motion }} from 'framer-motion';

/**
 * {nombre}
 *
 * {descripcion}
 *
 * @component
 */
interface {nombre.replace('.tsx', '')}Props {{
  // TODO: Definir props
}}

export const {nombre.replace('.tsx', '')}: React.FC<{nombre.replace('.tsx', '')}Props> = (props) => {{
  // TODO: Implementar lógica

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">{nombre.replace('.tsx', '')}</h2>
      <p className="text-gray-600 dark:text-gray-400">{descripcion}</p>

      {{/* TODO: Implementar UI */}}
    </motion.div>
  );
}};

export default {nombre.replace('.tsx', '')};
"""

    return template


def create_component_file(component_spec: Dict[str, Any], base_path: Path):
    """Crea un archivo de componente con boilerplate"""

    file_path = base_path / component_spec['path']
    file_path.parent.mkdir(parents=True, exist_ok=True)

    if file_path.exists():
        print(f"⚠️  {file_path} ya existe, saltando...")
        return

    code = generate_component_code(component_spec)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(code)

    print(f"✅ Creado: {file_path}")


def create_all_boilerplates():
    """Crea boilerplates para todos los componentes faltantes"""

    print("\n🚀 Creando boilerplates de componentes...")

    for gap_name, gap_data in GAPS_CRITICOS.items():
        print(f"\n📦 Gap: {gap_name}")
        for component in gap_data['componentes']:
            create_component_file(component, CHRONOS_PATH)

    print("\n✅ Boilerplates creados exitosamente!")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import sys

    print("""
    ╔══════════════════════════════════════════════════════════════════════════╗
    ║                                                                          ║
    ║        🤖 CREWAI AUTO-IMPLEMENTATION AGENT - FLOWDISTRIBUTOR            ║
    ║                                                                          ║
    ║  Sistema de automatización inteligente para completar componentes       ║
    ║  faltantes según el Plan Maestro                                        ║
    ║                                                                          ║
    ╚══════════════════════════════════════════════════════════════════════════╝
    """)

    if len(sys.argv) < 2:
        print("""
Uso:
    python crew-ai-implementation-agent.py <comando> [opciones]

Comandos:
    analyze              - Analiza gaps sin implementar
    boilerplate          - Crea archivos boilerplate para componentes faltantes
    implement <gap>      - Implementa un gap específico
    implement-all        - Implementa TODOS los gaps (tarda mucho)
    report               - Genera reporte de estado actual

Ejemplos:
    python crew-ai-implementation-agent.py analyze
    python crew-ai-implementation-agent.py boilerplate
    python crew-ai-implementation-agent.py implement bancos_tabs
    python crew-ai-implementation-agent.py implement-all
        """)
        sys.exit(1)

    comando = sys.argv[1].lower()

    if comando == "analyze":
        print("\n📊 Analizando gaps críticos...\n")
        for gap_name, gap_data in GAPS_CRITICOS.items():
            print(f"\n{'='*60}")
            print(f"📦 {gap_name.upper()}")
            print(f"{'='*60}")
            print(f"Prioridad: {gap_data['prioridad']}")
            print(f"Impacto: {gap_data['impacto']}")
            print(f"Descripción: {gap_data['descripcion']}")
            print(f"\nComponentes ({len(gap_data['componentes'])}):")
            for comp in gap_data['componentes']:
                print(f"  - {comp['nombre']} ({comp['lineas_estimadas']} líneas)")
                print(f"    {comp['descripcion']}")

    elif comando == "boilerplate":
        create_all_boilerplates()

    elif comando == "implement":
        if len(sys.argv) < 3:
            print("❌ Error: Especifica el gap a implementar")
            print(f"Gaps disponibles: {', '.join(GAPS_CRITICOS.keys())}")
            sys.exit(1)

        gap_name = sys.argv[2]
        if gap_name not in GAPS_CRITICOS:
            print(f"❌ Error: Gap '{gap_name}' no encontrado")
            print(f"Gaps disponibles: {', '.join(GAPS_CRITICOS.keys())}")
            sys.exit(1)

        crew = ChronosCrewAI()
        crew.run_automation([gap_name])

    elif comando == "implement-all":
        confirm = input("⚠️  Esto implementará TODOS los gaps. ¿Continuar? (s/n): ")
        if confirm.lower() != 's':
            print("❌ Cancelado")
            sys.exit(0)

        crew = ChronosCrewAI()
        crew.run_automation()

    elif comando == "report":
        print("\n📊 Generando reporte de estado...\n")
        total_componentes = sum(len(gap['componentes']) for gap in GAPS_CRITICOS.values())
        total_lineas = sum(
            comp['lineas_estimadas']
            for gap in GAPS_CRITICOS.values()
            for comp in gap['componentes']
        )

        print(f"Total de gaps: {len(GAPS_CRITICOS)}")
        print(f"Total de componentes faltantes: {total_componentes}")
        print(f"Total de líneas estimadas: {total_lineas:,}")
        print(f"\nDesglose por prioridad:")

        for prioridad in ["CRÍTICA", "ALTA", "MEDIA"]:
            gaps = [g for g, d in GAPS_CRITICOS.items() if d['prioridad'] == prioridad]
            if gaps:
                print(f"  {prioridad}: {len(gaps)} gaps")
                for gap in gaps:
                    print(f"    - {gap}: {GAPS_CRITICOS[gap]['impacto']} de impacto")

    else:
        print(f"❌ Comando desconocido: {comando}")
        sys.exit(1)
