 # Guía: Instalación y configuración segura de apps Enterprise (GitHub)

 Este documento explica cómo revocar el token expuesto, crear un nuevo token con scopes mínimos, y usar el script seguro `.github/scripts/install-enterprise-apps.ps1` para realizar operaciones administrativas de forma local.

 IMPORTANTE: Nunca pegues tokens en chats ni los subas a repositorios.


 ## 1) Revocar el token expuesto (acción inmediata)

 1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
 2. Localiza el token que se expuso y revócalo inmediatamente.
 3. Confirma la revocación. Si no ves el token, revisa `github.com/settings/tokens` en tu cuenta.


 ## 2) Crear un nuevo token (scopes mínimos)

 Crea un nuevo Personal Access Token (PAT) con los scopes mínimos necesarios. Para la mayoría de operaciones administrativas sobre organizaciones y apps podrás necesitar:

 - repo (si vas a operar con repositorios)
 - admin:org (si vas a gestionar configuración de org)
 - read:org (recomendado para consultas)
 - workflow (si vas a gestionar GitHub Actions)
 - admin:public_key (opcional, si gestionas keys)

 Recomendación: crea 2 tokens diferenciados: uno con scopes de solo lectura (usar para auditorías), y otro con permisos de escritura/administración **sólo** cuando se necesite.


 ## 3) Exportar el token en tu sesión local (PowerShell)

 En PowerShell (solo en la sesión actual), ejecuta:

 ```powershell
 $env:GITHUB_TOKEN = 'TU_NUEVO_TOKEN_AQUI'
 ```

 Alternativamente, para sesiones temporales en Linux/macOS:

 ```bash
 export GITHUB_TOKEN='TU_NUEVO_TOKEN_AQUI'
 ```

 No agregues esto a archivos dotfiles ni scripts que se suban al repositorio.


 ## 4) Usar el script seguro

 El repositorio incluye `.github/scripts/install-enterprise-apps.ps1`. Pasos:

 1. Abre PowerShell en el directorio del repositorio.
 2. Exporta tu token como se muestra arriba.
 3. Ejecuta:

 ```powershell
 pwsh .github/scripts/install-enterprise-apps.ps1
 ```

 El script intentará autenticar con `gh` usando el token de la variable de entorno y realizará comprobaciones de sólo lectura por defecto. Lee el contenido del script y las plantillas antes de descomentar cualquier acción de escritura.


 ## 5) Plantillas y ejemplos

 El script contiene plantillas comentadas para:

 - listar instalaciones de apps
 - solicitar instalación de una GitHub App en una org
 - habilitar Copilot en una org (plantilla)

 Cada plantilla incluye placeholders (`{org}`, `app_id`) que debes reemplazar antes de ejecutar.


 ## 6) Buenas prácticas y alternativas más seguras

 - En vez de PATs, usa GitHub Apps con permisos concretos y un backend que rote JWTs automáticamente.
 - Considera usar OIDC (workflows) para autenticación temporal desde CI en vez de PATs de larga duración.
 - No almacenes tokens en variables de entorno persistentes (como en archivos). Prefiere secrets locales o gestores de secretos.


 ## 7) Qué hacer si algo sale mal

 - Si sospechas que un token fue comprometido: revócalo inmediatamente y revisa logs/acciones en la organización.
 - Revisa `Audit log` de la organización para ver acciones realizadas.
 - Cambia contraseñas y notifica al equipo de seguridad si se detecta actividad sospechosa.


 ## 8) Soporte

 Si quieres, puedo:

 - Generar un script adicional que ejecute una serie de `gh api` específicas para tu org (lo haré solo si me confirmas que crearás un PAT nuevo y lo ejecutarás desde tu máquina).
 - Proponer un plan para migrar a GitHub Apps/OIDC para evitar PATs.


 ----
 Guía generada automáticamente por Copilot-assistant. Siempre revisa y personaliza los comandos antes de ejecutarlos en producción.
