import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Image from 'next/image';
import { Server } from 'lucide-react';

type User = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
}

type ServerItem = {
    id: string;
    name: string;
}

type Item = User | ServerItem;


interface MentionListProps {
  items: Item[];
  command: (props: { id: string, type: 'user' | 'server' }) => void;
}

interface MentionListHandle {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

export const MentionList = forwardRef<MentionListHandle, MentionListProps>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
        if ('username' in item) { // It's a User
            props.command({ id: item.username, type: 'user' });
        } else { // It's a Server
            props.command({ id: item.name, type: 'server' });
        }
    }
  };

  const upHandler = () => {
    setSelectedIndex(((selectedIndex + props.items.length) - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  const isUser = (item: Item): item is User => 'username' in item;

  return (
    <div className="items hud-panel p-2">
      {props.items.length
        ? props.items.map((item, index: number) => (
          <button
            className={`item flex items-center gap-2 w-full text-left rounded-md p-2 transition-colors ${index === selectedIndex ? 'is-selected bg-emerald-500/20' : 'hover:bg-white/5'}`}
            key={isUser(item) ? item.id : (item as ServerItem).id}
            onClick={() => selectItem(index)}
          >
            {isUser(item) ? (
                <>
                    <Image 
                        src={item.avatar_url || '/default-avatar.png'} 
                        alt={item.username} 
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-bold text-white">{item.display_name}</p>
                        <p className="text-sm text-muted-foreground">@{item.username}</p>
                    </div>
                </>
            ) : (
                <>
                    <Server className="h-6 w-6 text-muted-foreground" />
                    <p className="font-bold text-white">{(item as ServerItem).name}</p>
                </>
            )}
          </button>
        ))
        : <div className="item">No result</div>
      }
    </div>
  );
});

MentionList.displayName = 'MentionList'; 