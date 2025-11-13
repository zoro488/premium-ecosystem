import { memo } from 'react';

import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const GastosAztecaTable = memo(({ data }) => {
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="overflow-auto h-full">
      <motion.table
        className="min-w-full text-sm text-left text-slate-300"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 sticky top-0 backdrop-blur-sm">
          <tr>
            <th scope="col" className="px-6 py-3">
              Fecha
            </th>
            <th scope="col" className="px-6 py-3">
              Origen
            </th>
            <th scope="col" className="px-6 py-3">
              Concepto
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Gasto
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((gasto, index) => (
            <motion.tr
              key={index}
              className="border-b border-slate-800 hover:bg-slate-800/50"
              variants={rowVariants}
            >
              <td className="px-6 py-4 whitespace-nowrap">{gasto.fecha}</td>
              <td className="px-6 py-4 font-medium text-white">{gasto.origen}</td>
              <td className="px-6 py-4 text-slate-400">{gasto.concepto}</td>
              <td className="px-6 py-4 text-right font-bold text-red-400">
                {formatCurrency(gasto.gasto)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </div>
  );
});

GastosAztecaTable.displayName = 'GastosAztecaTable';

GastosAztecaTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GastosAztecaTable;
