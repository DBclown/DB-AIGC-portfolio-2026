import React from 'react';

interface WatermarkOverlayProps {
  /** 水印密度模式：light 用于缩略图/卡片，dense 用于 Lightbox 大图 */
  variant?: 'light' | 'dense';
  /** 自定义水印文字 */
  text?: string;
  className?: string;
}

/**
 * WatermarkOverlay
 * 
 * 纯 CSS 实现的斜向重复文字水印层。
 * 使用 pointer-events: none 确保不影响下层交互。
 * 通过 SVG data-uri 生成可重复平铺的水印图案，兼容性好且体积极小。
 */
export default function WatermarkOverlay({
  variant = 'light',
  text = 'STARDUST LAB ©',
  className = ''
}: WatermarkOverlayProps) {
  // 根据密度模式调整参数
  const config = variant === 'dense'
    ? { fontSize: 14, spacing: 160, opacity: 0.055 }
    : { fontSize: 11, spacing: 130, opacity: 0.04 };

  // 生成 SVG 水印图案（45度旋转文字）
  const svgWatermark = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${config.spacing}" height="${config.spacing}" viewBox="0 0 ${config.spacing} ${config.spacing}">
      <text x="50%" y="50%" font-family="monospace" font-size="${config.fontSize}" font-weight="bold" fill="#024C38" text-anchor="middle" dominant-baseline="middle" transform="rotate(-35, ${config.spacing / 2}, ${config.spacing / 2})">${text}</text>
    </svg>`
  );

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-20 select-none ${className}`}
      style={{
        opacity: config.opacity,
        backgroundImage: `url("data:image/svg+xml,${svgWatermark}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${config.spacing}px ${config.spacing}px`,
      }}
    />
  );
}
