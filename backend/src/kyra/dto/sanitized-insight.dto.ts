export class SanitizedInsightDto {
  id!: string;
  title!: string;
  description!: string;
  severity!: 'info' | 'warning' | 'critical';
  domain!: string;
  createdAt!: string;
}
