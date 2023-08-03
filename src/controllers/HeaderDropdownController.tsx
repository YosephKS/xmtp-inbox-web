import { HeaderDropdown } from "../component-library/components/HeaderDropdown/HeaderDropdown";
import { RecipientInputMode } from "../helpers";
import useGetRecipientInputMode from "../hooks/useGetRecipientInputMode";
import { useXmtpStore } from "../store/xmtp";

export const HeaderDropdownController = () => {
  // XMTP State
  const setRecipientWalletAddress = useXmtpStore(
    (state) => state.setRecipientWalletAddress,
  );
  const setConversationTopic = useXmtpStore(
    (state) => state.setConversationTopic,
  );
  const setStartedFirstMessage = useXmtpStore(
    (state) => state.setStartedFirstMessage,
  );

  // XMTP Hooks
  const { setRecipientInputMode, setRecipientEnteredValue } =
    useGetRecipientInputMode();

  return (
    <HeaderDropdown
      onClick={() => {
        setRecipientWalletAddress("");
        setRecipientInputMode(RecipientInputMode.InvalidEntry);
        setConversationTopic();
        setRecipientEnteredValue("");
        setStartedFirstMessage(true);
      }}
      disabled
    />
  );
};
