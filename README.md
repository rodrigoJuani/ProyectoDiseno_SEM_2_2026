# ProyectoDiseno_SEM_2_2026

Proyecto desarrollado con **React + TypeScript** para el frontend,
**Node.js + Express** para el backend y **PostgreSQL** como sistema de
gestión de base de datos.

---

## Tecnologías utilizadas

- React
- TypeScript
- Vite
- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- cors
- Python (solo para el entorno virtual `.venv`)

---

## Estructura del proyecto

```text
ProyectoDiseno_SEM_2_2026/
├── programa/
│   ├── backend/
│   │   ├── src/
│   │   ├── .env.example
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── package-lock.json
│
├── BdD_DEFINITIVA_7.sql
├── .gitignore
└── README.md
```

---

# 1. Requisitos previos (qué debes descargar)

Antes de ejecutar el proyecto se deben instalar los siguientes programas:

| Programa | Para qué sirve | Enlace de descarga |
|---|---|---|
| **Node.js** (LTS) | Ejecutar backend y frontend | https://nodejs.org/ |
| **npm** | Viene incluido con Node.js | — |
| **PostgreSQL** | Base de datos | https://www.postgresql.org/download/ |
| **Git** | Clonar y versionar el proyecto | https://git-scm.com/downloads |
| **Python** (3.10 o superior) | Solo si vas a usar `.venv` | https://www.python.org/downloads/ |
| **VS Code** | Editor recomendado | https://code.visualstudio.com/ |

> ⚠️ Al instalar **Python en Windows**, marca la casilla **"Add Python to PATH"**.
> Al instalar **Node.js**, acepta las opciones por defecto.

---

# 2. Verificar que todo está instalado

Abre una terminal (PowerShell en Windows) y ejecuta:

```bash
node --version
npm --version
psql --version
git --version
python --version
```

Si algún comando **no devuelve una versión**, significa que ese programa
no está instalado o no está en el PATH. Reinicia la terminal después de
instalar algo.

---

# 3. Clonar el repositorio

Desde una terminal:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta del proyecto:

```bash
cd ProyectoDiseno_SEM_2_2026
```

---

# 4. Extensiones recomendadas de VS Code

Abre VS Code y en el panel de **Extensiones** (Ctrl + Shift + X) instala:

### Obligatorias
- **ESLint** — `dbaeumer.vscode-eslint`
- **Prettier - Code formatter** — `esbenp.prettier-vscode`
- **Python** — `ms-python.python`
- **Pylance** — `ms-python.vscode-pylance`
- **PostgreSQL** — `ms-ossdata.vscode-pgsql` (o **SQLTools** + driver PostgreSQL)
- **DotENV** — `mikestead.dotenv` (resalta los `.env`)

### Muy recomendadas
- **ES7+ React/Redux/React-Native snippets** — `dsznajder.es7-react-js-snippets`
- **Auto Rename Tag** — `formulahendry.auto-rename-tag`
- **Path Intellisense** — `christian-kohler.path-intellisense`

- **Thunder Client** o **REST Client** — para probar la API sin Postman

> Puedes instalarlas desde la terminal con:
> ```bash
> code --install-extension dbaeumer.vscode-eslint
> code --install-extension esbenp.prettier-vscode
> code --install-extension ms-python.python
> code --install-extension ms-python.vscode-pylance
> code --install-extension mikestead.dotenv
> code --install-extension eamodio.gitlens
> ```

---

# 5. Configurar PostgreSQL

Antes de ejecutar el backend, PostgreSQL debe estar instalado y ejecutándose.

1. Abre pgAdmin
Búscalo en el menú de inicio de Windows o en el escritorio. Es la herramienta oficial de PostgreSQL y se instala junto con PostgreSQL.

2. Conéctate al servidor
Al abrirlo, te pedirá la contraseña maestra (la que pusiste cuando instalaste PostgreSQL).
Si no la recuerdas, suele ser postgres o la que hayas definido.

En el panel izquierdo verás algo así:

text
Servers
└── PostgreSQL 16
    ├── Databases
    ├── Login/Group Roles
    └── ...
Si no ves el servidor, haz clic derecho en Servers → Register → Server y complétalo:

Name: localhost

Host: localhost

Port: 5432

Username: postgres

Password: tu contraseña

3. Crea la base de datos compost
En el panel izquierdo, despliega Databases.

Haz clic derecho sobre Databases → Create → Database…

En el campo Database, escribe: compost

Pulsa Save.

Aparecerá compost en la lista de bases de datos.

4. Abre la Query Tool
Haz clic derecho sobre la base compost.

Selecciona Query Tool.

Se abrirá una pestaña nueva en el panel derecho, con un editor de SQL vacío.

5. Carga el archivo SQL
En la barra superior de la Query Tool, haz clic en el icono de carpeta (Open File).

Navega hasta tu archivo:

text
D:\carpeta_rodri_2_26\ProyectoDiseno_SEM_2_2026\BdD_DEFINITIVA_7.sql
Selecciónalo y pulsa Open.

Verás todo el contenido SQL cargado en el editor.

6. Ejecuta el script
Pulsa el botón ▶️ (Play / Execute) o presiona F5.

Abajo aparecerá un panel llamado Messages con algo así:

text
Query returned successfully...
Si hay errores, los verás en rojo. Léelos con cuidado (suelen ser por datos duplicados si ya ejecutaste el script antes).
---

# 6. Configurar el entorno virtual de Python (`.venv`)

El proyecto incluye una carpeta `.venv/`, que es un **entorno virtual de Python**.

> **Nota importante:** el backend del proyecto está hecho con **Node.js + Express**,
> por lo que **el `.venv` no es obligatorio** para ejecutar el backend.
> Sirve si vas a usar scripts auxiliares en Python (por ejemplo, generar datos,
> procesar la base de datos, etc.).

### 6.1 Crear el entorno virtual desde cero (si no existe)

```bash
python -m venv .venv --without-pip
```



### 6.2 Activar el entorno virtual

**En Windows PowerShell:**

```powershell o en el mismo visual estudio debes estar dentro de 'PS C:\Users\pc\Desktop\ProyectoDiseno_SEM_2_2026>'
.\.venv\Scripts\Activate.ps1
```

Si PowerShell bloquea la ejecución de scripts, primero ejecuta:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

y vuelve a intentar activar.

**En Windows CMD:**

```cmd
.venv\Scripts\activate.bat
```

Cuando esté activado, verás algo así al inicio de la terminal:

```text
(.venv) PS D:\carpeta_rodri_2_26\ProyectoDiseno_SEM_2_2026>
```

### 6.3 Desactivar el entorno virtual

Cuando termines de usarlo:

```bash
deactivate
```

El prefijo `(.venv)` desaparecerá.


### 6.4 Instalar dependencias de Python en el entorno

Si tienes un `requirements.txt`:

```bash
pip install -r requirements.txt
```

Si no lo tienes y quieres congelar tus dependencias actuales:

```bash
pip freeze > requirements.txt
```

---

# 7. Configurar las variables de entorno del backend

Entrar a la carpeta del backend:

```bash
cd programa/backend
```

El proyecto contiene el archivo:

```text
.env.example
```

Crea una copia y renómbrala como:

```text
.env
```

El archivo `.env` debe contener las credenciales de tu PostgreSQL local:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_de_la_base
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

> **Importante:** el archivo `.env` **no debe subirse a GitHub** si contiene
> contraseñas. Ya está excluido por `.gitignore`.

---

# 8. Instalar las dependencias del BACKEND

Desde `programa/backend`(en visual studio debes ir a esa ruta):

```bash
npm install
```

Esto instalará automáticamente las dependencias de `package.json`:
Express, `pg`, CORS, dotenv, entre otras.

---

# 9. EJECUTAR PRIMERO EL BACKEND

**El backend debe ejecutarse primero**, porque el frontend consume su API.

Desde `programa/backend`(en visual studio debes ir a esa ruta):

```bash
npm run dev
```

El servidor debería iniciar en:

```text
http://localhost:4000
```

Verás algo como:

```text
API escuchando en http://localhost:4000
```

**No cierres esta terminal.**

---

# 10. Abrir una SEGUNDA terminal para el FRONTEND

Deja la Terminal 1 con el backend corriendo.

Abre una **segunda terminal** en VS Code (**Terminal → New Terminal**) y ve a:

```bash
cd programa/frontend(en visual studio debes ir a esa ruta)
```

Instala las dependencias:

```bash
npm install
```

Y ejecuta:

```bash
npm run dev
```

Vite mostrará algo como:

```text
Local: http://localhost:5173/
```

Abre esa dirección en el navegador:

```text
http://localhost:5173
```

---

# 11. Orden correcto para ejecutar el proyecto

```text
1. Iniciar PostgreSQL
        ↓
2. Verificar/configurar .env
        ↓
3. Ejecutar BdD_DEFINITIVA_7.sql
        ↓
4. (Opcional) Activar .venv si usas Python
        ↓
5. Terminal 1 → instalar y ejecutar backend
        ↓
6. Terminal 2 → instalar y ejecutar frontend
        ↓
7. Abrir http://localhost:5173
        ↓
8. Al terminar → deactivate (si activaste .venv)
```
---



#YA NO ES NECESARIO LO DE ABAJO(BORRAR?)
# 12. Comandos rápidos

## Backend (Terminal 1)

```bash
cd programa/backend
npm install
npm run dev
```

Backend: `http://localhost:4000`

## Frontend (Terminal 2)

```bash
cd programa/frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Entorno virtual Python

Activar (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

Desactivar:

```bash
deactivate
```

---

# 13. Archivos que NO deben subirse a GitHub

```text
.venv/
node_modules/
.env
dist/
build/
```

Están excluidos por `.gitignore`.

Sí se deben subir:

```text
package.json
package-lock.json
.env.example
BdD_DEFINITIVA_7.sql
src/
public/
README.md
.gitignore
```

---

# 14. Solución de problemas

### ❌ `npm` no se reconoce
Instala Node.js y reinicia la terminal. Comprueba con:
```bash
node --version
npm --version
```

### ❌ `python` no se reconoce
Al instalar Python, marca **"Add Python to PATH"**. Comprueba con:
```bash
python --version
```

### ❌ Error al activar `.venv` en PowerShell
Ejecuta una vez:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Y vuelve a intentar:
```powershell
.\.venv\Scripts\Activate.ps1
```

### ❌ Error de conexión con PostgreSQL
Verifica:
1. Que PostgreSQL esté corriendo.
2. Que la base de datos exista.
3. Que hayas ejecutado `BdD_DEFINITIVA_7.sql`.
4. Que los datos del `.env` sean correctos.

### ❌ El frontend no se conecta con el backend
Verifica que el backend esté activo en `http://localhost:4000` antes de
levantar el frontend.

### ❌ Error relacionado con `node_modules`
Ejecuta `npm install` dentro de la carpeta que corresponda:
```bash
cd programa/backend  && npm install
cd programa/frontend && npm install
```

---

# 15. Autor

Proyecto académico desarrollado con React + TypeScript,
Node.js + Express y PostgreSQL.

**Nombre del proyecto:** `ProyectoDiseno_SEM_2_2026`