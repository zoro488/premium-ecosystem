# 🔥 E2E Validation System: Excel → Firestore → UI

## Overview

This directory contains End-to-End (E2E) validation tests that verify the complete data flow from Excel import through Firestore storage to UI rendering.

## Purpose

The E2E validation system ensures that:
1. ✅ Data from Excel files is correctly imported
2. ✅ Imported data is accurately stored in Firestore
3. ✅ UI components display the data correctly
4. ✅ Data integrity is maintained throughout the flow
5. ✅ No duplicates or data corruption occurs

## Test Files

### excel-to-ui.test.tsx

Main E2E test suite with 8 comprehensive tests:

1. **✅ Datos del Excel están disponibles** - Verifies Excel data can be loaded
2. **✅ Datos de Firestore están disponibles** - Verifies Firestore data is accessible
3. **✅ Cantidad de bancos: Excel = Firestore** - Validates record count consistency
4. **✅ Capital Total: Excel = Firestore** - Validates financial calculations
5. **✅ Todos los bancos del Excel están en Firestore** - Ensures all records imported
6. **✅ KPICard muestra el capital correctamente** - Validates UI rendering
7. **✅ Validación de estructura de datos de bancos** - Ensures data structure integrity
8. **✅ No hay bancos duplicados en Firestore** - Prevents duplicate records

## Running Tests

### Local Development

```bash
# Run E2E tests in watch mode
npm run test:e2e

# Run E2E tests once
npm run test:e2e:run

# Run E2E tests and generate validation report
npm run validate:all
```

### CI/CD

The E2E validation system runs automatically:
- Every 6 hours via GitHub Actions cron schedule
- On push to `main` branch
- On manual workflow dispatch

See `.github/workflows/e2e-validation.yml` for configuration.

## Test Configuration

E2E tests use a dedicated configuration file: `vitest.e2e.config.ts`

Key settings:
- **Timeout**: 60 seconds (to accommodate slower E2E operations)
- **Environment**: jsdom (for React component testing)
- **Execution**: Sequential (single thread to avoid race conditions)
- **Reports**: HTML reports in `test-results/e2e/`

## Mock Data

Tests use mock data by default to ensure they can run in any environment without dependencies on:
- Actual Excel files
- Live Firebase connections
- External services

The mock data structure mirrors production data:

```javascript
{
  bancos: [
    {
      id: 'banco-1',
      nombre: 'Banco Test 1',
      capitalActual: 1000000,
      tipo: 'Nacional',
      moneda: 'USD',
    },
    // ... more banks
  ]
}
```

## Integration with Firebase Emulators

To run tests against Firebase emulators (recommended for comprehensive testing):

1. Start Firebase emulators:
   ```bash
   firebase emulators:start --only firestore
   ```

2. Update test configuration to use emulator endpoints

3. Run tests:
   ```bash
   npm run test:e2e:run
   ```

## Validation Reports

After running E2E tests, a validation report is generated at:
`VALIDATION_REPORT.md`

The report includes:
- Execution timestamp
- Test results summary
- System component status
- Links to detailed HTML reports
- Next scheduled validation time

## Continuous Validation

The GitHub Actions workflow (`.github/workflows/e2e-validation.yml`) provides:

- **Automated Execution**: Runs every 6 hours
- **PR Creation**: Automatically creates PRs for successful validations
- **Artifact Upload**: Saves test results for 30 days
- **Failure Notifications**: Alerts when validation fails

## Best Practices

1. **Run tests before committing** changes to Excel import or UI components
2. **Check validation reports** after automated runs
3. **Investigate failures immediately** - they indicate data integrity issues
4. **Keep mock data updated** to reflect production data structure
5. **Add new tests** when adding new data fields or UI components

## Troubleshooting

### Tests Failing

1. Check the HTML test report: `test-results/e2e/index.html`
2. Review the validation report: `VALIDATION_REPORT.md`
3. Verify mock data structure matches components
4. Ensure Firebase mocks are properly configured

### Timeout Errors

If tests timeout:
- Increase timeout in `vitest.e2e.config.ts`
- Check for slow operations in components
- Verify network mocks are responding

### Import Errors

If imports fail:
- Check alias configuration in `vitest.e2e.config.ts`
- Verify component exports
- Ensure TypeScript configuration is correct

## Contributing

When adding new features that affect the Excel → Firestore → UI flow:

1. Add corresponding E2E tests
2. Update mock data if needed
3. Run `npm run validate:all` locally
4. Verify tests pass in CI/CD
5. Update this README if adding new test categories

## Related Documentation

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Firebase Testing](https://firebase.google.com/docs/emulator-suite)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Last Updated**: November 13, 2025  
**Maintained By**: Premium Ecosystem Team
