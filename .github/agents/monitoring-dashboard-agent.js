/**
 * 📊 Monitoring Dashboard Agent
 *
 * Real-time monitoring agent that:
 * - Monitors PR status and health
 * - Tracks CI/CD pipeline status
 * - Monitors test results and coverage
 * - Tracks performance metrics
 * - Alerts on security issues
 * - Generates status dashboards
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;

class MonitoringDashboardAgent {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    this.owner = 'zoro488';
    this.repo = 'premium-ecosystem';
    this.metrics = {
      prs: {},
      issues: {},
      workflows: {},
      tests: {},
      security: {},
      performance: {}
    };
  }

  /**
   * Main execution flow
   */
  async run() {
    console.log('📊 Monitoring Dashboard Agent iniciando...');

    try {
      await this.collectMetrics();
      await this.analyzeHealth();
      await this.generateAlerts();
      await this.createDashboard();
      await this.publishReport();

      console.log('✅ Monitoring Dashboard Agent completado');

    } catch (error) {
      console.error('❌ Error en Monitoring Dashboard Agent:', error);
      throw error;
    }
  }

  /**
   * Collect all metrics
   */
  async collectMetrics() {
    console.log('📊 Recolectando métricas...');

    await Promise.all([
      this.collectPRMetrics(),
      this.collectIssueMetrics(),
      this.collectWorkflowMetrics(),
      this.collectSecurityMetrics()
    ]);

    console.log('✅ Métricas recolectadas');
  }

  /**
   * Collect PR metrics
   */
  async collectPRMetrics() {
    const { data: prs } = await this.octokit.rest.pulls.list({
      owner: this.owner,
      repo: this.repo,
      state: 'open',
      per_page: 100
    });

    this.metrics.prs = {
      total_open: prs.length,
      by_author: this.groupBy(prs, 'user.login'),
      by_label: this.groupByLabels(prs),
      stale: prs.filter(pr => this.isStale(pr.updated_at)).length,
      draft: prs.filter(pr => pr.draft).length,
      ready: prs.filter(pr => !pr.draft).length,
      oldest: prs.length > 0 ? prs[prs.length - 1].created_at : null
    };
  }

  /**
   * Collect issue metrics
   */
  async collectIssueMetrics() {
    const { data: issues } = await this.octokit.rest.issues.listForRepo({
      owner: this.owner,
      repo: this.repo,
      state: 'open',
      per_page: 100
    });

    // Filter out PRs (GitHub API returns both)
    const actualIssues = issues.filter(issue => !issue.pull_request);

    this.metrics.issues = {
      total_open: actualIssues.length,
      by_label: this.groupByLabels(actualIssues),
      critical: actualIssues.filter(i =>
        i.labels.some(l => l.name === 'critical')
      ).length,
      security: actualIssues.filter(i =>
        i.labels.some(l => l.name === 'security')
      ).length,
      stale: actualIssues.filter(i => this.isStale(i.updated_at)).length
    };
  }

  /**
   * Collect workflow metrics
   */
  async collectWorkflowMetrics() {
    const { data: runs } = await this.octokit.rest.actions.listWorkflowRunsForRepo({
      owner: this.owner,
      repo: this.repo,
      per_page: 50
    });

    this.metrics.workflows = {
      total_runs: runs.total_count,
      recent_runs: runs.workflow_runs.slice(0, 10).map(run => ({
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created_at: run.created_at
      })),
      success_rate: this.calculateSuccessRate(runs.workflow_runs),
      by_conclusion: this.groupBy(runs.workflow_runs, 'conclusion'),
      failures: runs.workflow_runs.filter(r => r.conclusion === 'failure').length
    };
  }

  /**
   * Collect security metrics
   */
  async collectSecurityMetrics() {
    try {
      const { data: alerts } = await this.octokit.rest.secretScanning.listAlertsForRepo({
        owner: this.owner,
        repo: this.repo,
        state: 'open'
      });

      this.metrics.security = {
        secret_alerts: alerts.length,
        alert_types: this.groupBy(alerts, 'secret_type')
      };
    } catch (error) {
      this.metrics.security = {
        secret_alerts: 0,
        error: 'Secret scanning not available or no access'
      };
    }
  }

  /**
   * Analyze overall health
   */
  async analyzeHealth() {
    console.log('🏥 Analizando salud del sistema...');

    const health = {
      score: 0,
      status: 'unknown',
      issues: []
    };

    // Check PR health
    if (this.metrics.prs.total_open > 30) {
      health.issues.push('Too many open PRs (>30)');
      health.score -= 10;
    }

    if (this.metrics.prs.stale > 10) {
      health.issues.push('Many stale PRs (>10)');
      health.score -= 10;
    }

    // Check issue health
    if (this.metrics.issues.critical > 5) {
      health.issues.push('Multiple critical issues open');
      health.score -= 20;
    }

    if (this.metrics.issues.security > 10) {
      health.issues.push('Many security issues open');
      health.score -= 30;
    }

    // Check workflow health
    if (this.metrics.workflows.success_rate < 0.7) {
      health.issues.push('Low workflow success rate (<70%)');
      health.score -= 25;
    }

    // Calculate final score (start at 100, subtract penalties)
    health.score = Math.max(0, 100 + health.score);

    // Determine status
    if (health.score >= 80) health.status = 'healthy';
    else if (health.score >= 60) health.status = 'warning';
    else health.status = 'critical';

    this.metrics.health = health;

    console.log(`🏥 Health Score: ${health.score}/100 (${health.status})`);
  }

  /**
   * Generate alerts
   */
  async generateAlerts() {
    console.log('🚨 Generando alertas...');

    const alerts = [];

    // Critical issues alert
    if (this.metrics.issues.critical > 0) {
      alerts.push({
        level: 'critical',
        message: `${this.metrics.issues.critical} critical issues require immediate attention`,
        action: 'Review and prioritize critical issues'
      });
    }

    // Security alert
    if (this.metrics.issues.security > 40) {
      alerts.push({
        level: 'high',
        message: `${this.metrics.issues.security} security issues open`,
        action: 'Consolidate and resolve security vulnerabilities'
      });
    }

    // Stale PR alert
    if (this.metrics.prs.stale > 15) {
      alerts.push({
        level: 'medium',
        message: `${this.metrics.prs.stale} stale PRs (>7 days old)`,
        action: 'Review and merge or close stale PRs'
      });
    }

    // Workflow failure alert
    if (this.metrics.workflows.failures > 5) {
      alerts.push({
        level: 'medium',
        message: `${this.metrics.workflows.failures} recent workflow failures`,
        action: 'Investigate and fix failing workflows'
      });
    }

    this.metrics.alerts = alerts;

    console.log(`🚨 ${alerts.length} alertas generadas`);
  }

  /**
   * Create dashboard
   */
  async createDashboard() {
    console.log('📊 Creando dashboard...');

    const dashboard = this.generateDashboardMarkdown();

    await fs.mkdir('automation-reports', { recursive: true });
    await fs.writeFile('automation-reports/dashboard.md', dashboard);

    console.log('✅ Dashboard creado');
  }

  /**
   * Generate dashboard markdown
   */
  generateDashboardMarkdown() {
    const timestamp = new Date().toISOString();

    return `# 📊 Premium Ecosystem - Monitoring Dashboard

**Last Updated:** ${timestamp}
**Health Status:** ${this.getHealthBadge()} ${this.metrics.health.status.toUpperCase()}

---

## 🏥 System Health

**Score:** ${this.metrics.health.score}/100

${this.metrics.health.issues.length > 0 ? `
### ⚠️ Issues Detected
${this.metrics.health.issues.map(issue => `- ${issue}`).join('\n')}
` : '✅ No major issues detected'}

---

## 🔄 Pull Requests

- **Total Open:** ${this.metrics.prs.total_open}
- **Ready for Review:** ${this.metrics.prs.ready}
- **Draft:** ${this.metrics.prs.draft}
- **Stale (>7 days):** ${this.metrics.prs.stale}

### By Author
${Object.entries(this.metrics.prs.by_author || {})
  .map(([author, count]) => `- ${author}: ${count}`)
  .join('\n')}

---

## 📋 Issues

- **Total Open:** ${this.metrics.issues.total_open}
- **Critical:** ${this.metrics.issues.critical} 🔴
- **Security:** ${this.metrics.issues.security} 🔒
- **Stale:** ${this.metrics.issues.stale}

---

## 🤖 Workflows

- **Success Rate:** ${(this.metrics.workflows.success_rate * 100).toFixed(1)}%
- **Recent Failures:** ${this.metrics.workflows.failures}

### Recent Runs
${this.metrics.workflows.recent_runs
  .map(run => `- ${this.getStatusEmoji(run.conclusion)} ${run.name} - ${run.status}`)
  .join('\n')}

---

## 🚨 Active Alerts

${this.metrics.alerts.length > 0 ?
  this.metrics.alerts.map(alert =>
    `### ${this.getAlertEmoji(alert.level)} ${alert.level.toUpperCase()}
- **Message:** ${alert.message}
- **Action:** ${alert.action}
`).join('\n') :
  '✅ No active alerts'}

---

## 📈 Recommendations

${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

---

*Auto-generated by Monitoring Dashboard Agent*
`;
  }

  /**
   * Get health badge
   */
  getHealthBadge() {
    if (this.metrics.health.score >= 80) return '🟢';
    if (this.metrics.health.score >= 60) return '🟡';
    return '🔴';
  }

  /**
   * Get status emoji
   */
  getStatusEmoji(conclusion) {
    const map = {
      success: '✅',
      failure: '❌',
      cancelled: '⚠️',
      skipped: '⏭️'
    };
    return map[conclusion] || '❓';
  }

  /**
   * Get alert emoji
   */
  getAlertEmoji(level) {
    const map = {
      critical: '🔴',
      high: '🟠',
      medium: '🟡',
      low: '🔵'
    };
    return map[level] || '⚪';
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recs = [];

    if (this.metrics.prs.stale > 10) {
      recs.push('Schedule PR review sessions to reduce stale PRs');
    }

    if (this.metrics.issues.security > 40) {
      recs.push('Create master security issue to consolidate vulnerabilities');
    }

    if (this.metrics.workflows.success_rate < 0.8) {
      recs.push('Investigate and fix workflow failures to improve CI/CD reliability');
    }

    if (this.metrics.prs.total_open > 30) {
      recs.push('Implement auto-merge for safe Dependabot PRs');
    }

    return recs;
  }

  /**
   * Publish report
   */
  async publishReport() {
    console.log('📤 Publicando reporte...');

    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics
    };

    await fs.writeFile(
      'automation-reports/monitoring-report.json',
      JSON.stringify(report, null, 2)
    );

    console.log('✅ Reporte publicado');
  }

  // Helper methods
  groupBy(array, key) {
    return array.reduce((result, item) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], item);
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {});
  }

  groupByLabels(items) {
    const labelCounts = {};
    items.forEach(item => {
      item.labels.forEach(label => {
        labelCounts[label.name] = (labelCounts[label.name] || 0) + 1;
      });
    });
    return labelCounts;
  }

  isStale(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const daysDiff = (now - date) / (1000 * 60 * 60 * 24);
    return daysDiff > 7;
  }

  calculateSuccessRate(runs) {
    if (runs.length === 0) return 0;
    const successful = runs.filter(r => r.conclusion === 'success').length;
    return successful / runs.length;
  }
}

// Main execution
if (require.main === module) {
  const agent = new MonitoringDashboardAgent();
  agent.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = MonitoringDashboardAgent;
