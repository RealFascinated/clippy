# Clippy

Clippy is an open-source ShareX uploader that provides a modern and efficient way to share files and manage uploads. Built with Next.js and TypeScript, it offers a sleek user interface and robust backend functionality.

![App Preview](https://cdn.fascinated.cc/Ysf7vZtl.webp)

## Features

- 🚀 Modern web interface built with Next.js and React
- 🔒 Secure authentication system with registration control
- 📁 Flexible file storage options (Local & S3-compatible)
- 🖼️ Automatic image compression
- 📊 File analytics and statistics
- 🎯 Custom file ID length configuration
- 🔍 MIME type filtering
- 🐳 Docker support for easy deployment
- 📱 Responsive design with dark mode support
- 🔄 CLI tools for file management

## Prerequisites

- Docker and Docker Compose
- (Optional) S3-compatible storage service for cloud storage
- Node.js/Bun for local development

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your environment variables
3. Run the application:
   ```bash
   docker compose up -d
   ```

## CLI Tools

```bash
bun cli --help
```

## Development

1. Install dependencies:
   ```bash
   bun install
   ```

2. Spin up a local postgres server:
   ```bash
   docker compose up db -d
   ```

3. Start the development server:
   ```bash
   bun dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license information here]
