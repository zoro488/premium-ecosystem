/**
 * ⏰ AUTOMATION SCHEDULER
 * Sistema de automatización programada sin intervención humana
 * Ejecuta tareas en segundo plano según configuración
 */
import fs from 'node:fs/promises';

import { getJobQueue } from './BackgroundJobProcessor.js';

class AutomationScheduler {
  constructor() {
    this.jobQueue = getJobQueue();
    this.schedules = [];
    this.isRunning = false;
    this.timers = new Map();
  }

  /**
   * Carga configuración de automatizaciones
   */
  async loadSchedules(configPath = './automation-schedules.json') {
    try {
      const content = await fs.readFile(configPath, 'utf-8');
      this.schedules = JSON.parse(content);
      return this.schedules;
    } catch (_error) {
      this.schedules = this.getDefaultSchedules();
      return this.schedules;
    }
  }

  /**
   * Configuración por defecto
   */
  getDefaultSchedules() {
    return [
      {
        id: 'daily-components',
        name: 'Generación diaria de componentes',
        enabled: true,
        schedule: {
          type: 'daily',
          time: '02:00', // 2 AM
        },
        task: {
          type: 'batch-components',
          params: {
            count: 5,
            styles: ['glassmorphism-futuristic', 'modern-corporate', 'cyberpunk-neon'],
          },
        },
      },
      {
        id: 'weekly-design-system',
        name: 'Actualización semanal de design system',
        enabled: true,
        schedule: {
          type: 'weekly',
          day: 'monday',
          time: '03:00',
        },
        task: {
          type: 'generate-design-system',
          params: {
            name: 'WeeklySystem',
            format: 'all',
          },
        },
      },
      {
        id: 'hourly-assets',
        name: 'Generación horaria de assets',
        enabled: false,
        schedule: {
          type: 'hourly',
          minute: 0,
        },
        task: {
          type: 'generate-assets',
          params: {
            project: 'AutoAssets',
            types: ['backgrounds', 'icons'],
            count: 10,
          },
        },
      },
      {
        id: 'nightly-optimization',
        name: 'Optimización nocturna de componentes',
        enabled: true,
        schedule: {
          type: 'daily',
          time: '01:00',
        },
        task: {
          type: 'optimize-components',
          params: {
            targetDir: 'src/components',
            metrics: ['performance', 'accessibility', 'bundle-size'],
          },
        },
      },
    ];
  }

  /**
   * Inicia el scheduler
   */
  async start() {
    if (this.isRunning) {
      return;
    }

    await this.loadSchedules();
    this.isRunning = true;

    // Programar todas las tareas habilitadas
    for (const schedule of this.schedules) {
      if (schedule.enabled) {
        this.scheduleTask(schedule);
      }
    }
  }

  /**
   * Detiene el scheduler
   */
  stop() {
    this.isRunning = false;

    // Cancelar todos los timers
    for (const [_id, timer] of this.timers) {
      clearTimeout(timer);
      clearInterval(timer);
    }

    this.timers.clear();
  }

  /**
   * Programa una tarea individual
   */
  scheduleTask(schedule) {
    const { id, name, schedule: timing, task } = schedule;

    let delay;
    switch (timing.type) {
      case 'hourly':
        delay = this.calculateHourlyDelay(timing.minute || 0);
        break;
      case 'daily':
        delay = this.calculateDailyDelay(timing.time);
        break;
      case 'weekly':
        delay = this.calculateWeeklyDelay(timing.day, timing.time);
        break;
      case 'interval':
        delay = timing.intervalMs || 3600000; // Default 1 hora
        break;
      default:
        return;
    }

    const execute = () => {
      // Agregar job al queue
      const _jobId = this.jobQueue.addJob({
        type: task.type,
        params: task.params,
      });

      // Re-programar para siguiente ejecución
      if (this.isRunning) {
        this.scheduleTask(schedule);
      }
    };

    const timer = setTimeout(execute, delay);
    this.timers.set(id, timer);

    const _nextRun = new Date(Date.now() + delay);
  }

  /**
   * Calcula delay para ejecución horaria
   */
  calculateHourlyDelay(minute) {
    const now = new Date();
    const next = new Date(now);

    next.setMinutes(minute);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (next <= now) {
      next.setHours(next.getHours() + 1);
    }

    return next - now;
  }

  /**
   * Calcula delay para ejecución diaria
   */
  calculateDailyDelay(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const next = new Date(now);

    next.setHours(hours);
    next.setMinutes(minutes);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    return next - now;
  }

  /**
   * Calcula delay para ejecución semanal
   */
  calculateWeeklyDelay(dayName, time) {
    const days = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const targetDay = days[dayName.toLowerCase()];
    const [hours, minutes] = time.split(':').map(Number);

    const now = new Date();
    const next = new Date(now);

    next.setHours(hours);
    next.setMinutes(minutes);
    next.setSeconds(0);
    next.setMilliseconds(0);

    const currentDay = now.getDay();
    let daysUntilTarget = targetDay - currentDay;

    if (daysUntilTarget < 0 || (daysUntilTarget === 0 && next <= now)) {
      daysUntilTarget += 7;
    }

    next.setDate(next.getDate() + daysUntilTarget);

    return next - now;
  }

  /**
   * Ejecuta una tarea manualmente
   */
  async executeNow(scheduleId) {
    const schedule = this.schedules.find((s) => s.id === scheduleId);

    if (!schedule) {
      throw new Error(`Schedule con ID ${scheduleId} no encontrado`);
    }

    const jobId = this.jobQueue.addJob({
      type: schedule.task.type,
      params: schedule.task.params,
    });

    return jobId;
  }

  /**
   * Habilita/deshabilita una tarea programada
   */
  toggleSchedule(scheduleId, enabled) {
    const schedule = this.schedules.find((s) => s.id === scheduleId);

    if (!schedule) {
      throw new Error(`Schedule con ID ${scheduleId} no encontrado`);
    }

    schedule.enabled = enabled;

    if (enabled && this.isRunning) {
      this.scheduleTask(schedule);
    } else {
      const timer = this.timers.get(scheduleId);
      if (timer) {
        clearTimeout(timer);
        clearInterval(timer);
        this.timers.delete(scheduleId);
      }
    }
  }

  /**
   * Agrega una nueva tarea programada
   */
  addSchedule(schedule) {
    // Validar estructura
    if (!schedule.id || !schedule.name || !schedule.schedule || !schedule.task) {
      throw new Error('Schedule inválido: faltan propiedades requeridas');
    }

    // Verificar que no exista
    if (this.schedules.find((s) => s.id === schedule.id)) {
      throw new Error(`Ya existe un schedule con ID: ${schedule.id}`);
    }

    this.schedules.push(schedule);

    if (schedule.enabled && this.isRunning) {
      this.scheduleTask(schedule);
    }
  }

  /**
   * Elimina una tarea programada
   */
  removeSchedule(scheduleId) {
    const index = this.schedules.findIndex((s) => s.id === scheduleId);

    if (index === -1) {
      throw new Error(`Schedule con ID ${scheduleId} no encontrado`);
    }

    const _schedule = this.schedules[index];
    this.schedules.splice(index, 1);

    // Cancelar timer si existe
    const timer = this.timers.get(scheduleId);
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      this.timers.delete(scheduleId);
    }
  }

  /**
   * Obtiene estado de todas las tareas
   */
  getStatus() {
    return {
      running: this.isRunning,
      schedulesCount: this.schedules.length,
      activeSchedules: this.schedules.filter((s) => s.enabled).length,
      schedules: this.schedules.map((s) => ({
        id: s.id,
        name: s.name,
        enabled: s.enabled,
        nextRun: this.getNextRunTime(s),
        type: s.schedule.type,
      })),
    };
  }

  /**
   * Calcula próxima ejecución de una tarea
   */
  getNextRunTime(schedule) {
    if (!schedule.enabled) return null;

    const { type, time, day, minute, intervalMs } = schedule.schedule;
    let delay;

    switch (type) {
      case 'hourly':
        delay = this.calculateHourlyDelay(minute || 0);
        break;
      case 'daily':
        delay = this.calculateDailyDelay(time);
        break;
      case 'weekly':
        delay = this.calculateWeeklyDelay(day, time);
        break;
      case 'interval':
        delay = intervalMs || 3600000;
        break;
      default:
        return null;
    }

    return new Date(Date.now() + delay);
  }

  /**
   * Guarda configuración actual
   */
  async saveSchedules(configPath = './automation-schedules.json') {
    await fs.writeFile(configPath, JSON.stringify(this.schedules, null, 2), 'utf-8');
  }
}

// Singleton
let schedulerInstance = null;

export function getScheduler() {
  if (!schedulerInstance) {
    schedulerInstance = new AutomationScheduler();
  }
  return schedulerInstance;
}

export default AutomationScheduler;

/**
 * 🎯 EJEMPLO DE USO
 *
 * import { getScheduler } from './AutomationScheduler'
 *
 * const scheduler = getScheduler()
 *
 * // Iniciar scheduler
 * await scheduler.start()
 *
 * // Ver estado
 * console.log(scheduler.getStatus())
 *
 * // Ejecutar tarea manualmente
 * await scheduler.executeNow('daily-components')
 *
 * // Agregar nueva tarea
 * scheduler.addSchedule({
 *   id: 'custom-task',
 *   name: 'Mi tarea custom',
 *   enabled: true,
 *   schedule: {
 *     type: 'daily',
 *     time: '14:00'
 *   },
 *   task: {
 *     type: 'generate-component',
 *     params: { name: 'AutoComponent' }
 *   }
 * })
 *
 * // Deshabilitar tarea
 * scheduler.toggleSchedule('hourly-assets', false)
 *
 * // Detener scheduler
 * scheduler.stop()
 */
