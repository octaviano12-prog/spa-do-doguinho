const path = require("path");
const fs = require("fs/promises");

const uploadRoot = path.resolve(
  process.env.UPLOAD_DIR || path.join(__dirname, "../../public_html/uploads")
);

const MAX_FILE_SIZE = Number(process.env.UPLOAD_MAX_SIZE || 8 * 1024 * 1024);
const ALLOWED_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif"
};

function createError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function sanitizeFolder(value) {
  return String(value || "gallery")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "gallery";
}

function sanitizeFilename(value) {
  return String(value || "imagem")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "imagem";
}

function getBoundary(req) {
  const contentType = String(req.headers["content-type"] || "");
  const match = contentType.match(/boundary=([^;]+)/i);
  return match ? match[1].trim().replace(/^"|"$/g, "") : "";
}

function readRequest(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalSize = 0;
    let rejected = false;

    req.on("data", (chunk) => {
      totalSize += chunk.length;

      if (totalSize > MAX_FILE_SIZE) {
        rejected = true;
        reject(createError("Imagem muito grande. Envie uma foto de ate 8 MB.", 413));
        return;
      }

      chunks.push(chunk);
    });

    req.on("end", () => {
      if (!rejected) resolve(Buffer.concat(chunks));
    });

    req.on("error", reject);
  });
}

function parseMultipart(buffer, boundary, fieldName) {
  const marker = `--${boundary}`;
  const body = buffer.toString("latin1");
  const parts = body.split(marker).slice(1);

  for (const rawPart of parts) {
    if (!rawPart || rawPart.startsWith("--")) continue;

    const part = rawPart.startsWith("\r\n") ? rawPart.slice(2) : rawPart;
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;

    const headerText = part.slice(0, headerEnd);
    let fileContent = part.slice(headerEnd + 4);
    if (fileContent.endsWith("\r\n")) fileContent = fileContent.slice(0, -2);

    const nameMatch = headerText.match(/name="([^"]+)"/i);
    const filenameMatch = headerText.match(/filename="([^"]*)"/i);
    const mimeMatch = headerText.match(/Content-Type:\s*([^\r\n]+)/i);

    if (!nameMatch || nameMatch[1] !== fieldName || !filenameMatch || !filenameMatch[1]) {
      continue;
    }

    return {
      originalname: filenameMatch[1],
      mimetype: (mimeMatch && mimeMatch[1].trim().toLowerCase()) || "application/octet-stream",
      buffer: Buffer.from(fileContent, "latin1")
    };
  }

  return null;
}

function buildFilename(file) {
  const originalExtension = path.extname(file.originalname).toLowerCase();
  const extension = ALLOWED_MIME_TYPES[file.mimetype] || originalExtension || ".jpg";
  const basename = sanitizeFilename(path.basename(file.originalname, originalExtension));
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${unique}-${basename}${extension}`;
}

function single(fieldName) {
  return async (req, res, next) => {
    try {
      const boundary = getBoundary(req);
      if (!boundary) {
        throw createError("Envie a imagem em formato multipart/form-data.");
      }

      const body = await readRequest(req);
      const file = parseMultipart(body, boundary, fieldName);

      if (!file) {
        req.file = null;
        return next();
      }

      if (!ALLOWED_MIME_TYPES[file.mimetype]) {
        throw createError("Formato nao permitido. Use JPG, PNG, WEBP ou GIF.");
      }

      if (!file.buffer.length) {
        throw createError("Arquivo vazio.");
      }

      const folder = sanitizeFolder(req.params.folder || "gallery");
      const destination = path.join(uploadRoot, folder);
      await fs.mkdir(destination, { recursive: true });

      const filename = buildFilename(file);
      const diskPath = path.join(destination, filename);
      await fs.writeFile(diskPath, file.buffer);

      req.file = {
        fieldname: fieldName,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.buffer.length,
        filename,
        path: diskPath,
        relativePath: `/uploads/${folder}/${filename}`
      };

      return next();
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Erro ao enviar imagem."
      });
    }
  };
}

module.exports = {
  single,
  uploadRoot
};
