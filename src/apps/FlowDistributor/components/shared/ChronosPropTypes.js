/**
 * 🎯 CHRONOS PROPTYPES - Validación completa de props
 * PropTypes para todos los componentes del sistema CHRONOS
 */
import PropTypes from 'prop-types';

// ============================================================================
// CHRONOS HEADER
// ============================================================================
export const ChronosHeaderPropTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  notifications: PropTypes.number,
  onSearchChange: PropTypes.func,
  onNotificationClick: PropTypes.func,
  onRefresh: PropTypes.func,
  onSettings: PropTypes.func,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.elementType,
    })
  ),
};

// ============================================================================
// CHRONOS PANEL CONTAINER
// ============================================================================
export const ChronosPanelContainerPropTypes = {
  children: PropTypes.node.isRequired,
  enableParticles: PropTypes.bool,
  particleCount: PropTypes.number,
  className: PropTypes.string,
};

// ============================================================================
// CHRONOS CARD
// ============================================================================
export const ChronosCardPropTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  onClick: PropTypes.func,
  index: PropTypes.number,
};

export const ChronosStatCardPropTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  trend: PropTypes.number,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  index: PropTypes.number,
};

// ============================================================================
// CHRONOS TABLE
// ============================================================================
export const ChronosTablePropTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderCell: PropTypes.func,
  onRowClick: PropTypes.func,
  striped: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export const ChronosTableCardPropTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.elementType,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderCell: PropTypes.func,
  onRowClick: PropTypes.func,
  actions: PropTypes.node,
  striped: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

// ============================================================================
// CHRONOS BUTTON
// ============================================================================
export const ChronosButtonPropTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.elementType,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

// ============================================================================
// CHRONOS INPUT
// ============================================================================
export const ChronosInputPropTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.oneOf(['text', 'password', 'email', 'number', 'tel', 'url']),
  icon: PropTypes.elementType,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================================================
// CHRONOS MODAL
// ============================================================================
export const ChronosModalPropTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  showCloseButton: PropTypes.bool,
};

// ============================================================================
// CHRONOS BADGE
// ============================================================================
export const ChronosBadgePropTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pulse: PropTypes.bool,
  className: PropTypes.string,
};

// ============================================================================
// CHRONOS TABS
// ============================================================================
export const ChronosTabsPropTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      badge: PropTypes.number,
      icon: PropTypes.elementType,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

// ============================================================================
// CHRONOS PROGRESS
// ============================================================================
export const ChronosProgressPropTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  label: PropTypes.string,
  showPercentage: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
};

// ============================================================================
// CHRONOS TOOLTIP
// ============================================================================
export const ChronosTooltipPropTypes = {
  content: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
};

// ============================================================================
// CHRONOS LOGO
// ============================================================================
export const ChronosLogoPropTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  animated: PropTypes.bool,
};

// ============================================================================
// CHRONOS ERROR BOUNDARY
// ============================================================================
export const ChronosErrorBoundaryPropTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  onReset: PropTypes.func,
  onGoHome: PropTypes.func,
  fallback: PropTypes.func,
};

// ============================================================================
// CHRONOS DASHBOARD
// ============================================================================
export const ChronosDashboardPropTypes = {
  data: PropTypes.shape({
    stats: PropTypes.object,
    transactions: PropTypes.array,
    alerts: PropTypes.array,
  }),
  onNavigate: PropTypes.func,
};
