import { useEnsName } from "wagmi";
import type { CachedMessage } from "@xmtp/react-sdk";
import { useClient } from "@xmtp/react-sdk";
import { FullMessage } from "../component-library/components/FullMessage/FullMessage";
import { isValidLongWalletAddress, shortAddress } from "../helpers";
import type { address } from "../pages/inbox";
import MessageContentController from "./MessageContentController";

interface FullMessageControllerProps {
  msg: CachedMessage;
}

export const FullMessageController = ({ msg }: FullMessageControllerProps) => {
  const { client } = useClient();

  // Get ENS if exists from full address
  const { data: ensName } = useEnsName({
    address: msg.senderAddress as address,
    enabled: isValidLongWalletAddress(msg.senderAddress),
  });

  return (
    <FullMessage
      text={
        <MessageContentController
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          content={msg.content}
          isSelf={client?.address === msg.senderAddress}
          isLoading={msg.isSending}
          isError={!!msg.hasSendError}
        />
      }
      isError={!!msg.hasSendError}
      key={msg.xmtpID}
      from={{
        displayAddress: ensName ?? shortAddress(msg.senderAddress),
        isSelf: client?.address === msg.senderAddress,
      }}
      datetime={msg.sentAt}
    />
  );
};
