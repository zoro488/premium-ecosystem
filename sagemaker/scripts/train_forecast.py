import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
import joblib
import sys

def train():
    # Leer datos
    data = pd.read_csv('/opt/ml/input/data/training/sales_data.csv')

    # Preparar features
    X = data[['week', 'previous_sales', 'trend']]
    y = data['sales']

    # Entrenar modelo
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Guardar modelo
    joblib.dump(model, '/opt/ml/model/model.joblib')
    print('Modelo entrenado y guardado')

if __name__ == '__main__':
    train()
