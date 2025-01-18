export class Model {
  HOST = 'https://' + window.location.hostname + '/'

  constructor() {}

  api_url(endpoint: string): string {
    return this.HOST + endpoint
  }
}
