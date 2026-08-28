import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, IsIn, IsUrl } from 'class-validator';
import type { Session } from '../entities/session.entity';

export type SessionProxyType = 'http' | 'https' | 'socks4' | 'socks5';

export class SessionProxyResponseDto {
  @ApiProperty({ description: 'Whether a proxy URL is configured for this session', example: true })
  enabled!: boolean;

  @ApiProperty({
    description: 'Configured proxy protocol',
    enum: ['http', 'https', 'socks4', 'socks5'],
    nullable: true,
    example: 'http',
  })
  proxyType!: SessionProxyType | null;

  @ApiProperty({
    description: 'Proxy host:port parsed from the stored URL — credentials are never returned',
    nullable: true,
    example: 'proxy.example.com:8080',
  })
  proxyHost!: string | null;

  @ApiProperty({
    description: 'Whether the stored proxy URL embeds username/password credentials',
    example: false,
  })
  hasCredentials!: boolean;
}

export class UpdateSessionProxyDto {
  @ApiPropertyOptional({
    description:
      'Per-session egress proxy URL (http/https/socks4/socks5; credentialed form allowed). Send ' +
      '`null` to clear the proxy. Must be a real, reachable proxy — an unreachable value blocks the ' +
      'WhatsApp WebSocket and session start times out (~30s).',
    nullable: true,
    example: 'http://user:pass@proxy.example.com:8080',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @IsUrl(
    {
      protocols: ['http', 'https', 'socks4', 'socks5'],
      require_protocol: true,
      require_tld: false,
      allow_underscores: true,
    },
    { message: 'proxyUrl must be a valid http(s)/socks4/socks5 URL' },
  )
  proxyUrl?: string | null;

  @ApiPropertyOptional({
    description: 'Proxy protocol. Defaults to `http` when `proxyUrl` is set and this is omitted.',
    enum: ['http', 'https', 'socks4', 'socks5'],
    nullable: true,
    example: 'http',
  })
  @IsOptional()
  @IsIn(['http', 'https', 'socks4', 'socks5'])
  proxyType?: SessionProxyType | null;
}

/** Project stored proxy columns onto a safe response — never returns credentials. */
export function projectSessionProxy(session: Pick<Session, 'proxyUrl' | 'proxyType'>): SessionProxyResponseDto {
  if (!session.proxyUrl) {
    return { enabled: false, proxyType: null, proxyHost: null, hasCredentials: false };
  }

  try {
    const parsed = new URL(session.proxyUrl);
    return {
      enabled: true,
      proxyType: session.proxyType,
      proxyHost: parsed.host,
      hasCredentials: !!(parsed.username || parsed.password),
    };
  } catch {
    return {
      enabled: true,
      proxyType: session.proxyType,
      proxyHost: null,
      hasCredentials: false,
    };
  }
}
