import got, { Got } from 'got';

interface Deal {
  redditId: string;
  redditTitle: string;
  gameUrl: string;
  createdAt: string;
}

interface Statistics {
  dealsCount: number;
  webhooksCount: number;

}

interface Webhook {
  webhookId: string;
  webhookToken: string;
  guildId: string;
  roleToMention?: string;
  keywords?: string[];
}

export interface ReadWebhook extends Webhook {
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface PatchWebhook {
  roleToMention?: string | null;
  keywords?: string[] | null;
}

class APIClient {
  private readonly request: Got;

  constructor() {
    this.request = got.extend({
      prefixUrl: process.env.API_URL,
    });
  }

  public async getStatistics(): Promise<Statistics> {
    return this.request.get('statistics').json();
  }

  public async getLastDeal(): Promise<Deal> {
    return this.request.get('deals/latest').json();
  }

  public async getWebhooksForGuild(guildID: string): Promise<ReadWebhook[]> {
    return this.request.get(`webhooks/guild/${guildID}`).json();
  }

  public async patchWebhook(webhookId: string, webhookPatch: PatchWebhook): Promise<ReadWebhook> {
    return this.request.patch(`webhooks/${webhookId}`, {
      json: webhookPatch,
    }).json();
  }

  public async deleteWebhook(webhookId: string): Promise<void> {
    return this.request.delete(`webhooks/${webhookId}`).json();
  }

  public async saveWebhook(webhook: Webhook): Promise<ReadWebhook> {
    return this.request.post('webhooks', {
      json: webhook,
    }).json();
  }
}

const client = new APIClient();
export default client;
