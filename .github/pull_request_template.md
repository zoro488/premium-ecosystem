# Pull Request

## Descripción
<!-- Descripción clara y concisa de los cambios -->

## Tipo de Cambio
<!-- Marca con 'x' las opciones que apliquen -->

- [ ] Bug fix (cambio que arregla un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que rompe compatibilidad)
- [ ] Refactoring (mejora de código sin cambiar funcionalidad)
- [ ] Documentación
- [ ] Testing
- [ ] CI/CD
- [ ] Otro (especificar):

## Aplicaciones Afectadas
<!-- Marca con 'x' todas las que apliquen -->

- [ ] FlowDistributor
- [ ] ShadowPrime
- [ ] Apollo
- [ ] Synapse
- [ ] Nexus
- [ ] Hub Principal
- [ ] Componentes Compartidos
- [ ] Configuración/Build

## Issue Relacionado
<!-- Vincula el issue que resuelve este PR -->

Closes #(issue_number)
Fixes #(issue_number)
Related to #(issue_number)

## Cambios Realizados
<!-- Lista detallada de cambios -->

-
-
-

## Screenshots o Videos
<!-- Si aplica, agrega imágenes o videos demostrando los cambios -->

## Testing Realizado
<!-- Describe las pruebas que realizaste -->

- [ ] Unit tests agregados/actualizados
- [ ] E2E tests agregados/actualizados
- [ ] Testing manual realizado
- [ ] Testing en diferentes navegadores
- [ ] Testing responsive (mobile/tablet)

### Casos de Prueba
<!-- Describe los escenarios que probaste -->

1.
2.
3.

## Checklist
<!-- Marca con 'x' cuando hayas completado cada item -->

- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/funcionalidad
- [ ] Los tests unitarios pasan localmente (`npm run test`)
- [ ] Los tests E2E pasan localmente (`npm run test:e2e`)
- [ ] El build funciona correctamente (`npm run build`)
- [ ] El linter no muestra errores (`npm run lint`)

## Dependencias
<!-- ¿Este PR depende de otro PR? -->

- [ ] Este PR es independiente
- [ ] Depende de PR #(number)
- [ ] Debe mergearse antes de PR #(number)

## Consideraciones de Deploy
<!-- Información importante para el deployment -->

- [ ] No requiere cambios en variables de entorno
- [ ] Requiere nuevas variables de entorno (listar abajo)
- [ ] No requiere migración de datos
- [ ] Requiere migración de datos (explicar abajo)
- [ ] No hay breaking changes
- [ ] Hay breaking changes (documentar abajo)

### Variables de Entorno Nuevas
<!-- Si agregaste nuevas variables de entorno, lístalas aquí -->

```bash
# Variable: NOMBRE_VARIABLE
# Descripción: Para qué sirve
# Ejemplo: valor_ejemplo
```

### Migración de Datos
<!-- Si se requiere migración, explica el proceso -->

## Performance
<!-- ¿Hay impacto en el performance? -->

- [ ] Sin impacto en performance
- [ ] Mejora de performance (explicar abajo)
- [ ] Posible impacto en performance (explicar abajo)

## Seguridad
<!-- ¿Hay consideraciones de seguridad? -->

- [ ] Sin implicaciones de seguridad
- [ ] Mejora de seguridad
- [ ] Requiere revisión de seguridad

## Información Adicional
<!-- Cualquier información adicional relevante -->

## Reviewers
<!-- Menciona a las personas que deberían revisar este PR -->

@username
