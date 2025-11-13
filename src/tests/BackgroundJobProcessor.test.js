/**
 * 🧪 TEST SUITE - Background Job Processor
 * Tests para sistema de queue de trabajos
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { getJobQueue } from '../services/BackgroundJobProcessor';

describe('BackgroundJobProcessor', () => {
  let queue;

  beforeEach(() => {
    queue = getJobQueue();
    queue.stop();
    queue.jobs = [];
  });

  afterEach(() => {
    queue.stop();
  });

  describe('addJob', () => {
    it('debería agregar un job al queue', () => {
      const jobId = queue.addJob({
        type: 'generate-component',
        params: { name: 'TestComponent' },
      });

      expect(jobId).toBeDefined();
      expect(queue.jobs).toHaveLength(1);
      expect(queue.jobs[0].status).toBe('pending');
    });

    it('debería emitir evento job:added', (done) => {
      queue.on('job:added', (job) => {
        expect(job).toHaveProperty('id');
        expect(job.type).toBe('generate-component');
        done();
      });

      queue.addJob({
        type: 'generate-component',
        params: {},
      });
    });
  });

  describe('processNext', () => {
    it('debería procesar jobs pendientes', async () => {
      const jobId = queue.addJob({
        type: 'generate-component',
        params: { name: 'Test' },
      });

      queue.start();

      // Esperar procesamiento
      await new Promise((resolve) => setTimeout(resolve, 100));

      const job = queue.getJobStatus(jobId);
      expect(['processing', 'completed']).toContain(job.status);
    });

    it('debería procesar múltiples jobs en paralelo', async () => {
      const jobs = [];
      for (let i = 0; i < 5; i++) {
        jobs.push(
          queue.addJob({
            type: 'generate-component',
            params: { name: `Component${i}` },
          })
        );
      }

      queue.start();

      // Verificar que se procesan en paralelo
      await new Promise((resolve) => setTimeout(resolve, 200));

      const activeWorkers = queue.activeWorkers;
      expect(activeWorkers).toBeGreaterThan(0);
      expect(activeWorkers).toBeLessThanOrEqual(4);
    });
  });

  describe('getJobStatus', () => {
    it('debería retornar el status de un job', () => {
      const jobId = queue.addJob({
        type: 'export-animation',
        params: {},
      });

      const status = queue.getJobStatus(jobId);
      expect(status).toHaveProperty('id', jobId);
      expect(status).toHaveProperty('status');
      expect(status).toHaveProperty('progress');
    });

    it('debería retornar null para job inexistente', () => {
      const status = queue.getJobStatus('invalid-id');
      expect(status).toBeNull();
    });
  });

  describe('cancelJob', () => {
    it('debería cancelar un job pendiente', () => {
      const jobId = queue.addJob({
        type: 'generate-component',
        params: {},
      });

      const result = queue.cancelJob(jobId);
      expect(result).toBe(true);

      const job = queue.getJobStatus(jobId);
      expect(job.status).toBe('cancelled');
    });

    it('no debería cancelar un job ya completado', () => {
      const jobId = queue.addJob({
        type: 'generate-component',
        params: {},
      });

      queue.jobs[0].status = 'completed';

      const result = queue.cancelJob(jobId);
      expect(result).toBe(false);
    });
  });

  describe('clearCompleted', () => {
    it('debería limpiar jobs completados', () => {
      queue.addJob({ type: 'generate-component', params: {} });
      queue.addJob({ type: 'export-animation', params: {} });

      queue.jobs[0].status = 'completed';
      queue.jobs[1].status = 'pending';

      queue.clearCompleted();

      expect(queue.jobs).toHaveLength(1);
      expect(queue.jobs[0].status).toBe('pending');
    });
  });

  describe('events', () => {
    it('debería emitir job:started cuando inicia procesamiento', (done) => {
      queue.on('job:started', (job) => {
        expect(job.status).toBe('processing');
        done();
      });

      queue.addJob({
        type: 'generate-component',
        params: { name: 'Test' },
      });
      queue.start();
    });

    it('debería emitir job:progress con porcentaje', (done) => {
      queue.on('job:progress', ({ id, progress }) => {
        expect(id).toBeDefined();
        expect(progress).toBeGreaterThanOrEqual(0);
        expect(progress).toBeLessThanOrEqual(100);
        done();
      });

      queue.addJob({
        type: 'generate-component',
        params: { name: 'Test' },
      });
      queue.start();
    });

    it('debería emitir job:completed cuando termina', (done) => {
      queue.on('job:completed', (job) => {
        expect(job.status).toBe('completed');
        expect(job).toHaveProperty('result');
        done();
      });

      queue.addJob({
        type: 'generate-component',
        params: { name: 'Test' },
      });
      queue.start();
    });
  });
});
