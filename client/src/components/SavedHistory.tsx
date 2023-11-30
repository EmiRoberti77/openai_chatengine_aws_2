import React, { useEffect, useState } from 'react';
import { CharServer } from '../API/ChatServer';
import ChatGptSavedHistoryItem from './ChatGptSavedHistoryItem';
import { SavedChatHistory } from '../API/model/SaveChatHistory';
import { Auth } from 'aws-amplify';
import { useSelector } from 'react-redux';
import { RootState } from '../state/Store';
import BedrockSavedHistoryItem from './BedrockSavedHistoryItem';
import OdinOaixSavesHistoryItem from './OdinOaixSavesHistoryItem';
import { SavedOaixChatHistory } from '../API/model/SavedOaixChatHistory';

const chatServer = new CharServer();
interface SavedHistoryProps {
  reload: boolean;
}
const SavedHistory: React.FC<SavedHistoryProps> = ({ reload }) => {
  const reduxUser = useSelector((state: RootState) => state.user);
  const [savedChats, setSavedChats] = useState<any[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSavedHistory = async () => {
    setLoading(true);
    const sessionUser = await Auth.currentAuthenticatedUser();
    const user = sessionUser.attributes.email;

    const response = await chatServer.getSavedChats(user);
    //console.log('response', response);
    setSavedChats(response);
    //console.log(savedChats);
    setLoading(false);
  };

  useEffect(() => {
    console.log('reduxUser', reduxUser);
    fetchSavedHistory().catch((error) => console.error(error));
    console.log('updated saveChats', savedChats);
  }, [reload]);

  return (
    <div>
      {loading && <div>loading .. </div>}
      <div>
        {savedChats?.map((item, index) => (
          <div key={`parent${index}`}>
            <div key={`child${index}`}>
              {item.engine.startsWith('bedrock') && (
                <BedrockSavedHistoryItem
                  savedChatItem={item as SavedChatHistory}
                />
              )}
              {item.engine.startsWith('chat') && (
                <ChatGptSavedHistoryItem
                  savedChatItem={item as SavedChatHistory}
                />
              )}
              {item.engine.startsWith('odin') && (
                <OdinOaixSavesHistoryItem
                  savedOaixChatHistory={item as SavedOaixChatHistory}
                />
              )}
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedHistory;
