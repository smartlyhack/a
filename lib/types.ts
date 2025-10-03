export interface Token {
  id: string;
  symbol: string;
  name: string;
  network: string;
  balance: number;
  price?: number | null;
  coingeckoId: string;
}
