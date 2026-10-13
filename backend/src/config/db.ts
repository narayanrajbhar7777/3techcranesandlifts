import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = `${process.env.DATABASE_URL}`;

function parseConnection(url: string) {
  // Normalize scheme so WHATWG URL can parse it (mariadb:// -> mysql://)
  const parsed = new URL(url.replace(/^mariadb:\/\//, 'mysql://'));
  const sslParam = parsed.searchParams.get('ssl');
  const useSsl = sslParam !== 'false';

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || undefined,
    ssl: useSsl ? true : undefined,
    connectionLimit: 5,
  };
}

const adapter = new PrismaMariaDb(
  connectionString && connectionString !== 'undefined'
    ? parseConnection(connectionString)
    : { host: 'localhost', port: 3306, user: 'root', password: '', database: 'test' }
);

const prisma = new PrismaClient({ adapter });

export default prisma;
