import type {
  Attachment,
  RemoteAttachment,
} from "xmtp-content-type-remote-attachment";
import type { Filelike } from "web3.storage";
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from "xmtp-content-type-remote-attachment";
import { Conversation } from "@xmtp/xmtp-js";
import { useCallback } from "react";
import { Web3Storage } from "web3.storage";

class Upload implements Filelike {
  name: string;
  data: Uint8Array;

  constructor(name: string, data: Uint8Array) {
    this.name = name;
    this.data = data;
  }

  stream(): ReadableStream {
    const self = this;
    return new ReadableStream({
      start(controller) {
        controller.enqueue(Buffer.from(self.data));
        controller.close();
      },
    });
  }
}

const useSendMessage = (
  selectedConversation?: Conversation,
  attachment?: Attachment,
) => {
  const sendMessage = useCallback(
    async (message: string) => {
      if (attachment) {
        const web3Storage = new Web3Storage({
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDdDRTI3ODdGODQ2MEFEMzc1RERlNEZBRmE2MTIwNTgxMjc1NzJlRjEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Nzc1MzMzMDc0NDcsIm5hbWUiOiJUZXN0In0.u7aofksiECPlAwLW7A1xl_l1LSY2rmrgjgTdDcARSjs",
        });

        const encryptedEncoded = await RemoteAttachmentCodec.encodeEncrypted(
          attachment,
          new AttachmentCodec(),
        );

        const upload = new Upload(
          "XMTP Encrypted Content",
          encryptedEncoded.payload,
        );

        const cid = await web3Storage.put([upload]);
        const url = `https://${cid}.ipfs.w3s.link`;

        const remoteAttachment: RemoteAttachment = {
          url: url,
          contentDigest: encryptedEncoded.digest,
          salt: encryptedEncoded.salt,
          nonce: encryptedEncoded.nonce,
          secret: encryptedEncoded.secret,
          scheme: "https",
          filename: attachment.filename,
          contentLength: attachment.data.byteLength,
        };

        await selectedConversation?.send(remoteAttachment);
      } else {
        await selectedConversation?.send(message);
      }
    },
    [selectedConversation, attachment],
  );

  return {
    sendMessage,
  };
};

export default useSendMessage;
