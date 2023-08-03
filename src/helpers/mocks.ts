import { ContentTypeText } from "@xmtp/react-sdk";
import type { CachedConversation, CachedMessage } from "@xmtp/react-sdk";

export const getMockConversation = (
  values?: Partial<CachedConversation>,
): CachedConversation => ({
  createdAt: new Date(),
  peerAddress: "",
  topic: "",
  isReady: true,
  updatedAt: new Date(),
  ...values,
});

export const getMockMessage = (
  values?: Partial<CachedMessage>,
): CachedMessage => ({
  senderAddress: "",
  hasSendError: false,
  isSending: false,
  status: "processed",
  xmtpID: window.crypto.randomUUID(),
  sentAt: new Date(),
  conversationTopic: "",
  contentType: ContentTypeText.toString(),
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  content: values?.content,
  ...values,
});
