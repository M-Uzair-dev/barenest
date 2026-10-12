import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

export async function loadDatabaseUrl(): Promise<void> {
  const secretId = process.env.DB_SECRET_ID;
  if (!secretId) return;

  const client = new SecretsManagerClient({ region: process.env.AWS_REGION });
  const res = await client.send(
    new GetSecretValueCommand({ SecretId: secretId }),
  );
  const s = JSON.parse(res.SecretString!);

  const user = encodeURIComponent(s.username);
  const pass = encodeURIComponent(s.password);
  const ca = process.env.DB_SSL_ROOT_CERT;

  process.env.DATABASE_URL =
    `postgresql://${user}:${pass}@${s.host}:${s.port}/${s.dbname}` +
    `?sslmode=verify-full&sslrootcert=${ca}`;
}
