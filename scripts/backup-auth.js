#!/usr/bin/env node
/**
 * Backup Firebase Authentication Users
 * Exporta todos los usuarios de Firebase Auth
 */
import { cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

async function backupAuthUsers() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), 'backups', `auth_${timestamp}`);

  console.log('👥 Iniciando backup de usuarios de Firebase Auth...\n');
  console.log(`📁 Directorio: ${backupDir}\n`);

  fs.mkdirSync(backupDir, { recursive: true });

  const results = {
    timestamp: new Date().toISOString(),
    directory: backupDir,
    totalUsers: 0,
    users: [],
  };

  try {
    const listUsersResult = await auth.listUsers(1000);

    listUsersResult.users.forEach((userRecord) => {
      const userData = {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        disabled: userRecord.disabled,
        metadata: {
          creationTime: userRecord.metadata.creationTime,
          lastSignInTime: userRecord.metadata.lastSignInTime,
        },
        customClaims: userRecord.customClaims || {},
        providerData: userRecord.providerData,
      };

      results.users.push(userData);
      results.totalUsers++;
    });

    // Guardar backup
    const filePath = path.join(backupDir, 'users.json');
    fs.writeFileSync(filePath, JSON.stringify(results.users, null, 2));

    // Guardar metadata
    const metadataPath = path.join(backupDir, '_metadata.json');
    fs.writeFileSync(
      metadataPath,
      JSON.stringify(
        {
          timestamp: results.timestamp,
          totalUsers: results.totalUsers,
        },
        null,
        2
      )
    );

    console.log('═══════════════════════════════════════');
    console.log('✅ BACKUP COMPLETADO');
    console.log('═══════════════════════════════════════');
    console.log(`📁 Directorio: ${backupDir}`);
    console.log(`👥 Usuarios: ${results.totalUsers}`);
  } catch (error) {
    console.error('\n❌ Error en backup de Auth:', error);
    throw error;
  }

  console.log('\n--- AUTH BACKUP RESULTS ---');
  console.log(
    JSON.stringify(
      {
        timestamp: results.timestamp,
        totalUsers: results.totalUsers,
      },
      null,
      2
    )
  );

  return results;
}

backupAuthUsers()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
