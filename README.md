### 📚 Book Management API

Backend API para una plataforma de gestión y distribución de libros digitales, desarrollada con NestJS, TypeORM y PostgreSQL.

## 🚀 Características

- **Gestión completa de libros**: Catálogo, búsqueda, filtrado y descarga de libros digitales
- **Sistema de usuarios**: Registro, autenticación y autorización basada en roles (JWT)
- **Entidades relacionadas**: Autores, editoriales, géneros literarios
- **Interacción de usuarios**: Sistema de reseñas, calificaciones y favoritos
- **Almacenamiento en la nube**: Integración con Cloudinary para almacenar portadas y archivos PDF
- **Arquitectura modular**: Diseño escalable siguiendo principios SOLID y patrones de diseño
- **API RESTful**: Endpoints bien estructurados con respuestas estandarizadas
- **Manejo de errores**: Sistema centralizado para gestión de excepciones
- **Documentación**: Endpoints documentados para facilitar la integración

## 🛠️ Tecnologías

- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Class Validator
- **Almacenamiento**: Cloudinary
- **Contenedorización**: Docker y Docker Compose

## 📋 Requisitos

- Node.js (v14 o superior)
- PostgreSQL
- Cuenta en Cloudinary (para almacenamiento de archivos)
- Variables de entorno configuradas

## 🔧 Instalación

```shellscript
# Clonar el repositorio
git clone https://github.com/tu-usuario/proyecto-s7-backend.git

# Instalar dependencias
cd proyecto-s7-backend
npm install

# Configurar variables de entorno
cp .env.example .env.development
# Editar .env.development con tus credenciales

# Iniciar la base de datos con Docker
docker-compose up -d

# Iniciar el servidor en modo desarrollo
npm run start:dev
```

## 📝 Documentación

La API proporciona endpoints para gestionar:

- Usuarios y autenticación
- Libros y metadatos
- Autores, editoriales y géneros
- Reseñas y calificaciones
- Favoritos
- Carga y descarga de archivos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado como parte del proyecto académico para la gestión y distribución de libros digitales.
