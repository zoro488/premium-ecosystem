/**
 * Data Initializer - Carga datos desde JSON
 */

export async function initializeData() {
  try {
    const response = await fetch('/data/BASE_DATOS_FLOWDISTRIBUTOR_UNIFICADO.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
}

export async function loadJSONData(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    return null;
  }
}

export default {
  initializeData,
  loadJSONData,
};
