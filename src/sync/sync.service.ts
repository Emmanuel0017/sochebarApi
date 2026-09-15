import { Injectable, OnModuleInit } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';
import { PrismaService } from '../prisma/prisma.service';

export interface SyncStatus {
  enabled: boolean;
  pending: number;
  syncing: boolean;
  lastSyncedAt: string | null;
  lastError: string | null;
}

const PUSH_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

@Injectable()
export class SyncService implements OnModuleInit {
  private client: AxiosInstance | null = null;
  private accessToken: string | null = null;
  private syncing = false;
  private lastSyncedAt: string | null = null;
  private lastError: string | null = null;

  constructor(private readonly prisma: PrismaService) {}

  private get config() {
    const targetUrl = process.env.SOCHEBAR_SYNC_TARGET_URL; // e.g. https://sochebar-api.onrender.com — origin only, no /api suffix
    const username = process.env.SOCHEBAR_SYNC_DEVICE_USERNAME;
    const password = process.env.SOCHEBAR_SYNC_DEVICE_PASSWORD;
    if (!targetUrl || !username || !password) return null;
    return { targetUrl, username, password };
  }

  onModuleInit() {
    // Only the local/offline app ever has outbox rows to push — this is
    // deliberately inert everywhere else (Render included), same
    // approach as the frontend static-serving and outbox-logging hooks.
    if (!this.config) return;
    this.client = axios.create({ baseURL: this.config.targetUrl, timeout: 20_000 });
    setInterval(() => this.push().catch(() => {}), PUSH_INTERVAL_MS);
    // Try once shortly after startup too, rather than waiting a full
    // interval on every app launch.
    setTimeout(() => this.push().catch(() => {}), 10_000);
  }

  async getStatus(): Promise<SyncStatus> {
    const pending = this.config ? await this.prisma.syncOutbox.count({ where: { pushedAt: null } }) : 0;
    return {
      enabled: !!this.config,
      pending,
      syncing: this.syncing,
      lastSyncedAt: this.lastSyncedAt,
      lastError: this.lastError,
    };
  }

  private async login(): Promise<void> {
    if (!this.client || !this.config) return;
    const { data } = await this.client.post('/api/auth/login', {
      username: this.config.username,
      password: this.config.password,
    });
    this.accessToken = data.accessToken;
  }

  async push(): Promise<void> {
    if (!this.client || !this.config || this.syncing) return;
    this.syncing = true;

    try {
      if (!this.accessToken) await this.login();

      const rows = await this.prisma.syncOutbox.findMany({
        where: { pushedAt: null },
        orderBy: { createdAt: 'asc' },
        take: 200, // a bounded batch keeps one push cycle from running forever if there's a large backlog
      });

      for (const row of rows) {
        const result = await this.replayOne(row);
        if (result === 'retry-later') break; // preserve order — stop rather than skip ahead
      }

      this.lastSyncedAt = new Date().toISOString();
    } catch (err: any) {
      this.lastError = err?.message ?? 'Sync failed';
    } finally {
      this.syncing = false;
    }
  }

  private async replayOne(row: { id: string; method: string; path: string; body: unknown }) {
    if (!this.client) return 'retry-later' as const;

    try {
      await this.client.request({
        method: row.method,
        url: row.path,
        data: row.body,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Idempotency-Key': row.id,
        },
      });
      await this.prisma.syncOutbox.update({ where: { id: row.id }, data: { pushedAt: new Date(), lastError: null } });
      return 'ok' as const;
    } catch (err: any) {
      if (!err.response) return 'retry-later' as const; // no connectivity — try again next cycle

      if (err.response.status === 401) {
        // Token expired mid-batch — refresh once and let the next
        // scheduled push retry this same row (still unpushed).
        this.accessToken = null;
        try {
          await this.login();
        } catch {
          /* will retry on the next cycle regardless */
        }
        return 'retry-later' as const;
      }

      // A genuine rejection (validation error, conflict, etc). Retrying
      // forever won't help — record why and move on rather than
      // blocking everything queued behind it.
      await this.prisma.syncOutbox.update({
        where: { id: row.id },
        data: { lastError: err.response?.data?.message ?? err.message },
      });
      return 'rejected' as const;
    }
  }
}
