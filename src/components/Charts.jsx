import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const ReportsCharts = ({ bancos, totalIngresos, totalEgresos }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pie - Distribución de Bancos */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Gráfico de Distribución de Capital</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={Object.entries(bancos).map(([key, banco]) => ({
                name: {
                  bovedaMonte: 'Bóveda Monte',
                  utilidades: 'Utilidades',
                  fletes: 'Fletes',
                  azteca: 'Azteca',
                  leftie: 'Leftie',
                  profit: 'Profit'
                }[key],
                value: banco.capitalActual
              }))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {Object.entries(bancos).map((entry, index) => {
                const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Barras - Comparación de Bancos */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Comparación de Capital por Banco</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={Object.entries(bancos).map(([key, banco]) => ({
              name: {
                bovedaMonte: 'Bóveda Monte',
                utilidades: 'Utilidades',
                fletes: 'Fletes',
                azteca: 'Azteca',
                leftie: 'Leftie',
                profit: 'Profit'
              }[key].split(' ')[0],
              capital: banco.capitalActual
            }))}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Bar dataKey="capital" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {Object.entries(bancos).map((entry, index) => {
                const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
                return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Área - Flujo de Caja */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Tendencia de Ingresos vs Egresos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={[
              { mes: 'Ene', ingresos: totalIngresos * 0.7, egresos: totalEgresos * 0.6 },
              { mes: 'Feb', ingresos: totalIngresos * 0.8, egresos: totalEgresos * 0.75 },
              { mes: 'Mar', ingresos: totalIngresos * 0.9, egresos: totalEgresos * 0.85 },
              { mes: 'Abr', ingresos: totalIngresos, egresos: totalEgresos },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Area type="monotone" dataKey="ingresos" stroke="#10b981" fillOpacity={1} fill="url(#colorIngresos)" />
            <Area type="monotone" dataKey="egresos" stroke="#ef4444" fillOpacity={1} fill="url(#colorEgresos)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Líneas - Evolución de Balance */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4">Evolución del Balance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={[
              { mes: 'Ene', balance: (totalIngresos - totalEgresos) * 0.65 },
              { mes: 'Feb', balance: (totalIngresos - totalEgresos) * 0.75 },
              { mes: 'Mar', balance: (totalIngresos - totalEgresos) * 0.88 },
              { mes: 'Abr', balance: totalIngresos - totalEgresos },
            ]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsCharts;