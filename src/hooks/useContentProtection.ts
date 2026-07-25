import { useEffect, useState, useCallback } from 'react';

/**
 * useContentProtection
 * 
 * 全局静态资源防盗保护 Hook，在 App 根组件调用一次即可生效。
 * 
 * 防护层级：
 * 1. 拦截媒体元素（img/video/canvas）右键菜单
 * 2. 禁止媒体元素拖拽
 * 3. 拦截常见保存/DevTools 键盘快捷键
 * 4. DevTools 打开检测（启发式）→ 显示警告遮罩
 */

// 需要拦截右键和拖拽的元素标签
const PROTECTED_TAGS = new Set(['IMG', 'VIDEO', 'CANVAS']);

// 需要拦截的键盘快捷键组合
function isBlockedShortcut(e: KeyboardEvent): boolean {
  const ctrl = e.ctrlKey || e.metaKey;

  // Ctrl+S (保存页面) / Ctrl+U (查看源码)
  if (ctrl && !e.shiftKey && (e.key === 's' || e.key === 'u')) return true;

  // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools)
  if (ctrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) return true;

  // F12 (DevTools)
  if (e.key === 'F12') return true;

  // PrintScreen (截屏 — 仅能阻止默认剪贴板行为)
  if (e.key === 'PrintScreen') return true;

  return false;
}

export function useContentProtection() {
  const [devToolsOpen, setDevToolsOpen] = useState(false);

  // 右键菜单拦截（事件委托到 document）
  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && PROTECTED_TAGS.has(target.tagName)) {
      e.preventDefault();
    }
  }, []);

  // 拖拽拦截
  const handleDragStart = useCallback((e: DragEvent) => {
    const target = e.target as HTMLElement;
    if (target && PROTECTED_TAGS.has(target.tagName)) {
      e.preventDefault();
    }
  }, []);

  // 键盘快捷键拦截
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isBlockedShortcut(e)) {
      e.preventDefault();
      e.stopPropagation();

      // PrintScreen 特殊处理：尝试清空剪贴板
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText('').catch(() => {});
      }
    }
  }, []);

  // DevTools 检测（尺寸差异启发式）
  useEffect(() => {
    let checkInterval: ReturnType<typeof setInterval>;

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > 200;
      const heightDiff = window.outerHeight - window.innerHeight > 200;
      setDevToolsOpen(widthDiff || heightDiff);
    };

    // 每 1.5 秒检测一次
    checkInterval = setInterval(checkDevTools, 1500);

    return () => clearInterval(checkInterval);
  }, []);

  // 注册全局事件监听
  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleContextMenu, handleDragStart, handleKeyDown]);

  return { devToolsOpen, setDevToolsOpen };
}
