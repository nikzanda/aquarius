import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

export {};

declare global {
  interface Window {
    $message: MessageApiInjection;
  }
}
